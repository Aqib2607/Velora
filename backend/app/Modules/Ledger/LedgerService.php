<?php

namespace App\Modules\Ledger;

use App\Models\LedgerAccount;
use App\Models\LedgerEntry;
use App\Models\LedgerTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class LedgerService
{
    /**
     * Post a balanced double-entry transaction.
     * Entries must have equal debit and credit totals.
     *
     * @param  array{account_code: string, type: string, amount: float, memo?: string}[]  $entries
     */
    public function post(string $reference, string $description, array $entries, int $tenantId): LedgerTransaction
    {
        return DB::transaction(function () use ($reference, $description, $entries, $tenantId) {
            // Validate balance before writing
            $debits  = array_sum(array_column(array_filter($entries, fn($e) => $e['type'] === 'debit'), 'amount'));
            $credits = array_sum(array_column(array_filter($entries, fn($e) => $e['type'] === 'credit'), 'amount'));

            if (round($debits, 2) !== round($credits, 2)) {
                throw new RuntimeException("Ledger transaction is unbalanced: debits={$debits}, credits={$credits}");
            }

            $transaction = LedgerTransaction::create([
                'tenant_id'   => $tenantId,
                'reference'   => $reference,
                'description' => $description,
                'status'      => 'posted',
                'posted_at'   => now(),
            ]);

            foreach ($entries as $entry) {
                $account = LedgerAccount::where('code', $entry['account_code'])
                    ->where('tenant_id', $tenantId)
                    ->lockForUpdate()
                    ->firstOrFail();

                LedgerEntry::create([
                    'tenant_id'      => $tenantId,
                    'transaction_id' => $transaction->id,
                    'account_id'     => $account->id,
                    'type'           => $entry['type'],
                    'amount'         => $entry['amount'],
                    'memo'           => $entry['memo'] ?? null,
                ]);

                // Update account running balance
                if ($entry['type'] === 'debit') {
                    $account->increment('balance', $entry['amount']);
                } else {
                    $account->decrement('balance', $entry['amount']);
                }
            }

            return $transaction;
        });
    }

    /**
     * Create compensating (reversal) entries for a given transaction.
     */
    public function reverse(LedgerTransaction $original, string $reason): LedgerTransaction
    {
        $original->loadMissing('entries.account');
        $entries = [];
        foreach ($original->entries as $entry) {
            $entries[] = [
                'account_code' => $entry->account->code,
                'type'         => $entry->type === 'debit' ? 'credit' : 'debit',
                'amount'       => $entry->amount,
                'memo'         => "Reversal of entry #{$entry->id}: {$reason}",
            ];
        }

        $reversed = $this->post(
            "reversal_of_{$original->reference}",
            "Reversal: {$original->description} — {$reason}",
            $entries,
            $original->tenant_id
        );

        $original->update(['status' => 'reversed']);

        return $reversed;
    }
}
