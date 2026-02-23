<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasTenantScope;

    protected $fillable = [
        'tenant_id',
        'order_id',
        'user_id',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'status',
        'amount',
        'currency',
        'payment_method_type',
        'metadata',
        'paid_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'paid_at'  => 'datetime',
        'amount'   => 'decimal:2',
    ];

    // No raw card data stored — only Stripe references

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isSucceeded(): bool
    {
        return $this->status === 'succeeded';
    }
}
