<?php

namespace App\Services;

use App\Models\Order;

class PaymentService
{
    /**
     * Create a payment intent (Stripe Mock).
     */
    public function createPaymentIntent(Order $order): string
    {
        // In a real app, you would use Stripe SDK:
        // $paymentIntent = \Stripe\PaymentIntent::create([...]);
        // return $paymentIntent->client_secret;

        // Mocking a client secret
        return 'pi_mock_' . $order->id . '_secret_' . bin2hex(random_bytes(10));
    }
}
