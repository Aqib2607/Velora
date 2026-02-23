<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use App\Models\SellerProfile;
use App\Modules\Payout\PayoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    public function __construct(private readonly PayoutService $payouts) {}

    public function index(Request $request): JsonResponse
    {
        $profile = SellerProfile::where('user_id', $request->user()->id)->firstOrFail();
        $payouts = Payout::where('seller_profile_id', $profile->id)->orderByDesc('created_at')->paginate(15);

        return response()->json(['status' => 'success', 'data' => $payouts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'seller_profile_id' => 'required|exists:seller_profiles,id',
            'amount'            => 'required|numeric|min:1',
        ]);

        $seller = SellerProfile::findOrFail($validated['seller_profile_id']);
        $payout = $this->payouts->process($seller, $validated['amount'], app('tenant')->id);

        return response()->json(['status' => 'success', 'data' => $payout], 201);
    }
}
