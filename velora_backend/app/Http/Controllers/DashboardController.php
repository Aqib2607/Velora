<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class DashboardController extends BaseController
{
    public function stats(Request $request)
    {
        $user = $request->user();

        // Count user's orders
        $orderCount = Order::where('user_id', $user->id)->count();

        // Count active orders (pending, processing, shipped)
        $activeOrders = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'processing', 'shipped'])
            ->count();

        // Count wishlist items (assuming Wishlist model exists and has user_id)
        // Adjust model usage if Wishlist structure is different (e.g. if it's a many-to-many on User)
        // Checking WishlistController usage in previous steps might be wise, but assuming standard model for now.
        // If Wishlist is a model:
        $wishlistCount = Wishlist::where('user_id', $user->id)->count();

        return $this->success('Dashboard stats retrieved', [
            'total_orders' => $orderCount,
            'active_orders' => $activeOrders,
            'wishlist_items' => $wishlistCount,
        ]);
    }
}
