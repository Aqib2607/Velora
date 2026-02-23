<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Region::where('is_active', true)->get()
        ]);
    }
}
