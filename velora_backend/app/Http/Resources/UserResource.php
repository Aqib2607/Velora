<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'avatar_url' => $this->avatar_url,
            'bio' => $this->bio,
            'phone' => $this->phone,
            'shop' => $this->when($this->shop, function () {
                return [
                    'id' => $this->shop->id,
                    'name' => $this->shop->name,
                    'slug' => $this->shop->slug,
                    'status' => $this->shop->status,
                ];
            }),
            'joined_at' => $this->created_at->format('d M Y'),
        ];
    }
}
