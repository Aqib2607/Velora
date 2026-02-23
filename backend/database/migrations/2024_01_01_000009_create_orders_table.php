<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->string('idempotency_key')->nullable();
            $table->enum('status', [
                'pending',
                'payment_pending',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ])->default('pending');
            $table->decimal('subtotal', 14, 2);
            $table->decimal('tax', 14, 2)->default(0);
            $table->decimal('shipping', 14, 2)->default(0);
            $table->decimal('discount', 14, 2)->default(0);
            $table->decimal('total', 14, 2);
            $table->json('shipping_address')->nullable();
            $table->json('billing_address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'created_at']);
            $table->index(['tenant_id', 'status']);
            $table->index('idempotency_key');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('sku_id')->constrained('skus');
            $table->foreignId('seller_profile_id')->constrained('seller_profiles');
            $table->string('product_name');
            $table->string('sku_code');
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 14, 2);
            $table->decimal('total', 14, 2);
            $table->json('options')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
