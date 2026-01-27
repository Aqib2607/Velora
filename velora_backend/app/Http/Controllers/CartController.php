<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends BaseController
{
    /**
     * Synchronize cart with server state.
     */
    public function sync(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $inputItems = $request->input('items', []);
        $productIds = collect($inputItems)->pluck('product_id')->toArray();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $validatedItems = [];
        $messages = [];
        $subtotal = 0;
        $isValid = true;

        foreach ($inputItems as $item) {
            $productId = $item['product_id'];
            $requestedQty = $item['quantity'];

            if (! isset($products[$productId])) {
                continue; // Product might have been deleted
            }

            $product = $products[$productId];
            // Fix: Access is_featured as boolean if needed, logic here focuses on stock

            $stock = $product->stock_quantity;
            $adjustedQty = $requestedQty;

            if ($stock < $requestedQty) {
                $isValid = false;
                $messages[] = "Quantity for '{$product->name}' adjusted from {$requestedQty} to {$stock} due to low stock.";
                $adjustedQty = $stock;
            }

            // If stock is 0, item is removed effectively (qty 0) or we can flag it
            if ($stock === 0) {
                $isValid = false;
                $messages[] = "'{$product->name}' is out of stock and removed from cart.";
                $adjustedQty = 0;
            }

            if ($adjustedQty > 0) {
                $lineTotal = round($product->price * $adjustedQty, 2); // Ensure float precision
                $subtotal += $lineTotal;

                $validatedItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'quantity' => $adjustedQty,
                    'stock_quantity' => $stock, // Frontend might need this
                    'image_url' => $product->images[0] ?? null,
                    'total' => $lineTotal,
                ];
            }
        }

        return $this->success('Cart synchronized', [
            'items' => $validatedItems,
            'subtotal' => round($subtotal, 2),
            'valid' => $isValid,
            'messages' => $messages,
        ]);
    }
}
