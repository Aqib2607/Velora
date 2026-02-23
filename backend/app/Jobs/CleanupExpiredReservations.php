<?php

namespace App\Jobs;

use App\Modules\Inventory\InventoryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class CleanupExpiredReservations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function handle(InventoryService $inventory): void
    {
        $count = $inventory->cleanupExpired();
        Log::info("Cleaned up {$count} expired inventory reservations.");
    }
}
