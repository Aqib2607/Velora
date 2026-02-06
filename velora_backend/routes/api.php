<?php

use Illuminate\Support\Facades\Route;

// Version 1 API Routes
Route::prefix('v1')->group(function () {
    // Public Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
        Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
        Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
        Route::post('/login/2fa', [\App\Http\Controllers\AuthController::class, 'loginWith2fa']);
        Route::post('/forgot-password', [\App\Http\Controllers\PasswordResetController::class, 'forgotPassword']);
        Route::post('/reset-password', [\App\Http\Controllers\PasswordResetController::class, 'resetPassword']);
    });

    // Public Shop & Product Routes
    Route::get('/shops/{slug}', [\App\Http\Controllers\ShopController::class, 'show']);
    Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index']);

    // Product Discovery
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('/products/featured', [\App\Http\Controllers\ProductController::class, 'featured']);
    Route::get('/products/trending', [\App\Http\Controllers\ProductController::class, 'trending']);
    Route::get('/search/suggestions', [\App\Http\Controllers\ProductController::class, 'searchSuggestions']);
    Route::get('/products/{slug}', [\App\Http\Controllers\ProductController::class, 'show']);
    Route::get('/products/{id}/related', [\App\Http\Controllers\ProductController::class, 'related']);

    Route::get('/health', function () {
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();

            return response()->json(['status' => 'ok', 'message' => 'Database connection successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Database connection failed'], 500);
        }
    });

    // Public Verification Routes
    Route::get('/email/verify/{id}/{hash}', [\App\Http\Controllers\VerificationController::class, 'verify'])->name('verification.verify');

    // Public Contact & Coupon Routes
    Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store']);
    Route::get('/coupons', [\App\Http\Controllers\CouponController::class, 'index']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/email/resend', [\App\Http\Controllers\VerificationController::class, 'resend']);

        Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
        Route::get('/user', [\App\Http\Controllers\AuthController::class, 'me']);
        Route::put('/user/profile', [\App\Http\Controllers\AuthController::class, 'updateProfile']);
        Route::put('/user/password', [\App\Http\Controllers\AuthController::class, 'updatePassword']);
        Route::post('/profile/avatar', [\App\Http\Controllers\AuthController::class, 'updateAvatar']);
        Route::post('/profile/avatar', [\App\Http\Controllers\AuthController::class, 'updateAvatar']);
        Route::delete('/user', [\App\Http\Controllers\AuthController::class, 'deleteAccount']);

        // 2FA Routes
        Route::post('/user/two-factor-authentication', [\App\Http\Controllers\TwoFactorController::class, 'enable']);
        Route::post('/user/confirmed-two-factor-authentication', [\App\Http\Controllers\TwoFactorController::class, 'confirm']);
        Route::delete('/user/two-factor-authentication', [\App\Http\Controllers\TwoFactorController::class, 'disable']);

        // Session Routes
        Route::get('/user/sessions', [\App\Http\Controllers\SessionController::class, 'index']);
        Route::delete('/user/sessions', [\App\Http\Controllers\SessionController::class, 'destroyOtherSessions']);
        Route::delete('/user/sessions/{id}', [\App\Http\Controllers\SessionController::class, 'destroy']);

        Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats']);

        Route::post('/shops/register', [\App\Http\Controllers\ShopController::class, 'register']);

        // Cart & Checkout
        Route::post('/cart/sync', [\App\Http\Controllers\CartController::class, 'sync']);
        Route::post('/checkout/init', [\App\Http\Controllers\CheckoutController::class, 'init']);
        Route::post('/payment/success', [\App\Http\Controllers\CheckoutController::class, 'paymentSuccess']);

        // Orders (Moved to bottom to allow Admin routes priority)
        Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index']);

        // Wishlist
        Route::get('/wishlist', [\App\Http\Controllers\WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [\App\Http\Controllers\WishlistController::class, 'toggle']);

        // Reviews
        Route::post('/products/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);

        // Reviews
        Route::post('/products/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);

        // Shipping (3rd Party API Integration)
        Route::post('/shipping/rates', [\App\Http\Controllers\ShippingController::class, 'rates']);

        // Vendor Routes
        Route::middleware('role:shop_owner')->group(function () {
            Route::post('/shop/register', [\App\Http\Controllers\ShopController::class, 'store']);
            Route::get('/shop/me', [\App\Http\Controllers\ShopController::class, 'me']);
            Route::put('/shop/me', [\App\Http\Controllers\ShopController::class, 'update']);
            Route::get('/vendor/dashboard', [\App\Http\Controllers\ShopController::class, 'dashboard']);

            Route::get('/vendor/products', [\App\Http\Controllers\ProductController::class, 'vendorIndex']);
            Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store']);
            Route::put('/products/{id}', [\App\Http\Controllers\ProductController::class, 'update']);
            Route::delete('/products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy']);
            Route::post('/products/{id}/restore', [\App\Http\Controllers\ProductController::class, 'restore']);

            Route::get('/vendor/orders', [\App\Http\Controllers\OrderController::class, 'vendorOrders']);
            Route::patch('/vendor/orders/items/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateItemStatus']);

            // Vendor Coupons
            Route::get('/vendor/coupons', [\App\Http\Controllers\CouponController::class, 'vendorIndex']);
            Route::post('/coupons', [\App\Http\Controllers\CouponController::class, 'store']);
            Route::delete('/coupons/{coupon}', [\App\Http\Controllers\CouponController::class, 'destroy']);
        });

        // Admin Routes
        Route::middleware('role:admin')->group(function () {
            // User Management
            Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'index']);
            Route::get('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'show']);
            Route::put('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'update']);
            Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);

            // Shop Management
            Route::get('/admin/shops', [\App\Http\Controllers\AdminController::class, 'shopsIndex']);
            Route::patch('/admin/shops/{id}/approve', [\App\Http\Controllers\AdminController::class, 'approveShop']);
            Route::patch('/admin/shops/{id}/suspend', [\App\Http\Controllers\AdminController::class, 'suspendShop']);

            // Global/Admin Categories
            Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
            Route::put('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);

            // Analytics
            Route::get('/admin/stats', [\App\Http\Controllers\AnalyticsController::class, 'adminStats']);

            // Orders
            Route::patch('/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus']);
            Route::get('/orders/export', [\App\Http\Controllers\OrderController::class, 'export']);
            Route::get('/orders/admin', [\App\Http\Controllers\OrderController::class, 'adminOrders']);

            // Start Admin Products
            Route::get('/admin/products', [\App\Http\Controllers\ProductController::class, 'adminIndex']);
            // End Admin Products

            // Global Settings
            Route::get('/admin/settings', [\App\Http\Controllers\SettingController::class, 'index']);
            Route::put('/admin/settings', [\App\Http\Controllers\SettingController::class, 'update']);

            // Admin Coupons
            Route::get('/admin/coupons', [\App\Http\Controllers\CouponController::class, 'adminIndex']);
            Route::apiResource('coupons', \App\Http\Controllers\CouponController::class)->except(['index', 'store', 'destroy', 'show']);
            // Note: Admin uses same store/destroy as generic but might need specific route handling if we want pure admin overrides without checks. 
            // However, CouponController@destroy allows admin deletion. CouponController@store enables admin to create.
        });

        // Common Upload Route
        Route::post('/upload', [\App\Http\Controllers\UploadController::class, 'store']);

        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
        Route::post('/notifications/read/{id?}', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);

        // Manage Addresses
        Route::apiResource('addresses', \App\Http\Controllers\AddressController::class);

        // Manage Contact Messages (Admin)
        Route::get('/contact/messages', [\App\Http\Controllers\ContactController::class, 'index']);

        // Broadcasting Auth (Manual override if default doesn't work or for custom path)
        Route::post('/broadcasting/auth', function (Illuminate\Http\Request $request) {
            return Illuminate\Support\Facades\Broadcast::auth($request);
        });

        // Generic Order Routes (Must be after Admin/Vendor specific routes to avoid wildcard shadowing)
        Route::get('/orders/{id}', [\App\Http\Controllers\OrderController::class, 'show']);
        Route::get('/orders/{id}/invoice', [\App\Http\Controllers\OrderController::class, 'invoice']);
    });
});
