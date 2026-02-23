<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerProfile extends Model
{
    use HasTenantScope, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'business_name',
        'stripe_account_id',
        'status',
        'commission_rate',
        'payout_settings',
    ];

    protected $casts = ['payout_settings' => 'array'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function commissionRecords(): HasMany
    {
        return $this->hasMany(CommissionRecord::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
}
