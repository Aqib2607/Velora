<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LedgerAccount extends Model
{
    use HasTenantScope;

    protected $fillable = ['tenant_id', 'name', 'type', 'code', 'balance'];

    protected $casts = ['balance' => 'decimal:2'];

    public function entries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class, 'account_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
