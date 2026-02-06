<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = ucfirst(fake()->words(3, true));
        $price = fake()->randomFloat(2, 10, 1000);

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(5),
            'description' => fake()->paragraph(3),
            'price' => $price,
            'original_price' => fake()->boolean(60) ? $price * 1.2 : null, // 60% chance of discount
            'stock_quantity' => fake()->numberBetween(0, 100),
            'images' => [
                'https://placehold.co/600x400?text=' . urlencode($name) . '+1',
                'https://placehold.co/600x400?text=' . urlencode($name) . '+2',
                'https://placehold.co/600x400?text=' . urlencode($name) . '+3',
            ],
            'status' => 'published',
            'is_featured' => fake()->boolean(20),
            'colors' => [
                ['name' => 'Black', 'hex' => '#000000'],
                ['name' => 'White', 'hex' => '#FFFFFF'],
                ['name' => 'Blue', 'hex' => '#0000FF'],
            ],
            'sizes' => ['S', 'M', 'L', 'XL'],
            'metadata' => [
                'material' => fake()->word(),
                'care' => 'Hand wash only',
            ],
        ];
    }
}
