<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends BaseController
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request, string $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $user = $request->user();

        // Check if user has purchased the product
        $hasPurchased = Order::where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->where('status', 'delivered') // Strictly check for delivered orders? Or allow any? Prompt 22 says "User must have purchased". Usually implies completed order.
            ->exists();

        // For testing purposes, maybe relax this check or ensure we can seed orders?
        // Prompt says "Validation: User must have purchased... check orders table".
        // Let's implement stricter check but maybe assume status 'delivered' is the key.
        // Actually, let's allow 'processing', 'shipped', 'delivered'.
        /*
        $hasPurchased = Order::where('user_id', $user->id)
             ->whereHas('items', fn($q) => $q->where('product_id', $productId))
             ->exists();
        */
        
        // Let's stick to the prompt's instruction broadly.
        // I will use `exists` regardless of status for now, as payment usually confirms purchase.
        // But better: payment_status = 'paid'.
        
        $hasPurchased = Order::where('user_id', $user->id)
            ->where('payment_status', 'paid')
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();

        if (! $hasPurchased) {
            return $this->error('You must purchase this product to review it.', 403);
        }

        // Check if already reviewed
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($existingReview) {
            return $this->error('You have already reviewed this product.', 400);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $this->success('Review submitted successfully', $review, 201);
    }
}
