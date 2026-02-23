<?php

namespace App\Modules\Payout;

use App\Models\CommissionRecord;
use App\Models\Payout;
use App\Models\SellerProfile;
use App\Modules\Ledger\LedgerService;
use App\Modules\Payment\PaymentService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PayoutService
{
    public function __construct(
        private readonly PaymentService $payment,
        private readonly LedgerService  $ledger,
    ) {}

    /**
     * Process a seller payout — requires zero active disputes.
     */
    public function process(SellerProfile $seller, float $amount, int $tenantId): Payout
    {
        if ($seller->payouts()->where('has_active_disputes', true)->exists()) {
            throw new RuntimeException('Cannot process payout: seller has active disputes.');
        }

        return DB::transaction(function () use ($seller, $amount, $tenantId) {
            $payout = Payout::create([
                'tenant_id'         => $tenantId,
                'seller_profile_id' => $seller->id,
                'amount'            => $amount,
                'currency'          => 'USD',
                'status'            => 'processing',
            ]);

            // Transfer via Stripe Connect
            $transfer = $this->payment->transfer(
                $seller->stripe_account_id,
                (int) ($amount * 100)
            );

            $payout->update([
                'stripe_transfer_id' => $transfer->id,
                'status'             => 'paid',
                'paid_at'            => now(),
            ]);

            // Post ledger entries
            $this->ledger->post(
                "payout_{$payout->id}",
                "Seller payout to {$seller->business_name}",
                [
                    ['account_code' => 'PAYABLE', 'type' => 'debit',  'amount' => $amount, 'memo' => 'Seller payout obligation cleared'],
                    ['account_code' => 'CASH',    'type' => 'credit', 'amount' => $amount, 'memo' => 'Stripe transfer'],
                ],
                $tenantId
            );

            // Mark commission records as paid
            CommissionRecord::where('seller_profile_id', $seller->id)
                ->where('status', 'processed')
                ->where('tenant_id', $tenantId)
                ->update(['status' => 'paid']);

            return $payout;
        });
    }
}
