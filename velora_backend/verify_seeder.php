
$users = App\Models\User::count();
$shops = App\Models\Shop::count();
$categories = App\Models\Category::count();
$products = App\Models\Product::count();
$reviews = App\Models\Review::count();
$wishlists = App\Models\Wishlist::count();
$orders = App\Models\Order::count();
$orderItems = App\Models\OrderItem::count();

echo "Users: {$users} (Expected: 11)\n";
echo "Shops: {$shops} (Expected: 5)\n";
echo "Categories: {$categories} (Expected: 5)\n";
echo "Products: {$products} (Expected: 25)\n";
echo "Reviews: {$reviews} (Expected: 5)\n";
echo "Wishlists: {$wishlists} (Expected: 5)\n";
echo "Orders: {$orders} (Expected: 5)\n";
echo "OrderItems: {$orderItems} (Expected: 25)\n";
