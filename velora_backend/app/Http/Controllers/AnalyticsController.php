<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends BaseController
{
    /**
     * Vendor Stats.
     */
    public function vendorStats(Request $request)
    {
        $user = $request->user();
        if (! $user->hasRole('shop_owner') || ! $user->shop) {
            return $this->error('Unauthorized or Shop not found.', 403);
        }

        $shopId = $user->shop->id;

        // Total Earnings (Sum of line totals for this shop)
        $totalEarnings = OrderItem::where('shop_id', $shopId)->sum('total');

        // Total Orders (Count unique orders containing shop items)
        $totalOrders = OrderItem::where('shop_id', $shopId)->distinct('order_id')->count('order_id');

        // Products Sold (Sum of quantities)
        $productsSold = OrderItem::where('shop_id', $shopId)->sum('quantity');

        // Chart Data: Sales last 7 days
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $salesData = OrderItem::where('shop_id', $shopId)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i)->format('Y-m-d');
            $chartData[$date] = $salesData[$date]->total ?? 0;
        }

        return $this->success('Vendor stats retrieved successfully', [
            'total_earnings' => $totalEarnings,
            'total_orders' => $totalOrders,
            'products_sold' => $productsSold,
            'chart_data' => $chartData,
        ]);
    }

    /**
     * Admin Stats.
     */
    public function adminStats(Request $request)
    {
        if (! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized.', 403);
        }

        $totalUsers = User::count();
        $totalOrders = Order::count();
        $totalProducts = \App\Models\Product::count();
        $activeShops = Shop::where('status', 'active')->count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

        // Recent Activity (Combined Orders and New Users)
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'type' => 'order',
                    'title' => 'Order #' . $order->id . ' Placed',
                    'description' => '$' . number_format($order->total_amount, 2) . ' • ' . $order->status,
                    'time' => $order->created_at->diffForHumans(),
                    'timestamp' => $order->created_at->timestamp,
                ];
            });

        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'user',
                    'title' => 'New User Registered',
                    'description' => $user->name,
                    'time' => $user->created_at->diffForHumans(),
                    'timestamp' => $user->created_at->timestamp,
                ];
            });

        // Merge and sort by timestamp desc, take top 10
        $recentActivity = $recentOrders->concat($recentUsers)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        return $this->success('Admin stats retrieved successfully', [
            'total_users' => $totalUsers,
            'total_orders' => $totalOrders,
            'total_products' => $totalProducts,
            'active_shops' => $activeShops,
            'total_revenue' => $totalRevenue,
            'recent_activity' => $recentActivity,
        ]);
    }
}
