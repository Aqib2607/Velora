<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $wishlists = $request->user()->wishlists()->with('product')->get();
        // Extract products for cleaner response
        $products = $wishlists->pluck('product');
        return $this->success('Wishlist retrieved successfully', \App\Http\Resources\ProductResource::collection($products));
    }

    /**
     * Toggle item in wishlist.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return $this->success('Removed from wishlist');
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return $this->success('Added to wishlist');
        }
    }
}
