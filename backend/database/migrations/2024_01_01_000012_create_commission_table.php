<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['percentage', 'flat'])->default('percentage');
            $table->decimal('rate', 14, 2);
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('tenant_id');
        });

        Schema::create('commission_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
            $table->foreignId('seller_profile_id')->constrained('seller_profiles');
            $table->foreignId('commission_rule_id')->constrained('commission_rules');
            $table->decimal('sale_amount', 14, 2);
            $table->decimal('commission_amount', 14, 2);
            $table->decimal('seller_payout', 14, 2);
            $table->enum('status', ['pending', 'processed', 'paid'])->default('pending');
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_records');
        Schema::dropIfExists('commission_rules');
    }
};
