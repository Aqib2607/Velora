<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shop;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Wishlist;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users (5 Customers, 5 Vendors, 1 Admin)
        $customers = User::factory(5)->create(['role' => 'customer']);
        $vendors = User::factory(5)->create(['role' => 'shop_owner']);
        $admin = User::factory()->create(['name' => 'Admin', 'email' => 'admin@velora.com', 'role' => 'admin']);

        // 2. Create Shops (1 per Vendor)
        $shops = collect();
        foreach ($vendors as $vendor) {
            $shops->push(Shop::factory()->create(['user_id' => $vendor->id]));
        }

        // 3. Create Categories (5)
        $categories = Category::factory(5)->create();

        // 4. Create Products (5 per Shop)
        $products = collect();
        foreach ($shops as $shop) {
             // Pick random category
             $productsForShop = Product::factory(5)->create([
                 'shop_id' => $shop->id,
                 'category_id' => $categories->random()->id
             ]);
             $products = $products->merge($productsForShop);
        }

        // 5. Create Reviews (5 total, random users/products)
        Review::factory(5)->create([
            'user_id' => fn() => $customers->random()->id,
            'product_id' => fn() => $products->random()->id,
        ]);

        // 6. Create Wishlists (5 total)
        // Ensure uniqueness manually or via factory logic, here simple loop
        for ($i = 0; $i < 5; $i++) {
            Wishlist::firstOrCreate([
                'user_id' => $customers->random()->id,
                'product_id' => $products->random()->id,
            ]);
        }

        // 7. Create Orders (5 total)
        $orders = Order::factory(5)->create([
            'user_id' => fn() => $customers->random()->id,
        ]);

        // 8. Create Order Items (5 per Order)
        foreach ($orders as $order) {
            OrderItem::factory(5)->create([
                'order_id' => $order->id,
                'shop_id' => fn() => $shops->random()->id,
                'product_id' => fn() => $products->random()->id,
            ]);
        }
    }
}
