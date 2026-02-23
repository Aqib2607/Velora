<?php

namespace App\Jobs;

use App\Models\WebhookEvent;
use App\Modules\Order\OrderSagaOrchestrator;
use App\Models\Order;
use App\Models\Payment;
use App\Events\PaymentFailed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

class ProcessStripeWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 5;
    public int $backoff = 30; // seconds, exponential

    public function __construct(private readonly int $webhookEventId) {}

    public function handle(OrderSagaOrchestrator $saga): void
    {
        $webhookEvent = WebhookEvent::findOrFail($this->webhookEventId);

        if ($webhookEvent->isProcessed()) {
            return; // Idempotent — already handled
        }

        $webhookEvent->increment('attempts');
        $webhookEvent->update(['status' => 'processing']);

        try {
            $payload = $webhookEvent->payload;

            match ($webhookEvent->event_type) {
                'payment_intent.succeeded' => $this->handlePaymentSuccess($payload, $saga),
                'payment_intent.payment_failed' => $this->handlePaymentFailed($payload, $saga),
                default => null,
            };

            $webhookEvent->markProcessed();
        } catch (\Throwable $e) {
            $webhookEvent->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
            throw $e;
        }
    }

    private function handlePaymentSuccess(array $payload, OrderSagaOrchestrator $saga): void
    {
        $intentId = $payload['id'];
        $payment  = Payment::where('stripe_payment_intent_id', $intentId)->firstOrFail();
        $order    = Order::findOrFail($payment->order_id);

        $saga->onPaymentSuccess($order, $intentId, $order->tenant_id);
    }

    private function handlePaymentFailed(array $payload, OrderSagaOrchestrator $saga): void
    {
        $intentId = $payload['id'];
        $payment  = Payment::where('stripe_payment_intent_id', $intentId)->first();

        if ($payment) {
            $order = Order::findOrFail($payment->order_id);
            $saga->onPaymentFailure($order);
            $payment->update(['status' => 'failed']);
            event(new PaymentFailed($payment));
        }
    }
}
