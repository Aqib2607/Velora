<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('name');
        $shops = Shop::all();

        if ($shops->isEmpty()) {
            $this->command->error('No shops found. Please seed shops first.');
            return;
        }

        // Product templates with Unsplash image IDs
        $productTemplates = [
            // Electronics
            'Electronics' => [
                ['name' => 'Wireless Headphones', 'price' => [99, 399], 'images' => ['1505740420928-5e560c06d30e', '1484704849700-f032a568e944', '1487215078519-e21cc028cb29']],
                ['name' => 'Smart Watch', 'price' => [199, 599], 'images' => ['1523275335684-37898b6baf30', '1546868871-7041f2a55e12', '1508685096489-7aacd43bd3b1']],
                ['name' => 'Laptop', 'price' => [699, 2499], 'images' => ['1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8', '1525547719571-a2d4ac8945e2']],
                ['name' => 'Smartphone', 'price' => [399, 1299], 'images' => ['1511707171634-5f897ff02aa9', '1592286927505-4d58baad7b0d', '1598327105666-5b89351aff97']],
                ['name' => 'Tablet', 'price' => [299, 899], 'images' => ['1544244015-0df4b3ffc6b0', '1585790344823-7d5a1a8d1c4f', '1561154464-82e9adf32764']],
                ['name' => 'Bluetooth Speaker', 'price' => [49, 299], 'images' => ['1608043152269-86d909b3e0d8', '1545454675-3531b543be5d', '1589003600661-a2f6d8e5c2e9']],
                ['name' => 'Camera', 'price' => [499, 3999], 'images' => ['1502920917128-1aa500764cbd', '1606986628-5a6c5e8c6e6f', '1516035069371-29a1b244cc32']],
                ['name' => 'Gaming Console', 'price' => [299, 599], 'images' => ['1606144042614-b2417e99c4e3', '1593305841991-05c297ba4575', '1612287230202-1ff1d85d1bdf']],
                ['name' => 'Drone', 'price' => [199, 1499], 'images' => ['1473968512647-3e447244af8f', '1508614589041-895b88991e3e', '1579829366248-204fe8413f31']],
                ['name' => 'Smart Home Hub', 'price' => [79, 249], 'images' => ['1558089687-6a7c180d0e05', '1558002038-1055907df827', '1558618666-fcd25c85cd64']],
            ],
            // Fashion
            'Fashion' => [
                ['name' => 'Leather Jacket', 'price' => [149, 499], 'images' => ['1551028719-00167b16eac5', '1520975954732-35dd22299614', '1591047139829-d91aecb6caea']],
                ['name' => 'Dress', 'price' => [59, 299], 'images' => ['1595777457583-95e059d581b8', '1496747611176-843222e1e57c', '1515372039744-b8f02a3ae446']],
                ['name' => 'Sneakers', 'price' => [79, 249], 'images' => ['1460353581641-37baddab0fa2', '1542291026-7eec264c27ff', '1549298916-b41d501d3772']],
                ['name' => 'Sunglasses', 'price' => [49, 349], 'images' => ['1511499767150-a48a237f0083', '1572635196237-14b3f281503f', '1577803645773-f96470509666']],
                ['name' => 'Backpack', 'price' => [39, 199], 'images' => ['1553062407-98eeb64c6a62', '1622260614153-03223fb72052', '1581605405669-fcdf81165afa']],
                ['name' => 'Watch', 'price' => [99, 999], 'images' => ['1524592094714-0f0654e20314', '1522312346299-5b3f8b4e5e3e', '1434056886341-f5db4005b3a4']],
                ['name' => 'Scarf', 'price' => [29, 149], 'images' => ['1601924994987-69e284e9e3e3', '1591369822096-ffd140ec948f', '1591047780374-4b6f0e5e0e0e']],
                ['name' => 'Belt', 'price' => [24, 129], 'images' => ['1618354691373-d851c5c3a990', '1591047780374-4b6f0e5e0e0e', '1601924994987-69e284e9e3e3']],
                ['name' => 'Hat', 'price' => [19, 89], 'images' => ['1521369909029-2afed882baee', '1588850561407-ed78c282e89b', '1576871337632-b9aef4c17ab9']],
                ['name' => 'Handbag', 'price' => [79, 599], 'images' => ['1590874103328-931e93e8e4e4', '1564422167509-4f5e8e6e6e6e', '1548036082-ec8e7e6e6e6e']],
            ],
            // Home & Living
            'Home & Living' => [
                ['name' => 'Desk Lamp', 'price' => [39, 149], 'images' => ['1507473885765-e6ed057f782c', '1513506003901-1e6a229e2d15', '1565084888279-aca607ecce0c']],
                ['name' => 'Throw Pillow', 'price' => [19, 79], 'images' => ['1584100936595-c0654b55a2e2', '1555041469-a586c61ea9bc', '1586023492125-27b2c045efd7']],
                ['name' => 'Wall Art', 'price' => [49, 399], 'images' => ['1513519245088-0e12902e35ca', '1579783902614-a3fb3927b6a5', '1561214115-f2f1fa7a5c5c']],
                ['name' => 'Plant Pot', 'price' => [14, 89], 'images' => ['1485955900006-10f4d324d411', '1459156212016-c812468e2115', '1416879595882-3373a0480b5b']],
                ['name' => 'Candle Set', 'price' => [24, 99], 'images' => ['1602874801005-1f0c8e1f1f1f', '1603006905003-be475563bc59', '1602874801005-1f0c8e1f1f1f']],
                ['name' => 'Storage Basket', 'price' => [19, 69], 'images' => ['1595515106969-1e2e2e2e2e2e', '1584622650299-2e2e2e2e2e2e', '1595515106969-1e2e2e2e2e2e']],
                ['name' => 'Mirror', 'price' => [59, 299], 'images' => ['1618220179428-22790b461013', '1600607687920-4e2e2e2e2e2e', '1618220179428-22790b461013']],
                ['name' => 'Rug', 'price' => [79, 599], 'images' => ['1600607687920-4e2e2e2e2e2e', '1595515106969-1e2e2e2e2e2e', '1600607687920-4e2e2e2e2e2e']],
                ['name' => 'Vase', 'price' => [29, 149], 'images' => ['1578500494198-d7c8f4f4f4f4', '1603006905003-be475563bc59', '1578500494198-d7c8f4f4f4f4']],
                ['name' => 'Coffee Maker', 'price' => [49, 399], 'images' => ['1517668808822-9ebb02f2a0e6', '1559056199-641a0ac8b3e3', '1517668808822-9ebb02f2a0e6']],
            ],
            // Beauty & Health
            'Beauty & Health' => [
                ['name' => 'Skincare Set', 'price' => [49, 199], 'images' => ['1556228578-0d85b1a4d571', '1570554886111-e80fcca6a029', '1608248543803-ba4f8c70ae0b']],
                ['name' => 'Makeup Palette', 'price' => [29, 149], 'images' => ['1596462502883-9d1853c3e9e9', '1512496015851-a90fb38ba796', '1596462502883-9d1853c3e9e9']],
                ['name' => 'Hair Dryer', 'price' => [39, 249], 'images' => ['1522338242992-e1a54906a8da', '1526045478516-99145907023c', '1619451334792-150fd785ee74']],
                ['name' => 'Perfume', 'price' => [59, 299], 'images' => ['1541643600914-78b084683601', '1588405748067-1e1e1e1e1e1e', '1541643600914-78b084683601']],
                ['name' => 'Face Mask', 'price' => [9, 49], 'images' => ['1598440947619-2c35fc9aa908', '1608248543803-ba4f8c70ae0b', '1598440947619-2c35fc9aa908']],
                ['name' => 'Moisturizer', 'price' => ['19', 89], 'images' => ['1556228578-0d85b1a4d571', '1570554886111-e80fcca6a029', '1556228578-0d85b1a4d571']],
                ['name' => 'Lip Balm', 'price' => [4, 24], 'images' => ['1596462502883-9d1853c3e9e9', '1512496015851-a90fb38ba796', '1596462502883-9d1853c3e9e9']],
                ['name' => 'Nail Polish', 'price' => [6, 29], 'images' => ['1610992015903-8e8e8e8e8e8e', '1596462502883-9d1853c3e9e9', '1610992015903-8e8e8e8e8e8e']],
                ['name' => 'Body Lotion', 'price' => [14, 69], 'images' => ['1556228578-0d85b1a4d571', '1570554886111-e80fcca6a029', '1556228578-0d85b1a4d571']],
                ['name' => 'Shampoo', 'price' => [12, 59], 'images' => ['1556228578-0d85b1a4d571', '1570554886111-e80fcca6a029', '1556228578-0d85b1a4d571']],
            ],
            // Sports & Outdoors
            'Sports & Outdoors' => [
                ['name' => 'Yoga Mat', 'price' => [24, 89], 'images' => ['1601925260368-ae2f83cf8b7f', '1592432678016-e910b452f9a2', '1544367567-0f2fcb009e0b']],
                ['name' => 'Dumbbells', 'price' => [29, 399], 'images' => ['1517836357463-d25dfeac3438', '1534438327276-14e5300c3a48', '1517836357463-d25dfeac3438']],
                ['name' => 'Water Bottle', 'price' => [14, 49], 'images' => ['1602143407151-7111542de6e6', '1523362628745-0d31c2b6cf39', '1602143407151-7111542de6e6']],
                ['name' => 'Running Shoes', 'price' => [69, 249], 'images' => ['1542291026-7eec264c27ff', '1549298916-b41d501d3772', '1460353581641-37baddab0fa2']],
                ['name' => 'Fitness Tracker', 'price' => [49, 199], 'images' => ['1575311373937-040f0a1e1e1e', '1557935728-e6e6e6e6e6e6', '1575311373937-040f0a1e1e1e']],
                ['name' => 'Camping Tent', 'price' => [99, 599], 'images' => ['1504280390367-361c6d9f38f4', '1478131143081-80f7f84ca84d', '1504280390367-361c6d9f38f4']],
                ['name' => 'Bicycle', 'price' => [299, 2999], 'images' => ['1485965120184-e220f721d03e', '1532298229144-0ec0c57515c7', '1485965120184-e220f721d03e']],
                ['name' => 'Hiking Backpack', 'price' => [79, 299], 'images' => ['1622260614153-03223fb72052', '1553062407-98eeb64c6a62', '1622260614153-03223fb72052']],
                ['name' => 'Jump Rope', 'price' => [9, 39], 'images' => ['1571902943202-507ec2618e8f', '1599058917212-d750089bc07e', '1571902943202-507ec2618e8f']],
                ['name' => 'Resistance Bands', 'price' => [14, 49], 'images' => ['1598632640487-6ea4a4e8e8e8', '1599058917212-d750089bc07e', '1598632640487-6ea4a4e8e8e8']],
            ],
        ];

        $colors = [
            ['name' => 'Black', 'hex' => '#000000'],
            ['name' => 'White', 'hex' => '#FFFFFF'],
            ['name' => 'Gray', 'hex' => '#808080'],
            ['name' => 'Navy', 'hex' => '#000080'],
            ['name' => 'Blue', 'hex' => '#0000FF'],
            ['name' => 'Red', 'hex' => '#FF0000'],
            ['name' => 'Green', 'hex' => '#008000'],
            ['name' => 'Purple', 'hex' => '#800080'],
            ['name' => 'Pink', 'hex' => '#FFC0CB'],
            ['name' => 'Brown', 'hex' => '#8B4513'],
        ];

        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        $brands = ['Premium', 'Elite', 'Pro', 'Classic', 'Modern', 'Luxury', 'Essential', 'Ultimate', 'Supreme', 'Prime'];
        $adjectives = ['Premium', 'Professional', 'Advanced', 'Deluxe', 'Superior', 'Enhanced', 'Ultra', 'Mega', 'Super', 'Extra'];

        $productsCreated = 0;
        $targetProducts = 1000;

        // Generate products for each category
        foreach ($productTemplates as $categoryName => $templates) {
            $category = $categories->get($categoryName);
            if (!$category) continue;

            // Calculate how many products per template to reach 1000 total
            $productsPerTemplate = ceil($targetProducts / (count($productTemplates) * count($templates)));

            foreach ($templates as $template) {
                for ($i = 0; $i < $productsPerTemplate; $i++) {
                    if ($productsCreated >= $targetProducts) break 3;

                    $shop = $shops->random();
                    $brand = $brands[array_rand($brands)];
                    $adjective = $adjectives[array_rand($adjectives)];

                    // Create variation in product names
                    $productName = $i === 0
                        ? $template['name']
                        : $adjective . ' ' . $template['name'] . ' ' . $brand;

                    $basePrice = rand($template['price'][0], $template['price'][1]);
                    $hasDiscount = rand(0, 100) < 60; // 60% chance of discount
                    $originalPrice = $hasDiscount ? $basePrice * 1.3 : null;

                    // Generate Unsplash image URLs with unique random parameters
                    $randomSeed = $productsCreated + time(); // Unique seed for each product
                    $images = array_map(function ($id, $index) use ($randomSeed) {
                        // Add random parameters to make each image unique
                        $sig = substr(md5($randomSeed . $index), 0, 8);
                        return "https://images.unsplash.com/photo-{$id}?w=800&q=80&sig={$sig}";
                    }, $template['images'], array_keys($template['images']));

                    // Random color selection
                    $productColors = [];
                    $numColors = rand(2, 4);
                    $selectedColors = array_rand($colors, $numColors);
                    foreach ((array)$selectedColors as $colorIndex) {
                        $productColors[] = $colors[$colorIndex];
                    }

                    // Sizes for fashion items
                    $productSizes = in_array($categoryName, ['Fashion', 'Sports & Outdoors'])
                        ? array_slice($sizes, 0, rand(3, 6))
                        : [];

                    Product::create([
                        'shop_id' => $shop->id,
                        'category_id' => $category->id,
                        'name' => $productName,
                        'slug' => Str::slug($productName) . '-' . Str::random(5),
                        'description' => "High-quality {$productName} with premium features. Perfect for everyday use and special occasions. Made with attention to detail and superior craftsmanship.",
                        'price' => $basePrice,
                        'original_price' => $originalPrice,
                        'stock_quantity' => rand(10, 100),
                        'images' => $images,
                        'status' => 'published',
                        'is_featured' => rand(0, 100) < 15, // 15% featured
                        'colors' => $productColors,
                        'sizes' => $productSizes,
                        'metadata' => [
                            'brand' => $brand,
                            'warranty' => rand(1, 3) . ' years',
                            'material' => 'Premium Quality',
                        ],
                    ]);

                    $productsCreated++;
                }
            }
        }

        $this->command->info("Created {$productsCreated} products with Unsplash images.");
    }
}
