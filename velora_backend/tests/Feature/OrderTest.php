<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_initiate_checkout()
    {
        $user = User::factory()->create();
        $shopOwner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create(['user_id' => $shopOwner->id, 'name' => 'Shop', 'slug' => 'shop', 'status' => 'active']);
        $category = Category::create(['name' => 'Cat', 'slug' => 'cat']);

        $product = Product::create([
            'shop_id' => $shop->id,
            'category_id' => $category->id,
            'name' => 'Test Item',
            'slug' => 'test-item',
            'description' => 'Desc',
            'price' => 50,
            'stock_quantity' => 100,
            'images' => [],
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/checkout/init', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
            'shipping_address' => ['address' => '123 St'],
            'payment_method' => 'cod',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['order_id', 'total_amount']]);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total_amount' => 100]);
    }
}
