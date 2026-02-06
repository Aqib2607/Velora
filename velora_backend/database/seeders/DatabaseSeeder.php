<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear tables first to avoid duplicates if re-seeding
        // User::truncate(); // Be careful with foreign keys, better to refresh db if needed. 
        // We'll rely on factories creating new data.

        // 1. Categories (Ensure they exist)
        $this->call(CategorySeeder::class);
        $categories = Category::all();

        // 2. Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@velora.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 3. 10 Random Users (Customers)
        $customers = User::factory(10)->create(['role' => 'customer']);

        // 4. 20 Vendors (Shop Owners)
        $vendors = User::factory(20)->create(['role' => 'shop_owner']);

        // 5. 20 Shops (1 per Vendor)
        $shops = collect();
        foreach ($vendors as $vendor) {
            $shop = Shop::factory()->create([
                'user_id' => $vendor->id,
                'name' => $vendor->name . "'s Shop",
                'is_verified' => true,
                'status' => 'active'
            ]);
            $shops->push($shop);
        }

        // 6. Products (Using ProductSeeder for curated products with Unsplash images)
        $this->call(ProductSeeder::class);

        $allProducts = Product::all();

        // 7. Extra Data: Reviews, Wishlists, Orders (Optional but good for completeness)
        // Create some reviews
        if ($customers->count() > 0 && $allProducts->count() > 0) {
            Review::factory(20)->create([
                'user_id' => fn() => $customers->random()->id,
                'product_id' => fn() => $allProducts->random()->id,
            ]);
        }
    }
}
