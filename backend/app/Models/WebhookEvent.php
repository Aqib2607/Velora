<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebhookEvent extends Model
{
    protected $fillable = [
        'tenant_id',
        'provider',
        'event_id',
        'event_type',
        'payload',
        'status',
        'attempts',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'payload'      => 'array',
        'processed_at' => 'datetime',
    ];

    public function isProcessed(): bool
    {
        return $this->status === 'processed';
    }

    public function markProcessed(): void
    {
        $this->update(['status' => 'processed', 'processed_at' => now()]);
    }
}
