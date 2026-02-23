<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'sku_id',
        'seller_profile_id',
        'product_name',
        'sku_code',
        'quantity',
        'unit_price',
        'total',
        'options',
    ];

    protected $casts = [
        'options'    => 'array',
        'unit_price' => 'decimal:2',
        'total'      => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function sku(): BelongsTo
    {
        return $this->belongsTo(Sku::class);
    }

    public function sellerProfile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class);
    }
}
