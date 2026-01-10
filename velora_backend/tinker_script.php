// Tinker Script
echo "Starting Data Seeding...\n";

// 1. Create Admin
$admin = App\Models\User::firstOrCreate(
    ['email' => 'admin@velora.com'],
    [
        'name' => 'Admin User',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'is_active' => true
    ]
);
echo "Admin: {$admin->email} ({$admin->role})\n";

// 2. Create Vendor
$vendor = App\Models\User::firstOrCreate(
    ['email' => 'vendor@velora.com'],
    [
        'name' => 'John Vendor',
        'password' => bcrypt('password'),
        'role' => 'shop_owner',
        'is_active' => true
    ]
);
echo "Vendor: {$vendor->email} ({$vendor->role})\n";

// 3. Create Shop
$shop = App\Models\Shop::firstOrCreate(
    ['slug' => 'gadget-galaxy'],
    [
        'user_id' => $vendor->id,
        'name' => 'Gadget Galaxy',
        'description' => 'Your one-stop shop for gadgets.',
        'status' => 'active',
        'is_verified' => true
    ]
);
echo "Shop: {$shop->name}\n";

// 4. Create Category
$category = App\Models\Category::firstOrCreate(
    ['slug' => 'smartphones'],
    ['name' => 'Smartphones']
);
echo "Category: {$category->name}\n";

// 5. Create Product
$product = App\Models\Product::firstOrCreate(
    ['slug' => 'super-phone-x'],
    [
        'shop_id' => $shop->id,
        'category_id' => $category->id,
        'name' => 'Super Phone X',
        'description' => 'The best phone ever.',
        'price' => 999.99,
        'stock_quantity' => 50,
        'images' => ['http://example.com/image1.jpg'],
        'status' => 'published',
        'is_featured' => true
    ]
);
echo "Product: {$product->name} - Price: \${$product->price}\n";

// 6. Test Relationships
echo "Shop Owner: " . $shop->owner->name . "\n";
echo "Product Shop: " . $product->shop->name . "\n";
echo "Product Category: " . $product->category->name . "\n";

echo "Done.\n";
