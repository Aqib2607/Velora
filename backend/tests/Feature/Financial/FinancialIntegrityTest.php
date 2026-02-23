<?php

namespace Tests\Feature\Financial;

use App\Models\LedgerAccount;
use App\Models\Tenant;
use App\Models\User;
use App\Models\IdempotencyKey;
use App\Services\LedgerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Exception;

class FinancialIntegrityTest extends TestCase
{
    use RefreshDatabase;

    private LedgerService $ledgerService;
    private Tenant $tenant;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->ledgerService = new LedgerService();
        $this->tenant = Tenant::create(['name' => 'Test Tenant', 'slug' => 'test-tenant', 'domain' => 'test.com']);
        $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);
    }

    /** @test */
    public function test_it_enforces_debit_credit_equality()
    {
        $cashAccount = LedgerAccount::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Cash',
            'type' => 'asset',
            'code' => '1001'
        ]);

        $revenueAccount = LedgerAccount::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Sales Revenue',
            'type' => 'revenue',
            'code' => '4001'
        ]);

        // Attempting an unbalanced transaction should fail
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Financial integrity violation');

        $this->ledgerService->recordTransaction(
            $this->tenant->id,
            'TEST_001',
            'Unbalanced test',
            [
                ['account_id' => $cashAccount->id, 'type' => 'debit', 'amount' => 100.00],
                ['account_id' => $revenueAccount->id, 'type' => 'credit', 'amount' => 99.00], // Off by 1.00
            ]
        );
    }

    /** @test */
    public function test_it_correctly_balances_and_updates_account_totals()
    {
        $cashAccount = LedgerAccount::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Cash',
            'type' => 'asset',
            'code' => '1001'
        ]);
        $revenueAccount = LedgerAccount::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Sales',
            'type' => 'revenue',
            'code' => '4001'
        ]);

        $this->ledgerService->recordTransaction(
            $this->tenant->id,
            'SALE_001',
            'Balanced sale',
            [
                ['account_id' => $cashAccount->id, 'type' => 'debit', 'amount' => 150.00],
                ['account_id' => $revenueAccount->id, 'type' => 'credit', 'amount' => 150.00],
            ]
        );

        $this->assertEquals(150.00, $cashAccount->refresh()->balance);
        $this->assertEquals(150.00, $revenueAccount->refresh()->balance);
    }

    /** @test */
    public function test_it_enforces_usd_only_on_ledger_entries()
    {
        // This is a lower-level check since the service hardcodes 'USD'
        // But we can verify through the Model if any attempt to set another currency fails 
        // (if we added a setter check or relied on the DB trigger/constraint)

        $cashAccount = LedgerAccount::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Cash',
            'type' => 'asset',
            'code' => '1001'
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        \App\Models\LedgerEntry::create([
            'tenant_id' => $this->tenant->id,
            'transaction_id' => 1, // Placeholder
            'account_id' => $cashAccount->id,
            'type' => 'debit',
            'amount' => 100,
            'currency' => 'EUR', // Attempt to bypass USD rule
        ]);
    }
}
