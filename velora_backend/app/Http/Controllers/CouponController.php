<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Http\Requests\StoreCouponRequest;
use App\Traits\ApiResponse;

class CouponController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success('Active coupons retrieved', Coupon::where('is_active', true)->where(function($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
        })->get());
    }

    public function store(StoreCouponRequest $request)
    {
        $coupon = Coupon::create($request->validated());
        return $this->success('Coupon created successfully', $coupon, 201);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return $this->success('Coupon deleted successfully');
    }
}
