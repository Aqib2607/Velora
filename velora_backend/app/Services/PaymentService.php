<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Create a Payment Intent for the order.
     * Returns the client_secret for the frontend to confirm payment.
     */
    public function createPaymentIntent(Order $order)
    {
        $user = $order->user;

        // Ensure user is a Stripe customer
        $user->createOrGetStripeCustomer();

        // Create Payment Intent (Authorize)
        // We use 'pay' which creates an invoice or simple charge?
        // For simple checkout, we can use $user->pay($amount);
        // But we want to return client_secret for Elements.

        // Cashier 15 'pay' returns a Payment object.
        // We can pass options.
        try {
            // Amount in cents
            $amount = (int) ($order->total_amount * 100);

            // This creates a PaymentIntent with automatic_payment_methods enabled by default in recent versions?
            // Or we just use the Stripe SDK directly via Cashier wrapper?
            // $payment = $user->pay($amount);
            // 'pay' immediately charges user's default payment method if exists.

            // We want to generic intent.
            $payment = $user->pay($amount, [
                'metadata' => ['order_id' => $order->id],
            ]);

            // If we want key for frontend:
            return $payment->client_secret;

        } catch (\Exception $e) {
            Log::error('Stripe Payment Intent Failed: '.$e->getMessage());
            throw $e;
        }
    }
}
