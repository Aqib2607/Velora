<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends BaseController
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
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
            'shipping_address' => 'required|array', // Assume full address object for now
            'payment_method' => 'required|string|in:stripe,sslcommerz',
        ]);

        $user = $request->user();
        $inputItems = $request->input('items');
        $productIds = collect($inputItems)->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $totalAmount = 0;
        $orderItemsData = [];

        // 1. Calculate and Validate
        foreach ($inputItems as $item) {
            $product = $products[$item['product_id']] ?? null;
            if (! $product || $product->stock_quantity < $item['quantity']) {
                return $this->error("Product '{$product->name}' is out of stock or requested quantity unavailable.", 400);
            }

            $lineTotal = $product->price * $item['quantity'];
            $totalAmount += $lineTotal;

            $orderItemsData[] = [
                'product_id' => $product->id,
                'shop_id' => $product->shop_id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'total' => $lineTotal,
            ];
        }

        // 2. Create Order (Pending Payment)
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $totalAmount,
            'subtotal' => $totalAmount, // Assuming no tax/shipping calc for now
            'tax' => 0,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method,
            'shipping_address' => $request->shipping_address,
        ]);

        // 3. Create Order Items
        foreach ($orderItemsData as $itemData) {
            $order->items()->create($itemData);
        }

        // 4. Initiate Payment
        $clientSecret = $this->paymentService->createPaymentIntent($order);

        return $this->success('Checkout initiated', [
            'order_id' => $order->id,
            'total_amount' => $totalAmount,
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
            return $this->error('Failed to finalize order: ' . $e->getMessage(), 500);
        }
    }
}
