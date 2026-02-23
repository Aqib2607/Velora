<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', ['lightning', 'limited', 'clearance']);
            $table->decimal('discount_percentage', 5, 2);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index(); // Indexed for efficient auto-expiry logic
            $table->unsignedInteger('stock_allocation')->default(0);
            $table->unsignedInteger('stock_sold')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
