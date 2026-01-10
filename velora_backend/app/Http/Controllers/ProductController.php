<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends BaseController
{
    /**
     * Display a listing of the products (Public).
     */
    public function index(Request $request)
    {
        $query = Product::query()->where('status', 'published');

        if ($request->has('filter.category_id')) {
            $query->where('category_id', $request->input('filter.category_id'));
        }

        if ($request->has('filter.search')) {
            $search = $request->input('filter.search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('sort')) {
            $sort = $request->input('sort');
            if ($sort === 'price') {
                $query->orderBy('price', 'asc');
            } elseif ($sort === '-price') {
                $query->orderBy('price', 'desc');
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12);

        return $this->success('Products retrieved successfully', \App\Http\Resources\ProductResource::collection($products)->response()->getData(true));
    }

    /**
     * Store a newly created product (Vendor).
     */
    public function store(Request $request, \App\Services\ImageService $imageService)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|max:5120',
        ]);

        $user = $request->user();
        if (! $user->shop) {
            return $this->error('You do not have a shop.', 403);
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Resize to 1000x1000 and optimize
                $imagePaths[] = $imageService->optimizeAndSave($image, 'products', 1000, 1000);
            }
        }

        $product = Product::create([
            'shop_id' => $user->shop->id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(6),
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'images' => $imagePaths,
            'status' => 'published',
            'is_featured' => false,
        ]);

        return $this->success('Product created successfully', $product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(string $slug)
    {
        $product = Product::with(['shop', 'category', 'reviews.user'])
            ->where('slug', $slug)
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
