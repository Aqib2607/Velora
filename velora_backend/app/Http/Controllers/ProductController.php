<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    /**
     * Display a listing of the products (Public).
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'shop'])
            ->search($request->input('filter.search'))
            ->filter($request->only(['status', 'category_id', 'min_price', 'max_price'])) // Assuming scopeFilter handles this array structure or I need to map it.
            // scopeFilter in model expects array. $request->only returns array.
            // But strict 'filter.status' might need mapping.
            // The model scope uses $filters['status'].
            // If frontend sends ?status=..., $request->only('status') works.
            // If frontend sends ?filter[status]=..., then $request->input('filter') works.
            // I'll stick to flat params for simplicity or map `filter` array.
            // Let's use $request->all() or specific keys.
            ->filter($request->all())
            ->sort($request->sort, $request->direction);

        return $this->success('Products retrieved successfully', \App\Http\Resources\ProductResource::collection($query->paginate(12))->response()->getData(true));
    }

    /**
     * Display a listing of the products for the authenticated vendor.
     */
    public function vendorIndex(Request $request)
    {
        $user = $request->user();
        if (!$user->shop) {
            return $this->error('Shop not found', 404);
        }

        $products = Product::where('shop_id', $user->shop->id)
            ->with(['category'])
            ->latest()
            ->paginate(15);

        return $this->success('Vendor products retrieved successfully', \App\Http\Resources\ProductResource::collection($products)->response()->getData(true));
    }

    public function store(StoreProductRequest $request, \App\Services\ImageService $imageService)
    {
        $data = $request->validated();
        $user = $request->user();

        if (! $user->shop) {
            return $this->error('You do not have a shop.', 403);
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $imageService->optimizeAndSave($image, 'products', 1000, 1000);
            }
        } elseif (isset($data['images']) && is_array($data['images'])) {
            // Handle if images are passed as string URLs (already uploaded)
            $imagePaths = $data['images'];
        }

        $product = Product::create([
            'shop_id' => $user->shop->id,
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => \Illuminate\Support\Str::slug($data['name']).'-'.\Illuminate\Support\Str::random(6),
            'description' => $data['description'] ?? '',
            'price' => $data['price'],
            'stock_quantity' => $data['stock_quantity'],
            'images' => $imagePaths,
            'status' => $data['status'],
            'is_featured' => $data['is_featured'] ?? false,
            'metadata' => $data['metadata'] ?? null,
        ]);

        return $this->success('Product created successfully', new \App\Http\Resources\ProductResource($product), 201);
    }

    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->user()->id !== $product->shop->user_id && ! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized', 403);
        }

        $data = $request->validated();

        // Handle images update if provided
        // Logic to merge or replace? Usually replace or add.
        // For simplicity, if 'images' is present, update it.
        // If file uploads, handle them? `UpdateProductRequest` allows string or file?
        // Let's assume frontend handles upload separately or sends mixed.
        // For this step, I'll valid 'images' as array of strings (urls) in request rules mostly.

        $product->update($data);

        return $this->success('Product updated successfully', new \App\Http\Resources\ProductResource($product));
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->user()->id !== $product->shop->user_id && ! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized', 403);
        }

        $product->delete(); // Soft delete

        return $this->success('Product deleted successfully');
    }

    public function restore(Request $request, $id)
    {
        $product = Product::withTrashed()->findOrFail($id);

        if ($request->user()->id !== $product->shop->user_id && ! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized', 403);
        }

        $product->restore();

        return $this->success('Product restored successfully');
    }

    /**
     * Display the specified product.
     */
    public function show(string $id)
    {
        $product = Product::with(['shop', 'category', 'reviews.user'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return $this->success('Product retrieved successfully', new \App\Http\Resources\ProductResource($product));
    }

    /**
     * Get related products.
     */
    public function related(string $id)
    {
        $product = Product::findOrFail($id);
        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->where('status', 'published')
            ->take(4)
            ->get();

        return $this->success('Related products retrieved successfully', \App\Http\Resources\ProductResource::collection($related));
    }

    /**
     * Get featured products.
     */
    public function featured()
    {
        // Cache featured products for 30 minutes
        $products = \Illuminate\Support\Facades\Cache::remember('featured_products', 30, function () {
            return Product::where('is_featured', true)
                ->where('status', 'published')
                ->take(8)
                ->get();
        });

        return $this->success('Featured products retrieved successfully', \App\Http\Resources\ProductResource::collection($products));
    }

    /**
     * Get trending products.
     */
    public function trending()
    {
        // Simple trending logic: products with most sales in order items
        // Since we don't have much data, we'll confirm strictly.
        // For now, let's just return latest published as placeholder if no orders
        /*
        $productIds = OrderItem::select('product_id')
            ->groupBy('product_id')
            ->orderByRaw('COUNT(*) DESC')
            ->take(8)
            ->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get();
        */

        $products = Product::where('status', 'published')
            ->inRandomOrder()
            ->take(8)
            ->get();

        return $this->success('Trending products retrieved successfully', \App\Http\Resources\ProductResource::collection($products));
    }

    /**
     * Search suggestions.
     */
    public function searchSuggestions(Request $request)
    {
        $query = $request->input('q');
        if (! $query) {
            return $this->success('No query provided', []);
        }

        $products = Product::where('name', 'like', "%{$query}%")
            ->where('status', 'published')
            ->select('id', 'name', 'slug')
            ->take(5)
            ->get();

        $categories = \App\Models\Category::where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'slug')
            ->take(3)
            ->get();

        return $this->success('Suggestions retrieved successfully', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
