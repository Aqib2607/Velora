<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Category::truncate();
        Schema::enableForeignKeyConstraints();

        $categories = [
            'Electronics' => [
                'Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Headphones', 'Smart Watches', 'Gaming Consoles', 'Audio', 'Accessories'
            ],
            'Fashion' => [
                'Men', 'Women', 'Kids', 'Shoes', 'Bags', 'Accessories', 'Jewelry', 'Watches'
            ],
            'Home & Living' => [
                'Furniture', 'Bedding', 'Decor', 'Kitchen & Dining', 'Lighting', 'Storage & Organization', 'Bath'
            ],
            'Beauty & Health' => [
                'Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Personal Care', 'Health Care', 'Vitamins'
            ],
            'Sports & Outdoors' => [
                'Exercise & Fitness', 'Outdoor Recreation', 'Team Sports', 'Camping & Hiking', 'Cycling', 'Fishing'
            ],
            'Toys & Hobbies' => [
                'Action Figures', 'Dolls', 'Puzzles', 'Educational Toys', 'Remote Control Goals', 'Board Games'
            ],
            'Automotive' => [
                'Car Electronics', 'Car Care', 'Replacement Parts', 'Tires & Wheels', 'Tools & Equipment'
            ],
            'Books' => [
                'Fiction', 'Non-Fiction', 'Children\'s Books', 'Textbooks', 'Comics'
            ],
            'Groceries' => [
                'Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Pantry Staples', 'Snacks', 'Beverages'
            ]
        ];

        foreach ($categories as $parentName => $subcategories) {
            $parent = Category::create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
                'parent_id' => null,
            ]);

            foreach ($subcategories as $subName) {
                // Ensure unique slug for common subcategories like 'Accessories'
                $slug = Str::slug($subName);
                if (Category::where('slug', $slug)->exists()) {
                    $slug = Str::slug($parentName . ' ' . $subName);
                }

                Category::create([
                    'name' => $subName,
                    'slug' => $slug,
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}
