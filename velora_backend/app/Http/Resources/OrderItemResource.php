<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product->name ?? 'Product Unavailable',
            'product_slug' => $this->product->slug ?? null,
            'quantity' => (int) $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'total' => (float) $this->total,
            'image_url' => $this->product->images[0] ?? null,
        ];
    }
}
