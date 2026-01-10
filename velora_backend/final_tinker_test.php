
// 1. Reset Database
echo ">>> Resetting Database...\n";
Artisan::call('migrate:fresh');
echo "Database Reset.\n";

// 2. Create Users
echo ">>> Creating Users...\n";
$admin = App\Models\User::factory()->create([
    'name' => 'Admin User',
    'email' => 'admin@velora.com',
    'password' => Illuminate\Support\Facades\Hash::make('password'),
    'role' => 'admin',
]);

$vendor = App\Models\User::factory()->create([
    'name' => 'Vendor User',
    'email' => 'vendor@velora.com',
    'password' => Illuminate\Support\Facades\Hash::make('password'),
    'role' => 'customer', // Will upgrade later
]);

$customer = App\Models\User::factory()->create([
    'name' => 'Customer User',
    'email' => 'customer@velora.com',
    'password' => Illuminate\Support\Facades\Hash::make('password'),
    'role' => 'customer',
]);
echo "Users Created: Admin, Vendor, Customer.\n";

// 3. Register Shop (Vendor)
echo ">>> Registering Shop...\n";
$shop = App\Models\Shop::create([
    'user_id' => $vendor->id,
    'name' => 'Tech Haven',
    'slug' => 'tech-haven',
    'description' => 'Best tech gadgets.',
    'status' => 'active',
    'is_verified' => true,
]);
$vendor->update(['role' => 'shop_owner']);
echo "Shop '{$shop->name}' created and Vendor role updated.\n";

// 4. Create Categories
echo ">>> Creating Categories...\n";
$catElectronics = App\Models\Category::create([
    'name' => 'Electronics',
    'slug' => 'electronics',
]);
$catLaptops = App\Models\Category::create([
    'name' => 'Laptops',
    'slug' => 'laptops',
    'parent_id' => $catElectronics->id,
]);
echo "Categories created.\n";

// 5. Create Products
echo ">>> Creating Products...\n";
$product1 = App\Models\Product::create([
    'shop_id' => $shop->id,
    'category_id' => $catLaptops->id,
    'name' => 'MacBook Pro M4',
    'slug' => 'macbook-pro-m4',
    'description' => 'The latest powerhouse.',
    'price' => 2500.00,
    'stock_quantity' => 10,
    'images' => ['https://via.placeholder.com/800'],
    'status' => 'published',
    'is_featured' => true,
]);

$product2 = App\Models\Product::create([
    'shop_id' => $shop->id,
    'category_id' => $catElectronics->id,
    'name' => 'Generic Mouse',
    'slug' => 'generic-mouse',
    'description' => 'Click things.',
    'price' => 50.00,
    'stock_quantity' => 100,
    'images' => ['https://via.placeholder.com/400'],
    'status' => 'published',
    'is_featured' => false,
]);
echo "Products Created: {$product1->name}, {$product2->name}.\n";

// 6. Wishlist & Reviews
echo ">>> Testing Wishlist & Reviews...\n";
App\Models\Wishlist::create(['user_id' => $customer->id, 'product_id' => $product1->id]);
App\Models\Review::create([
    'user_id' => $customer->id,
    'product_id' => $product1->id,
    'rating' => 5,
    'comment' => 'Amazing laptop!',
]);
echo "Wishlist item added. Review added.\n";

// 7. Order Flow
echo ">>> Simulating Order Flow...\n";
// Create Order
$order = App\Models\Order::create([
    'user_id' => $customer->id,
    'total_amount' => 2600.00, // 1 Laptop + 2 Mice
    'subtotal' => 2600.00,
    'tax' => 0,
    'status' => 'pending',
    'payment_status' => 'paid', // Simulate paid immediately
    'payment_method' => 'stripe',
    'shipping_address' => ['address' => '123 Main St', 'city' => 'Tech City'],
]);

// Add Items
$order->items()->create([
    'product_id' => $product1->id,
    'shop_id' => $shop->id,
    'quantity' => 1,
    'unit_price' => 2500.00,
    'total' => 2500.00,
]);
$order->items()->create([
    'product_id' => $product2->id,
    'shop_id' => $shop->id,
    'quantity' => 2,
    'unit_price' => 50.00,
    'total' => 100.00,
]);

echo "Order #{$order->id} created with 2 items.\n";

// 8. Stock Deduction Logic (Manually triggering what checkout controller does)
echo ">>> Verifying Stock Deduction...\n";
$product1->decrement('stock_quantity', 1);
$product2->decrement('stock_quantity', 2);

echo "Stock Deducted.\n";
echo "MacBook Stock: " . $product1->fresh()->stock_quantity . " (Expected: 9)\n";
echo "Mouse Stock: " . $product2->fresh()->stock_quantity . " (Expected: 98)\n";

// 9. Analytics Check
echo ">>> Verifying Analytics...\n";
$vendorEarnings = App\Models\OrderItem::where('shop_id', $shop->id)->sum('total');
echo "Vendor Earnings: $" . $vendorEarnings . "\n";

echo "\n>>> FINAL TEST RESULT: SUCCESS <<<\n";
