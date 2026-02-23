<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    use HasTenantScope;

    protected $fillable = [
        'tenant_id',
        'seller_profile_id',
        'stripe_transfer_id',
        'amount',
        'currency',
        'status',
        'has_active_disputes',
        'paid_at',
    ];

    protected $casts = [
        'amount'               => 'decimal:2',
        'has_active_disputes'  => 'boolean',
        'paid_at'              => 'datetime',
    ];

    public function sellerProfile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class);
    }

    public function canProcess(): bool
    {
        return !$this->has_active_disputes && $this->status === 'pending';
    }
}
