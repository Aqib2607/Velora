<?php

namespace App\Http\Controllers;

use App\Models\WebhookEvent;
use App\Jobs\ProcessStripeWebhook;
use App\Modules\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(private readonly PaymentService $payment) {}

    /**
     * Handle Stripe webhook — validate signature, deduplicate, enqueue.
     */
    public function stripe(Request $request): JsonResponse
    {
        $signature = $request->header('Stripe-Signature');

        try {
            $event = $this->payment->validateWebhookSignature(
                $request->getContent(),
                $signature
            );
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json([
                'status'     => 'error',
                'message'    => 'Invalid webhook signature.',
                'error_code' => 'WEBHOOK_SIGNATURE_INVALID',
            ], 401);
        }

        // Deduplication — check if already received
        if (WebhookEvent::where('event_id', $event->id)->exists()) {
            return response()->json(['status' => 'success', 'data' => ['message' => 'Already processed.']], 200);
        }

        $webhookEvent = WebhookEvent::create([
            'provider'   => 'stripe',
            'event_id'   => $event->id,
            'event_type' => $event->type,
            'payload'    => $event->toArray(),
            'status'     => 'pending',
        ]);

        // Dispatch async job for processing
        ProcessStripeWebhook::dispatch($webhookEvent->id);

        return response()->json(['status' => 'success', 'data' => ['received' => true]], 200);
    }
}
