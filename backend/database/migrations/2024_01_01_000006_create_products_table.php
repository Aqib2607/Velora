<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('seller_profile_id')->constrained('seller_profiles')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->longText('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['draft', 'active', 'inactive', 'archived'])->default('draft');
            $table->json('attributes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'status']);
            $table->unique(['tenant_id', 'slug']);
        });

        Schema::create('skus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('sku_code')->unique();
            $table->decimal('price', 14, 2);
            $table->decimal('compare_price', 14, 2)->nullable();
            $table->json('options')->nullable(); // e.g. {"color": "red", "size": "M"}
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id']);
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skus');
        Schema::dropIfExists('products');
    }
};
