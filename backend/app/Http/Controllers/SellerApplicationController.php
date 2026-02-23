<?php

namespace App\Http\Controllers;

use App\Models\SellerApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerApplicationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate(['business_name' => 'required', 'tax_id' => 'required']);
        return response()->json(['status' => 'success', 'message' => 'Application submitted.']);
    }

    public function status(): JsonResponse
    {
        $app = SellerApplication::where('user_id', Auth::id())->first();
        return response()->json(['status' => 'success', 'data' => $app]);
    }
}
