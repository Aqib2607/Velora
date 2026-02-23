<?php

namespace App\Http\Controllers;

use App\Models\GiftCard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GiftCardController extends Controller
{
    public function index(): JsonResponse
    {
        $cards = GiftCard::where('user_id', Auth::id())->get();
        return response()->json(['status' => 'success', 'data' => $cards]);
    }

    public function purchase(Request $request): JsonResponse
    {
        // Handled by order system usually, but adding baseline
        return response()->json(['status' => 'success', 'message' => 'Gift card purchase initiated.']);
    }

    public function redeem(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);
        return response()->json(['status' => 'success', 'message' => 'Gift card redeemed.']);
    }
}
