<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Velora v1
|--------------------------------------------------------------------------
|
| Middleware stack per spec:
|   auth:sanctum + ResolveTenant + IdempotencyMiddleware + throttle:api
|
| Stripe webhook is excluded from auth (validated by signature).
|
*/

// ──────────────────────────────────────────────────────────
// Public — Auth (requires tenant resolution only)
// ──────────────────────────────────────────────────────────
Route::prefix('v1')->middleware(['resolve.tenant', 'throttle:api'])->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // Stripe webhook — public but signature-validated
    Route::post('webhooks/stripe', [WebhookController::class, 'stripe'])
        ->withoutMiddleware(['throttle:api']);
});

// ──────────────────────────────────────────────────────────
// Authenticated Routes
// ──────────────────────────────────────────────────────────
Route::prefix('v1')->middleware([
    'auth:sanctum',
    'resolve.tenant',
    'idempotency',
    'audit.log',
    'throttle:api',
])->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // ── Catalog
    Route::prefix('catalog')->group(function () {
        Route::get('products',          [ProductController::class, 'index']);
        Route::get('products/{product}', [ProductController::class, 'show']);
        Route::post('products',          [ProductController::class, 'store']);
        Route::patch('products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class, 'destroy']);

        Route::get('categories',             [CategoryController::class, 'index']);
        Route::get('categories/{category}',  [CategoryController::class, 'show']);
        Route::post('categories',            [CategoryController::class, 'store']);
        Route::patch('categories/{category}', [CategoryController::class, 'update']);
        Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    });

    // ── Cart
    Route::prefix('cart')->group(function () {
        Route::get('/',               [CartController::class, 'show']);
        Route::post('items',          [CartController::class, 'addItem']);
        Route::delete('items/{item}', [CartController::class, 'removeItem']);
        Route::delete('/',            [CartController::class, 'clear']);
    });

    // ── Orders
    Route::prefix('orders')->group(function () {
        Route::get('/',            [OrderController::class, 'index']);
        Route::post('/',           [OrderController::class, 'store']);
        Route::get('/{order}',     [OrderController::class, 'show']);
        Route::post('/{order}/cancel', [OrderController::class, 'cancel']);
    });

    // ── Refunds
    Route::prefix('refunds')->group(function () {
        Route::get('/',                        [RefundController::class, 'index']);
        Route::post('/',                       [RefundController::class, 'store']);
        Route::post('/{refund}/approve',       [RefundController::class, 'approve']);
        Route::post('/{refund}/reject',        [RefundController::class, 'reject']);
    });

    // ── Payouts
    Route::prefix('payouts')->group(function () {
        Route::get('/',  [PayoutController::class, 'index']);
        Route::post('/', [PayoutController::class, 'store']);
    });

    // ── Ledger (admin only — enforced via policy in controller)
    Route::prefix('ledger')->group(function () {
        Route::get('accounts',                          [LedgerController::class, 'accounts']);
        Route::get('transactions',                      [LedgerController::class, 'transactions']);
        Route::get('transactions/{transaction}',        [LedgerController::class, 'show']);
    });

    // ── Admin
    Route::prefix('admin')->group(function () {
        Route::get('users',   [AdminController::class, 'users']);
        Route::get('orders',  [AdminController::class, 'orders']);
        Route::get('reports', [AdminController::class, 'reports']);
    });
});
