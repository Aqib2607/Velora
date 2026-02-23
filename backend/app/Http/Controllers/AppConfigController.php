<?php

namespace App\Http\Controllers;

use App\Models\Region;
use App\Models\Currency;
use Illuminate\Http\Request;

class AppConfigController extends Controller
{
    public function index()
    {
        $regions = Region::where('is_active', true)->get();
        $currencies = Currency::all();

        return response()->json([
            'data' => [
                'regions' => $regions,
                'currencies' => $currencies,
                // Additional aggregate config can go here
                'store_name' => config('app.name'),
            ]
        ]);
    }
}
