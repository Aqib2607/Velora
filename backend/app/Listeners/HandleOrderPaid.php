<?php

namespace App\Listeners;

use App\Events\OrderPaid;
use Illuminate\Contracts\Queue\ShouldQueue;

class HandleOrderPaid implements ShouldQueue
{
    public int $tries = 5;
    public int $backoff = 10;

    public function handle(OrderPaid $event): void
    {
        $order = $event->order->load('items.sku.product');

        // Notify seller of new order (extensible — could dispatch a notification job)
        foreach ($order->items as $item) {
            \Log::info("Order paid: order #{$order->order_number}, item: {$item->product_name}");
        }
    }
}
