<?php

namespace App\Http\Controllers;

use App\Services\ShippingService;
use Illuminate\Http\Request;

class ShippingController extends BaseController
{
    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    public function rates(Request $request)
    {
        $request->validate([
            'address.country' => 'required|string|size:2',
            'address.zip' => 'required|string',
            'weight' => 'nullable|numeric|min:0.1',
        ]);

        $rates = $this->shippingService->calculateRates(
            $request->input('address'),
            $request->input('weight', 1.0)
        );

        return $this->success('Shipping rates retrieved', $rates);
    }
}
