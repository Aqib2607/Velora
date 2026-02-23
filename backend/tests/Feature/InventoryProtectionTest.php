<?php

namespace Tests\Feature;

use App\Models\Inventory;
use App\Models\InventoryReservation;
use App\Models\Sku;
use App\Modules\Inventory\InventoryService;
use Tests\VeloraTestCase;

class InventoryProtectionTest extends VeloraTestCase
{
    private InventoryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(InventoryService::class);
    }

    public function test_it_reserves_inventory_and_decrements_available_quantity(): void
    {
        $sku       = Sku::where('sku_code', 'WIDGET-001')->first();
        $inventory = Inventory::where('sku_id', $sku->id)->first();

        $initialQty = $inventory->quantity_available;

        $reservation = $this->service->reserve($sku, 5, $this->buyerA->id, 'TEST-REF-001');

        $inventory->refresh();

        $this->assertEquals($initialQty - 5, $inventory->quantity_available);
        $this->assertEquals(5, $inventory->quantity_reserved);
        $this->assertEquals('pending', $reservation->status);
        $this->assertFalse($reservation->isExpired());

        $this->assertDatabaseHas('inventory_reservations', [
            'sku_id'  => $sku->id,
            'status'  => 'pending',
            'quantity' => 5,
        ]);
    }

    public function test_it_rejects_reservation_exceeding_available_quantity(): void
    {
        $sku = Sku::where('sku_code', 'WIDGET-001')->first();

        // Try to reserve more than the 100 in stock
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/insufficient inventory/i');

        $this->service->reserve($sku, 999, $this->buyerA->id, 'OVERFLOW-TEST');
    }

    public function test_inventory_quantity_never_goes_negative(): void
    {
        $sku       = Sku::where('sku_code', 'WIDGET-001')->first();
        $inventory = Inventory::where('sku_id', $sku->id)->first();

        // Reserve ALL available stock
        $this->service->reserve($sku, $inventory->quantity_available, $this->buyerA->id, 'FULL-RESERVE');

        $inventory->refresh();
        $this->assertEquals(0, $inventory->quantity_available);

        // Now try another reservation — must be rejected
        $this->expectException(\RuntimeException::class);
        $this->service->reserve($sku, 1, $this->buyerA->id, 'OVER-RESERVE');
    }

    public function test_it_confirms_reservation_after_payment(): void
    {
        $sku         = Sku::where('sku_code', 'WIDGET-001')->first();
        $reservation = $this->service->reserve($sku, 3, $this->buyerA->id, 'CONFIRM-TEST');

        $this->service->confirm($reservation);

        $reservation->refresh();
        $this->assertEquals('confirmed', $reservation->status);

        $inventory = Inventory::where('sku_id', $sku->id)->first();
        $this->assertEquals(0, $inventory->quantity_reserved);
        $this->assertEquals(3, $inventory->quantity_sold);
    }

    public function test_it_releases_reservation_on_failure(): void
    {
        $sku       = Sku::where('sku_code', 'WIDGET-001')->first();
        $inventory = Inventory::where('sku_id', $sku->id)->first();
        $initial   = $inventory->quantity_available;

        $reservation = $this->service->reserve($sku, 10, $this->buyerA->id, 'RELEASE-TEST');

        $inventory->refresh();
        $this->assertEquals($initial - 10, $inventory->quantity_available);

        $this->service->release($reservation);

        $inventory->refresh();
        $this->assertEquals($initial, $inventory->quantity_available, 'Quantity should be fully restored after release.');
        $this->assertEquals('released', $reservation->fresh()->status);
    }

    public function test_cleanup_job_releases_expired_reservations(): void
    {
        $sku = Sku::where('sku_code', 'WIDGET-001')->first();

        // Create a reservation that is already expired
        InventoryReservation::create([
            'sku_id'          => $sku->id,
            'user_id'         => $this->buyerA->id,
            'order_reference' => 'EXPIRED-001',
            'quantity'        => 5,
            'status'          => 'pending',
            'expires_at'      => now()->subMinutes(20), // already expired
        ]);

        // Also decrement inventory manually to simulate the reservation having locked it
        $inventory = Inventory::where('sku_id', $sku->id)->first();
        $inventory->decrement('quantity_available', 5);
        $inventory->increment('quantity_reserved', 5);
        $initialQty = $inventory->refresh()->quantity_available;

        $count = $this->service->cleanupExpired();

        $this->assertGreaterThanOrEqual(1, $count);

        $inventory->refresh();
        $this->assertEquals($initialQty + 5, $inventory->quantity_available, 'Expired reservation should restore quantity.');
        $this->assertDatabaseHas('inventory_reservations', ['order_reference' => 'EXPIRED-001', 'status' => 'expired']);
    }
}
