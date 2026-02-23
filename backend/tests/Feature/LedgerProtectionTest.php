<?php

namespace Tests\Feature;

use App\Models\LedgerAccount;
use App\Models\LedgerEntry;
use App\Models\LedgerTransaction;
use App\Modules\Ledger\LedgerService;
use Illuminate\Support\Facades\DB;
use Tests\VeloraTestCase;

class LedgerProtectionTest extends VeloraTestCase
{
    private LedgerService $ledger;

    protected function setUp(): void
    {
        parent::setUp();
        $this->ledger = app(LedgerService::class);
    }

    public function test_it_posts_a_balanced_double_entry_transaction(): void
    {
        $txn = $this->ledger->post(
            'test_order_1',
            'Test payment',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 99.99, 'memo' => 'Cash in'],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 99.99, 'memo' => 'Revenue'],
            ],
            $this->tenantA->id
        );

        $this->assertDatabaseHas('ledger_transactions', ['id' => $txn->id, 'status' => 'posted']);
        $this->assertDatabaseHas('ledger_entries', ['transaction_id' => $txn->id, 'type' => 'debit',  'amount' => 99.99]);
        $this->assertDatabaseHas('ledger_entries', ['transaction_id' => $txn->id, 'type' => 'credit', 'amount' => 99.99]);
        $this->assertTrue($txn->isBalanced());
    }

    public function test_it_rejects_an_unbalanced_transaction(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/unbalanced/i');

        $this->ledger->post(
            'test_unbalanced',
            'Unbalanced attempt',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 100.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 50.00], // ← mismatch
            ],
            $this->tenantA->id
        );
    }

    public function test_db_trigger_blocks_update_on_ledger_entries(): void
    {
        $txn = $this->ledger->post(
            'trigger_test',
            'Trigger test transaction',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 10.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 10.00],
            ],
            $this->tenantA->id
        );

        $entry = LedgerEntry::where('transaction_id', $txn->id)->first();

        // MySQL trigger should fire and reject the UPDATE
        $this->expectException(\Illuminate\Database\QueryException::class);

        DB::statement("UPDATE ledger_entries SET amount = 999.99 WHERE id = {$entry->id}");
    }

    public function test_db_trigger_blocks_delete_on_ledger_entries(): void
    {
        $txn = $this->ledger->post(
            'delete_trigger_test',
            'Delete trigger test',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 20.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 20.00],
            ],
            $this->tenantA->id
        );

        $entry = LedgerEntry::where('transaction_id', $txn->id)->first();

        $this->expectException(\Illuminate\Database\QueryException::class);

        DB::statement("DELETE FROM ledger_entries WHERE id = {$entry->id}");
    }

    public function test_ledger_entry_model_throws_on_update(): void
    {
        $txn = $this->ledger->post(
            'model_immutability',
            'Model-level immutability test',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 5.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 5.00],
            ],
            $this->tenantA->id
        );

        $entry = LedgerEntry::where('transaction_id', $txn->id)->first();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/immutable/i');

        $entry->update(['amount' => 999.99]);
    }

    public function test_ledger_entry_model_throws_on_delete(): void
    {
        $txn = $this->ledger->post(
            'model_delete_immutability',
            'Model-level delete immutability test',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 5.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 5.00],
            ],
            $this->tenantA->id
        );

        $entry = LedgerEntry::where('transaction_id', $txn->id)->first();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/immutable/i');

        $entry->delete();
    }

    public function test_reversal_creates_compensating_entries(): void
    {
        $txn = $this->ledger->post(
            'reversal_source',
            'Original transaction',
            [
                ['account_code' => 'CASH',    'type' => 'debit',  'amount' => 50.00],
                ['account_code' => 'REVENUE', 'type' => 'credit', 'amount' => 50.00],
            ],
            $this->tenantA->id
        );

        $reversal = $this->ledger->reverse($txn, 'Test reversal');

        $this->assertDatabaseHas('ledger_transactions', ['id' => $txn->id, 'status' => 'reversed']);
        $this->assertDatabaseHas('ledger_entries', ['transaction_id' => $reversal->id, 'type' => 'credit', 'amount' => 50.00]);
        $this->assertDatabaseHas('ledger_entries', ['transaction_id' => $reversal->id, 'type' => 'debit',  'amount' => 50.00]);
    }
}
