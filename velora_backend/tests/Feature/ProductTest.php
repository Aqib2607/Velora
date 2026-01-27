<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_owner_can_create_product()
    {
        $user = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $user->id,
            'name' => 'Test Shop',
            'slug' => 'test-shop',
            'status' => 'active',
        ]);
        $category = Category::create(['name' => 'Test Cat', 'slug' => 'test-cat']);

        $this->mock(\App\Services\ImageService::class, function ($mock) {
            $mock->shouldReceive('optimizeAndSave')->andReturn('http://example.com/image.jpg');
        });

        $response = $this->actingAs($user)->postJson('/api/v1/products', [
            'name' => 'New Product',
            'description' => 'Great product',
            'price' => 100,
            'stock_quantity' => 10,
            'category_id' => $category->id,
            'images' => ['http://example.com/image.jpg'],
            'status' => 'published',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['name' => 'New Product']);
    }

    public function test_public_can_view_products()
    {
        $response = $this->getJson('/api/v1/products');
        $response->assertStatus(200);
    }
}
