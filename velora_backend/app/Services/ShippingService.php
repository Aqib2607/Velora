<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class ShippingService
{
    /**
     * Calculate shipping rates based on destination and weight.
     * Simulates an external API call.
     */
    public function calculateRates(array $address, $weight = 1)
    {
        // Cache key based on country and weight
        $cacheKey = 'shipping_rates_'.($address['country'] ?? 'US').'_'.$weight;

        return Cache::remember($cacheKey, 3600, function () use ($address, $weight) {
            // Simulate API latency
            // sleep(1);

            // Mocked response from a "3rd Party Logistics" provider
            $baseRate = 10;
            if (($address['country'] ?? 'US') !== 'US') {
                $baseRate = 25;
            }

            $rate = $baseRate + ($weight * 2);

            return [
                [
                    'provider' => 'FastShip',
                    'service' => 'Standard',
                    'cost' => $rate,
                    'currency' => 'USD',
                    'estimated_days' => 5,
                ],
                [
                    'provider' => 'FastShip',
                    'service' => 'Express',
                    'cost' => $rate * 2.5,
                    'currency' => 'USD',
                    'estimated_days' => 2,
                ],
            ];
        });
    }
}
