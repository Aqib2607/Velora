<?php

namespace App\Modules\Payment;

use App\Models\Order;
use App\Models\Payment;
use Stripe\StripeClient;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PaymentService
{
    private ?StripeClient $stripe = null;

    private function stripe(): StripeClient
    {
        if ($this->stripe === null) {
            $this->stripe = new StripeClient(config('services.stripe.secret'));
        }
        return $this->stripe;
    }

    /**
     * Create a Stripe PaymentIntent for an order.
     */
    public function createIntent(Order $order, int $tenantId): array
    {
        $intent = $this->stripe()->paymentIntents->create([
            'amount'               => (int) ($order->total * 100), // cents
            'currency'             => 'usd',
            'metadata'             => [
                'order_id'     => $order->id,
                'order_number' => $order->order_number,
                'tenant_id'    => $tenantId,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        Payment::create([
            'tenant_id'                => $tenantId,
            'order_id'                 => $order->id,
            'user_id'                  => $order->user_id,
            'stripe_payment_intent_id' => $intent->id,
            'status'                   => 'pending',
            'amount'                   => $order->total,
            'currency'                 => 'USD',
        ]);

        return [
            'id'            => $intent->id,
            'client_secret' => $intent->client_secret,
        ];
    }

    /**
     * Validate Stripe webhook signature.
     *
     * @throws \Stripe\Exception\SignatureVerificationException
     */
    public function validateWebhookSignature(string $payload, string $signature): \Stripe\Event
    {
        return \Stripe\Webhook::constructEvent(
            $payload,
            $signature,
            config('services.stripe.webhook_secret')
        );
    }

    /**
     * Issue a Stripe refund.
     */
    public function refund(string $chargeId, int $amountCents): \Stripe\Refund
    {
        return $this->stripe()->refunds->create([
            'charge' => $chargeId,
            'amount' => $amountCents,
        ]);
    }

    /**
     * Transfer payout to a connected Stripe account.
     */
    public function transfer(string $stripeAccountId, int $amountCents, string $currency = 'usd'): \Stripe\Transfer
    {
        return $this->stripe()->transfers->create([
            'amount'      => $amountCents,
            'currency'    => $currency,
            'destination' => $stripeAccountId,
        ]);
    }
}
