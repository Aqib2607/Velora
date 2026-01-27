<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = ucfirst(fake()->word()).' '.ucfirst(fake()->word()); // "Generic Category"

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::random(5),
        ];
    }
}
