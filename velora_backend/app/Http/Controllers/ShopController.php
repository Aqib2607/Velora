<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShopRequest;
use App\Models\Shop;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopController extends BaseController
{
    /**
     * Create a new shop for the authenticated user.
     */
    public function store(ShopRequest $request)
    {
        $user = $request->user();

        if ($user->shop) {
            return $this->error('User already has a shop', 400);
        }

        $shop = Shop::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'logo_url' => $request->logo_url,
            'banner_url' => $request->banner_url,
            'status' => 'active', // Auto-activate for now
        ]);

        return $this->success('Shop created successfully', $shop, 201);
    }

    /**
     * Get the authenticated user's shop.
     */
    public function me(Request $request)
    {
        $shop = $request->user()->shop;

        if (!$shop) {
            return $this->error('Shop not found', 404);
        }

        return $this->success('Shop retrieved successfully', $shop);
    }

    /**
     * Update the authenticated user's shop.
     */
    public function update(ShopRequest $request)
    {
        $shop = $request->user()->shop;

        if (!$shop) {
            return $this->error('Shop not found', 404);
        }

        $data = $request->validated();
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $shop->update($data);

        return $this->success('Shop updated successfully', $shop);
    }

    /**
     * Get dashboard statistics for the vendor.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $shop = $user->shop;

        if (!$shop) {
            return $this->error('Shop not found', 404);
        }

        // Calculate stats
        // Note: Logic assumes OrderItem has shop_id relation properly set up.
        // If OrderItem doesn't populate shop_id (requires multi-vendor logic), 
        // we might need to filter by products belonging to shop.
        
        $products = Product::where('shop_id', $shop->id)->get();
        $productIds = $products->pluck('id');

        // Total Sales (Simulated - in real app, query Orders related to Shop's products)
        // Since we are building MVP, we mock or use basic queries.
        
        // Orders specific to this shop (via order items)
        $ordersCount = \App\Models\OrderItem::whereIn('product_id', $productIds)
            ->distinct('order_id')
            ->count();

        // Revenue (Sum of OrderItems for this shop)
        $revenue = \App\Models\OrderItem::whereIn('product_id', $productIds)
            ->sum('total');

        $productsCount = $products->count();

        // Get Recent Orders (Limit 5)
        // We need to join users to get customer name
        $recentOrders = \App\Models\OrderItem::whereIn('product_id', $productIds)
            ->with(['order.user', 'product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'ORD-' . str_pad($item->order_id, 3, '0', STR_PAD_LEFT),
                    'customer' => $item->order->user->name ?? 'Guest',
                    'product' => $item->product->name,
                    'amount' => '$' . number_format($item->total, 2),
                    'status' => $item->order->status,
                ];
            });
            
        return $this->success('Dashboard stats retrieved', [
            'stats' => [
                'total_sales' => '$' . number_format($revenue, 2),
                'orders_count' => $ordersCount,
                'products_count' => $productsCount,
                'revenue' => '$' . number_format($revenue, 2), // Sales vs Revenue same for now
            ],
            'recent_orders' => $recentOrders
        ]);
    }
}
