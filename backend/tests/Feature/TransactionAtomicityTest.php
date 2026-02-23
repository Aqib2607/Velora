<?php

namespace Tests\Feature;

use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\Sku;
use App\Modules\Inventory\InventoryService;
use App\Modules\Ledger\LedgerService;
use Illuminate\Support\Facades\DB;
use Tests\VeloraTestCase;

class TransactionAtomicityTest extends VeloraTestCase
{
    public function test_failed_ledger_insert_rolls_back_entire_transaction(): void
    {
        $sku       = Sku::where('sku_code', 'WIDGET-001')->first();
        $inventory = \App\Models\Inventory::where('sku_id', $sku->id)->first();
        $initialQty = $inventory->quantity_available;
        $initialEntryCount = LedgerEntry::count();

        try {
            DB::transaction(function () use ($sku) {
                $inventoryService = app(InventoryService::class);

                // Reserve inventory (should succeed)
                $inventoryService->reserve($sku, 5, $this->buyerA->id, 'ATOMIC-TEST');

                // Simulate a forced ledger failure mid-transaction
                throw new \RuntimeException('Simulated ledger failure — must roll back');
            });
        } catch (\RuntimeException $e) {
            // Expected — the transaction was rolled back
        }

        // Inventory must be restored fully
        $inventory->refresh();
        $this->assertEquals(
            $initialQty,
            $inventory->quantity_available,
            'Inventory should be fully restored after transaction rollback.'
        );

        // No new ledger entries should exist
        $this->assertEquals(
            $initialEntryCount,
            LedgerEntry::count(),
            'No ledger entries should survive a rolled-back transaction.'
        );
    }

    public function test_full_transaction_rollback_leaves_no_orphan_orders(): void
    {
        $initialOrderCount = Order::count();

        try {
            DB::transaction(function () {
                Order::create([
                    'tenant_id'    => $this->tenantA->id,
                    'user_id'      => $this->buyerA->id,
                    'order_number' => 'ORD-ROLLBACK-TEST',
                    'status'       => 'payment_pending',
                    'subtotal'     => 99.99,
                    'tax'          => 0,
                    'shipping'     => 0,
                    'discount'     => 0,
                    'total'        => 99.99,
                ]);

                // Simulate a failure
                throw new \RuntimeException('Forced rollback');
            });
        } catch (\RuntimeException) {
            // Expected
        }

        $this->assertEquals(
            $initialOrderCount,
            Order::count(),
            'No orphan order records should exist after a transaction rollback.'
        );
    }

    public function test_double_entry_posts_atomically(): void
    {
        $ledger = app(LedgerService::class);

        $txn = $ledger->post(
            'atomic_post_test',
            'Full atomic transaction test',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 49.99],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 49.99],
            ],
            $this->tenantA->id
        );

        // Both entries must exist or neither does
        $entryCount = LedgerEntry::where('transaction_id', $txn->id)->count();
        $this->assertEquals(2, $entryCount, 'Exactly 2 ledger entries must be created atomically.');
    }
}
