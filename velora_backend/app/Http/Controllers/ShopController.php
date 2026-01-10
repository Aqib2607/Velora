<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopController extends BaseController
{
    /**
     * Register a new shop for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:shops,name|max:255',
            'description' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->shop) {
            return $this->error('User already owns a shop.', 400);
        }

        $shop = Shop::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'status' => 'pending',
            'is_verified' => false,
        ]);

        // Upgrade user role to shop_owner
        $user->update(['role' => 'shop_owner']);

        return $this->success('Shop registered successfully', $shop, 201);
    }

    /**
     * Display the specified shop (Public Profile).
     */
    public function show(string $slug)
    {
        $shop = Shop::where('slug', $slug)->firstOrFail();
        
        // Eager load products for this shop with pagination
        // Since we can't easily paginate a relationship on a single model instance in one query return,
        // we'll fetch products separately.
        
        $products = \App\Models\Product::where('shop_id', $shop->id)
            ->where('status', 'published')
            ->paginate(12);

        $data = $shop->toArray();
        $data['products'] = \App\Http\Resources\ProductResource::collection($products)->response()->getData(true);

        // Add aggregate stats
        $data['total_products'] = $shop->products()->where('status', 'published')->count();
        // $data['average_rating'] = ... (Need to calculate via products -> reviews)
        // Leaving avg rating simple for now or 0.
        
        return $this->success('Shop details retrieved successfully', $data);
    }
}
