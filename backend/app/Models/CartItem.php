<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'sku_id', 'quantity', 'unit_price'];

    protected $casts = ['unit_price' => 'decimal:2'];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function sku(): BelongsTo
    {
        return $this->belongsTo(Sku::class);
    }

    public function subtotal(): float
    {
        return (float) $this->unit_price * $this->quantity;
    }
}
