<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('payment_id')->constrained('payments');
            $table->foreignId('requested_by')->constrained('users');
            $table->string('stripe_refund_id')->nullable()->unique();
            $table->decimal('amount', 14, 2);
            $table->string('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'processing', 'completed', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });

        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('seller_profile_id')->constrained('seller_profiles');
            $table->string('stripe_transfer_id')->nullable()->unique();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['pending', 'processing', 'paid', 'failed'])->default('pending');
            $table->boolean('has_active_disputes')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
        Schema::dropIfExists('refunds');
    }
};
