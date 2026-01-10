<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/forgot-password', [\App\Http\Controllers\PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [\App\Http\Controllers\PasswordResetController::class, 'resetPassword']);

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

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/me', [\App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/profile/update', [\App\Http\Controllers\AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [\App\Http\Controllers\AuthController::class, 'updateAvatar']);

    Route::post('/shops/register', [\App\Http\Controllers\ShopController::class, 'register']);

    // Cart & Checkout
    Route::post('/cart/sync', [\App\Http\Controllers\CartController::class, 'sync']);
    Route::post('/checkout/init', [\App\Http\Controllers\CheckoutController::class, 'init']);
    Route::post('/payment/success', [\App\Http\Controllers\CheckoutController::class, 'paymentSuccess']);

    // Orders
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index']);
    Route::get('/orders/{id}', [\App\Http\Controllers\OrderController::class, 'show']);
    Route::get('/orders/{id}/invoice', [\App\Http\Controllers\OrderController::class, 'invoice']);

    // Wishlist
    Route::get('/wishlist', [\App\Http\Controllers\WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [\App\Http\Controllers\WishlistController::class, 'toggle']);

    // Reviews
    Route::post('/products/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);

    // Vendor Routes
    Route::middleware('role:shop_owner')->group(function () {
        Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store']);
        Route::get('/vendor/orders', [\App\Http\Controllers\OrderController::class, 'vendorOrders']);
        Route::get('/vendor/stats', [\App\Http\Controllers\AnalyticsController::class, 'vendorStats']);
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
        Route::put('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
        Route::get('/admin/stats', [\App\Http\Controllers\AnalyticsController::class, 'adminStats']);
        Route::patch('/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus']);
    });
});
