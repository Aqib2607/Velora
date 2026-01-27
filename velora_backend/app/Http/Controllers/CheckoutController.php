<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends BaseController
{
    protected $orderService;

    public function __construct(PaymentService $paymentService, \App\Services\OrderService $orderService)
    {
        $this->paymentService = $paymentService;
        $this->orderService = $orderService;
    }

    /**
     * Initiate Checkout.
     */
    public function init(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'payment_method' => 'required|string|in:stripe,sslcommerz,cod',
        ]);

        try {
            $order = $this->orderService->createOrder(
                $request->user(),
                $request->input('items'),
                $request->input('payment_method'),
                $request->input('shipping_address')
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }

        // Initiate Payment if needed
        $clientSecret = null;
        if ($request->payment_method === 'stripe') {
            try {
                $clientSecret = $this->paymentService->createPaymentIntent($order);
            } catch (\Exception $e) {
                // If payment intent fails, do we delete order?
                // Or keep it pending payment?
                // Keep it, frontend can retry payment.
                return $this->error('Order created but payment initialization failed: '.$e->getMessage(), 500, ['order_id' => $order->id]);
            }
        }

        return $this->success('Checkout initiated', [
            'order_id' => $order->id,
            'total_amount' => $order->total_amount,
            'client_secret' => $clientSecret,
        ]);
    }

    /**
     * Handle Payment Success (Webhook Simulation).
     */
    public function paymentSuccess(Request $request)
    {
        // In reality, this endpoint would verify the Stripe Webhook signature.
        // For simulation, we accept order_id and mock payment ID.

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            // 'payment_intent_id' => 'required',
        ]);

        $orderId = $request->order_id;

        DB::beginTransaction();

        try {
            $order = Order::lockForUpdate()->findOrFail($orderId);

            if ($order->payment_status === 'paid') {
                DB::rollBack();

                return $this->success('Order already paid');
            }

            // 1. Update Order Status
            $order->status = 'processing';
            $order->payment_status = 'paid';
            $order->save();

            // 2. Decrement Stock
            foreach ($order->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if ($product && $product->stock_quantity >= $item->quantity) {
                    $product->decrement('stock_quantity', $item->quantity);
                } else {
                    // Critical error: Stock mismatch during payment!
                    // In real world, refund or handle gracefully.
                    throw new \Exception("Stock error for product {$item->product_id}");
                }
            }

            // 3. Send Email (Queue)
            // Mail::to($order->user)->queue(new OrderConfirmation($order));

            DB::commit();

            return $this->success('Order finalized successfully');

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->error('Failed to finalize order: '.$e->getMessage(), 500);
        }
    }
}
