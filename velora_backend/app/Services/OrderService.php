<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order.
     *
     * @param  array  $items  Input items with product_id and quantity
     *
     * @throws Exception
     */
    public function createOrder(User $user, array $items, string $paymentMethod, array $shippingAddress): Order
    {
        $productIds = collect($items)->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $totalAmount = 0;
        $orderItemsData = [];

        foreach ($items as $item) {
            $product = $products[$item['product_id']] ?? null;

            if (! $product) {
                throw new Exception("Product ID {$item['product_id']} not found.");
            }

            if ($product->stock_quantity < $item['quantity']) {
                throw new Exception("Product '{$product->name}' is out of stock or requested quantity unavailable.");
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

        return DB::transaction(function () use ($user, $totalAmount, $paymentMethod, $shippingAddress, $orderItemsData) {
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'subtotal' => $totalAmount,
                'tax' => 0,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $paymentMethod,
                'shipping_address' => $shippingAddress, // Ensure model casts this to array/json
            ]);

            foreach ($orderItemsData as $data) {
                $order->items()->create($data);
            }

            return $order;
        });
    }
}
