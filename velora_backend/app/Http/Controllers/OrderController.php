<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    /**
     * Display a listing of the resource (User Order History).
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return $this->success('Orders retrieved successfully', \App\Http\Resources\OrderResource::collection($orders)->response()->getData(true));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $order = Order::with('items.product')->findOrFail($id);

        if ($request->user()->id !== $order->user_id && $request->user()->role !== 'admin') {
            return $this->error('Unauthorized access to order.', 403);
        }

        return $this->success('Order details retrieved successfully', new \App\Http\Resources\OrderResource($order));
    }

    /**
     * Get orders for a vendor.
     */
    public function vendorOrders(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('shop_owner')) {
            return $this->error('Unauthorized.', 403);
        }

        $shop = $user->shop;
        if (! $shop) {
            return $this->error('Shop not found.', 404);
        }

        // Get items belonging to this shop across all orders
        $items = OrderItem::where('shop_id', $shop->id)
            ->with(['order', 'product'])
            ->latest()
            ->paginate(20);

        return $this->success('Vendor orders retrieved successfully', $items);
    }

    /**
     * Get all orders for Admin.
     */
    public function adminOrders(Request $request)
    {
        if (! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized.', 403);
        }

        $orders = Order::with(['user', 'items'])
            ->latest()
            ->paginate(20);

        return $this->success('All orders retrieved successfully', $orders);
    }

    /**
     * Update order status.
     */
    /**
     * Update order status (Admin only).
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $user = $request->user();
        
        if (!$user->hasRole('admin')) {
             return $this->error('Unauthorized', 403);
        }

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return $this->success('Order status updated successfully', $order);
    }

    /**
     * Update individual order item status (Vendor).
     */
    public function updateItemStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $user = $request->user();
        if (!$user->shop) {
             return $this->error('Unauthorized', 403);
        }

        $orderItem = OrderItem::where('id', $id)
            ->where('shop_id', $user->shop->id)
            ->firstOrFail();

        $orderItem->status = $request->status;
        $orderItem->save();

        return $this->success('Item status updated successfully', $orderItem);
    }

    /**
     * Generate PDF Invoice.
     */
    public function invoice(Request $request, string $id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);

        // Authorization: User owns order or Admin
        if ($request->user()->id !== $order->user_id && ! $request->user()->hasRole('admin')) {
            return $this->error('Unauthorized.', 403);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoice', ['order' => $order]);

        return $pdf->download('invoice-'.$order->id.'.pdf');
    }

    /**
     * Export Orders to CSV.
     */
    public function export(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return $this->error('Export currently available for Admins only.', 403);
        }

        $query = Order::with(['items.product', 'user'])->latest();

        $fileName = 'orders_export_'.date('Y-m-d_H-i').'.csv';

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');

            // Header Row
            fputcsv($file, ['Order ID', 'Customer Name', 'Customer Email', 'Total Amount', 'Status', 'Date']);

            // Chunking for memory efficiency
            $query->chunk(100, function ($orders) use ($file) {
                foreach ($orders as $order) {
                    fputcsv($file, [
                        $order->id,
                        $order->user ? $order->user->name : 'N/A',
                        $order->user ? $order->user->email : 'N/A',
                        $order->total_amount,
                        $order->status,
                        $order->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
