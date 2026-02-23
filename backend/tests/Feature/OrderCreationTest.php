<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Sku;
use App\Modules\Order\OrderSagaOrchestrator;
use Illuminate\Support\Facades\Event;
use App\Events\OrderPaid;
use App\Modules\Payment\PaymentService;
use App\Models\Payment;
use Tests\VeloraTestCase;

class OrderCreationTest extends VeloraTestCase
{
    public function test_order_is_created_from_cart_with_correct_totals(): void
    {
        Event::fake([OrderPaid::class]);
        $this->mockPayment();

        $sku = Sku::where('sku_code', 'WIDGET-001')->first();

        // Build a cart
        $cart = Cart::create([
            'tenant_id' => $this->tenantA->id,
            'user_id'   => $this->buyerA->id,
            'status'    => 'active',
        ]);
        CartItem::create([
            'cart_id'    => $cart->id,
            'sku_id'     => $sku->id,
            'quantity'   => 2,
            'unit_price' => 99.99,
        ]);

        $saga   = app(OrderSagaOrchestrator::class);
        $result = $saga->initiateCheckout($cart, [
            'shipping' => ['name' => 'Test Buyer', 'address_line1' => '1 Test St', 'city' => 'Dhaka', 'state' => 'N/A', 'postal_code' => '1000', 'country' => 'BD'],
        ], $this->tenantA->id);

        $order = $result['order'];

        $this->assertEquals('payment_pending', $order->status);
        $this->assertEquals(199.98, round($order->total, 2));
        $this->assertCount(1, $order->items);
        $this->assertEquals(2, $order->items->first()->quantity);

        $this->assertDatabaseHas('orders', [
            'id'     => $order->id,
            'status' => 'payment_pending',
        ]);

        $this->assertDatabaseHas('inventory_reservations', [
            'sku_id'   => $sku->id,
            'quantity' => 2,
            'status'   => 'pending',
        ]);

        // Cart should be marked as ordered
        $this->assertEquals('ordered', $cart->fresh()->status);
    }

    public function test_order_status_updates_to_paid_on_payment_success(): void
    {
        Event::fake([OrderPaid::class]);
        $this->mockPayment();

        $sku = Sku::where('sku_code', 'WIDGET-001')->first();

        $cart = Cart::create(['tenant_id' => $this->tenantA->id, 'user_id' => $this->buyerA->id, 'status' => 'active']);
        CartItem::create(['cart_id' => $cart->id, 'sku_id' => $sku->id, 'quantity' => 1, 'unit_price' => 99.99]);

        $saga   = app(OrderSagaOrchestrator::class);
        $result = $saga->initiateCheckout($cart, [
            'shipping' => ['name' => 'Test', 'address_line1' => '1 St', 'city' => 'City', 'state' => 'N/A', 'postal_code' => '1000', 'country' => 'BD'],
        ], $this->tenantA->id);

        $order = $result['order'];

        // Simulate payment success
        $saga->onPaymentSuccess($order, 'pi_fake_success_001', $this->tenantA->id);

        $order->refresh();
        $this->assertEquals('paid', $order->status);
        $this->assertNotNull($order->paid_at);

        // Inventory should be confirmed (not reserved anymore)
        $inventory = Inventory::where('sku_id', $sku->id)->first();
        $this->assertEquals(0, $inventory->quantity_reserved);
        $this->assertEquals(1, $inventory->quantity_sold);

        Event::assertDispatched(OrderPaid::class);
    }

    public function test_order_cancellation_releases_inventory(): void
    {
        Event::fake();
        $this->mockPayment();

        $sku       = Sku::where('sku_code', 'WIDGET-001')->first();
        $inventory = Inventory::where('sku_id', $sku->id)->first();
        $initial   = $inventory->quantity_available;

        $cart = Cart::create(['tenant_id' => $this->tenantA->id, 'user_id' => $this->buyerA->id, 'status' => 'active']);
        CartItem::create(['cart_id' => $cart->id, 'sku_id' => $sku->id, 'quantity' => 3, 'unit_price' => 99.99]);

        $saga   = app(OrderSagaOrchestrator::class);
        $result = $saga->initiateCheckout($cart, [
            'shipping' => ['name' => 'Test', 'address_line1' => '1 St', 'city' => 'City', 'state' => 'N/A', 'postal_code' => '1000', 'country' => 'BD'],
        ], $this->tenantA->id);

        $order = $result['order'];

        $saga->onPaymentFailure($order);
        $order->refresh();

        $this->assertEquals('cancelled', $order->status);

        $inventory->refresh();
        $this->assertEquals($initial, $inventory->quantity_available, 'Inventory must be fully restored after cancellation.');
    }

    public function test_cannot_create_order_from_empty_cart(): void
    {
        $cart = Cart::create(['tenant_id' => $this->tenantA->id, 'user_id' => $this->buyerA->id, 'status' => 'active']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/cart is empty/i');

        $saga = app(OrderSagaOrchestrator::class);
        $saga->initiateCheckout($cart, ['shipping' => []], $this->tenantA->id);
    }

    private function mockPayment(): void
    {
        $this->mock(PaymentService::class, function ($mock) {
            $mock->shouldReceive('createIntent')->andReturnUsing(function ($order, $tenantId) {
                Payment::create([
                    'tenant_id'                => $tenantId,
                    'order_id'                 => $order->id,
                    'user_id'                  => $order->user_id,
                    'stripe_payment_intent_id' => 'pi_fake_123',
                    'status'                   => 'pending',
                    'amount'                   => $order->total,
                    'currency'                 => 'USD',
                ]);
                return ['id' => 'pi_fake_123', 'client_secret' => 'secret_123'];
            });
        });
    }
}
