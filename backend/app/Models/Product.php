<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasTenantScope, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'seller_profile_id',
        'category_id',
        'name',
        'slug',
        'description',
        'thumbnail',
        'images',
        'status',
        'attributes',
    ];

    protected $casts = [
        'images'     => 'array',
        'attributes' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function sellerProfile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function skus(): HasMany
    {
        return $this->hasMany(Sku::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
