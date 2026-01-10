<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'total_amount' => fake()->randomFloat(2, 50, 500),
            'subtotal' => fake()->randomFloat(2, 40, 450),
            'tax' => fake()->randomFloat(2, 5, 20),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'payment_status' => fake()->randomElement(['paid', 'unpaid']),
            'payment_method' => 'stripe',
            'shipping_address' => ['address' => fake()->address()],
        ];
    }
}
