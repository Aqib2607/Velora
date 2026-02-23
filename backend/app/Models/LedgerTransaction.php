<?php

namespace App\Models;

use App\Models\Traits\HasTenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LedgerTransaction extends Model
{
    use HasTenantScope;

    protected $fillable = [
        'tenant_id',
        'reference',
        'description',
        'status',
        'posted_at',
    ];

    protected $casts = ['posted_at' => 'datetime'];

    public function entries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class, 'transaction_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Validate double-entry balance (sum of debits equals sum of credits).
     */
    public function isBalanced(): bool
    {
        $debits  = $this->entries()->where('type', 'debit')->sum('amount');
        $credits = $this->entries()->where('type', 'credit')->sum('amount');
        return (string) $debits === (string) $credits;
    }
}
