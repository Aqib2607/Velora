<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Sku extends Model
{
    use HasTenantScope;

    protected $fillable = [
        'tenant_id',
        'product_id',
        'sku_code',
        'price',
        'compare_price',
        'options',
        'is_active',
    ];

    protected $casts = [
        'options'   => 'array',
        'is_active' => 'boolean',
        'price'     => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
