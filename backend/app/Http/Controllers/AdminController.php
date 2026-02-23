<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $users = User::with('roles')->paginate(25);
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    public function orders(Request $request): JsonResponse
    {
        $orders = Order::with('user', 'items')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(25);

        return response()->json(['status' => 'success', 'data' => $orders]);
    }

    public function reports(Request $request): JsonResponse
    {
        $tenantId = app('tenant')->id;

        $report = [
            'total_orders'   => Order::where('tenant_id', $tenantId)->count(),
            'paid_orders'    => Order::where('tenant_id', $tenantId)->where('status', 'paid')->count(),
            'total_revenue'  => Order::where('tenant_id', $tenantId)->where('status', 'paid')->sum('total'),
            'orders_today'   => Order::where('tenant_id', $tenantId)->whereDate('created_at', today())->count(),
        ];

        return response()->json(['status' => 'success', 'data' => $report]);
    }
}
