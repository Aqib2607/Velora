<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommissionRecord extends Model
{
    use HasTenantScope;

    protected $fillable = [
        'tenant_id',
        'order_item_id',
        'seller_profile_id',
        'commission_rule_id',
        'sale_amount',
        'commission_amount',
        'seller_payout',
        'status',
    ];

    protected $casts = [
        'sale_amount'       => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'seller_payout'     => 'decimal:2',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function sellerProfile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class);
    }

    public function rule(): BelongsTo
    {
        return $this->belongsTo(CommissionRule::class, 'commission_rule_id');
    }
}
