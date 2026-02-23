<?php

namespace App\Modules\Refund;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Refund;
use App\Modules\Ledger\LedgerService;
use App\Modules\Payment\PaymentService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RefundService
{
    public function __construct(
        private readonly PaymentService $payment,
        private readonly LedgerService  $ledger,
    ) {}

    /**
     * Request a refund for an order.
     */
    public function request(Order $order, int $requestedBy, float $amount, ?string $reason): Refund
    {
        if (!$order->isPaid()) {
            throw new RuntimeException('Cannot refund an unpaid order.');
        }

        if ($amount > $order->total) {
            throw new RuntimeException('Refund amount exceeds order total.');
        }

        return Refund::create([
            'tenant_id'    => $order->tenant_id,
            'order_id'     => $order->id,
            'payment_id'   => $order->payment->id,
            'requested_by' => $requestedBy,
            'amount'       => $amount,
            'reason'       => $reason,
            'status'       => 'pending',
        ]);
    }

    /**
     * Approve and process the refund via Stripe + ledger compensating entries.
     */
    public function approve(Refund $refund): void
    {
        DB::transaction(function () use ($refund) {
            $payment = $refund->payment;

            // Issue Stripe refund
            $stripeRefund = $this->payment->refund(
                $payment->stripe_charge_id,
                (int) ($refund->amount * 100)
            );

            $refund->update([
                'stripe_refund_id' => $stripeRefund->id,
                'status'           => 'completed',
                'processed_at'     => now(),
            ]);

            // Post compensating ledger entries
            $this->ledger->post(
                "refund_{$refund->id}",
                "Refund for order #{$refund->order->order_number}",
                [
                    ['account_code' => 'REVENUE', 'type' => 'debit',  'amount' => $refund->amount, 'memo' => 'Refund reversal'],
                    ['account_code' => 'CASH',    'type' => 'credit', 'amount' => $refund->amount, 'memo' => 'Refund to customer'],
                ],
                $refund->tenant_id
            );

            // Update order status if fully refunded
            if ($refund->amount >= $refund->order->total) {
                $refund->order->update(['status' => 'refunded']);
            }
        });
    }

    public function reject(Refund $refund, string $reason): void
    {
        $refund->update(['status' => 'rejected', 'rejection_reason' => $reason]);
    }
}
