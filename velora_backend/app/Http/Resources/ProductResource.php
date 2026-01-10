<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock_quantity' => (int) $this->stock_quantity,
            'status' => $this->status,
            'is_featured' => (bool) $this->is_featured,
            'image_urls' => $this->images ?? [],
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'shop' => [
                'id' => $this->shop->id,
                'name' => $this->shop->name,
                'slug' => $this->shop->slug,
                'logo_url' => $this->shop->logo_url,
            ],
            'created_at' => $this->created_at->format('d M Y'),
        ];

        // Check if user is logged in for wishlist status
        if ($request->user()) {
            $data['in_wishlist'] = $this->wishlists()
                ->where('user_id', $request->user()->id)
                ->exists();
        } else {
            $data['in_wishlist'] = false;
        }

        return $data;
    }
}
