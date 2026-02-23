<?php

namespace App\Services;

use App\Models\LedgerTransaction;
use App\Models\LedgerEntry;
use App\Models\LedgerAccount;
use Illuminate\Support\Facades\DB;
use Exception;

class LedgerService
{
    /**
     * Records a financial transaction ensuring debit/credit equality.
     * 
     * @param int $tenantId
     * @param string $reference
     * @param string $description
     * @param array $entries Array of ['account_id' => int, 'type' => 'debit'|'credit', 'amount' => float, 'memo' => string]
     * @return LedgerTransaction
     * @throws Exception
     */
    public function recordTransaction(int $tenantId, string $reference, string $description, array $entries): LedgerTransaction
    {
        return DB::transaction(function () use ($tenantId, $reference, $description, $entries) {
            $totalDebit = 0;
            $totalCredit = 0;

            // 1. Create the Transaction Header
            $transaction = LedgerTransaction::create([
                'tenant_id' => $tenantId,
                'reference' => $reference,
                'description' => $description,
                'posted_at' => now(),
                'status' => 'posted',
            ]);

            // 2. Process Entries and Validate Balance
            foreach ($entries as $data) {
                $amount = round($data['amount'], 2);

                if ($data['type'] === 'debit') {
                    $totalDebit += $amount;
                } else {
                    $totalCredit += $amount;
                }

                // Create Immutable Entry
                LedgerEntry::create([
                    'tenant_id' => $tenantId,
                    'transaction_id' => $transaction->id,
                    'account_id' => $data['account_id'],
                    'type' => $data['type'],
                    'amount' => $amount,
                    'currency' => 'USD', // Strictly enforced USD as per hardening rules
                    'exchange_rate' => 1.0,
                    'memo' => $data['memo'] ?? null,
                ]);

                // Update Account Balance
                $this->updateAccountBalance($data['account_id'], $data['type'], $amount);
            }

            // 3. Enforce Integrity: Debit must equal Credit
            if (abs($totalDebit - $totalCredit) > 0.001) {
                throw new Exception("Financial integrity violation: Debits ({$totalDebit}) do not equal Credits ({$totalCredit}).");
            }

            return $transaction;
        });
    }

    /**
     * Updates the running balance of a ledger account.
     */
    protected function updateAccountBalance(int $accountId, string $type, float $amount): void
    {
        $account = LedgerAccount::findOrFail($accountId);

        // Asset/Expense: Debit increases, Credit decreases
        // Liability/Equity/Revenue: Credit increases, Debit decreases
        $isNaturalDebit = in_array($account->type, ['asset', 'expense']);

        if ($isNaturalDebit) {
            $account->balance += ($type === 'debit' ? $amount : -$amount);
        } else {
            $account->balance += ($type === 'credit' ? $amount : -$amount);
        }

        $account->save();
    }
}
