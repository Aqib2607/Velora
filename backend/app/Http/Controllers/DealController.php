<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index(): JsonResponse
    {
        $deals = Deal::where('status', 'active')
            ->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->get();
        return response()->json(['status' => 'success', 'data' => $deals]);
    }
}
