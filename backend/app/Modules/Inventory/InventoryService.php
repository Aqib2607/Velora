<?php

namespace App\Modules\Inventory;

use App\Models\Inventory;
use App\Models\InventoryReservation;
use App\Models\Sku;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InventoryService
{
    /**
     * Soft-reserve inventory for a SKU during checkout (15-minute lock).
     *
     * @throws RuntimeException
     */
    public function reserve(Sku $sku, int $quantity, int $userId, string $orderRef): InventoryReservation
    {
        return DB::transaction(function () use ($sku, $quantity, $userId, $orderRef) {
            // Lock the inventory row for update
            $inventory = Inventory::where('sku_id', $sku->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($inventory->quantity_available < $quantity) {
                throw new RuntimeException("Insufficient inventory for SKU {$sku->sku_code}.");
            }

            $inventory->decrement('quantity_available', $quantity);
            $inventory->increment('quantity_reserved', $quantity);

            return InventoryReservation::create([
                'sku_id'          => $sku->id,
                'user_id'         => $userId,
                'order_reference' => $orderRef,
                'quantity'        => $quantity,
                'status'          => 'pending',
                'expires_at'      => now()->addMinutes(15),
            ]);
        });
    }

    /**
     * Confirm a reservation after successful payment.
     */
    public function confirm(InventoryReservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            $inventory = Inventory::where('sku_id', $reservation->sku_id)->lockForUpdate()->firstOrFail();
            $inventory->decrement('quantity_reserved', $reservation->quantity);
            $inventory->increment('quantity_sold', $reservation->quantity);
            $reservation->update(['status' => 'confirmed']);
        });
    }

    /**
     * Release a reservation on payment failure / cancellation.
     */
    public function release(InventoryReservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            $inventory = Inventory::where('sku_id', $reservation->sku_id)->lockForUpdate()->firstOrFail();
            $inventory->increment('quantity_available', $reservation->quantity);
            $inventory->decrement('quantity_reserved', $reservation->quantity);
            $reservation->update(['status' => 'released']);
        });
    }

    /**
     * Cleanup expired reservations (called by scheduled job every minute).
     */
    public function cleanupExpired(): int
    {
        $expired = InventoryReservation::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expired as $reservation) {
            $this->release($reservation);
            $reservation->update(['status' => 'expired']);
        }

        return $expired->count();
    }
}
