<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Http\Requests\StoreCouponRequest;
use App\Traits\ApiResponse;

class CouponController extends Controller
{
    use ApiResponse;

    // Public/Global coupons (e.g. for cart application)
    public function index()
    {
        // Only show active global coupons (where shop_id is NULL)
        return $this->success('Global coupons retrieved', Coupon::where('is_active', true)
            ->whereNull('shop_id')
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->get());
    }

    // Vendor: Get my shop's coupons
    public function vendorIndex(Request $request)
    {
        $user = $request->user();
        if (!$user->shop) {
            return $this->error('User has no shop', 400);
        }

        return $this->success('Vendor coupons retrieved', Coupon::where('shop_id', $user->shop->id)->get());
    }

    // Admin: Get all coupons
    public function adminIndex()
    {
        return $this->success('All coupons retrieved', Coupon::with('shop')->paginate(20));
    }

    public function store(StoreCouponRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        if ($user->role === 'shop_owner' && $user->shop) {
            $data['shop_id'] = $user->shop->id;
        } elseif ($user->role === 'admin') {
            // Admin can optionally set shop_id if they want to create a coupon FOR a shop, 
            // otherwise it defaults to null (Global)
        }

        $coupon = Coupon::create($data);
        return $this->success('Coupon created successfully', $coupon, 201);
    }

    public function destroy(Request $request, Coupon $coupon)
    {
        $user = $request->user();

        // Check ownership if vendor
        if ($user->role === 'shop_owner') {
            if (!$user->shop || $coupon->shop_id !== $user->shop->id) {
                return $this->error('Unauthorized to delete this coupon', 403);
            }
        }
        // Admin can delete any coupon

        $coupon->delete();
        return $this->success('Coupon deleted successfully');
    }
}
