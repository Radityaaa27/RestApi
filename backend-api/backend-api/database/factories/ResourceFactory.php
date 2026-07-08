<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->words(3, true)),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'description' => $this->faker->sentence(),
        ];
    }
}
