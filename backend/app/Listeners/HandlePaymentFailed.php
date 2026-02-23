<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Models\Order;
use App\Modules\Inventory\InventoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class HandlePaymentFailed implements ShouldQueue
{
    public int $tries = 3;

    public function __construct(private readonly InventoryService $inventory) {}

    public function handle(PaymentFailed $event): void
    {
        $payment = $event->payment;
        $order   = Order::find($payment->order_id);

        if ($order) {
            $order->update(['status' => 'cancelled']);
            Log::warning("Payment failed for order #{$order->order_number}, releasing inventory.");
        }
    }
}
