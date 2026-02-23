<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('stripe_payment_intent_id')->nullable()->unique();
            $table->string('stripe_charge_id')->nullable()->unique();
            $table->enum('status', [
                'pending',
                'processing',
                'succeeded',
                'failed',
                'cancelled',
                'refunded'
            ])->default('pending');
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('payment_method_type')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // No raw card data stored
            $table->index(['tenant_id', 'status']);
            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
