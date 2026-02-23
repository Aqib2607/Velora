<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sku_id')->constrained('skus')->cascadeOnDelete();
            $table->unsignedInteger('quantity_available')->default(0);
            $table->unsignedInteger('quantity_reserved')->default(0);
            $table->unsignedInteger('quantity_sold')->default(0);
            $table->unsignedInteger('low_stock_threshold')->default(5);
            $table->timestamps();

            $table->index('sku_id');
        });

        Schema::create('inventory_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sku_id')->constrained('skus')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('order_reference')->nullable();
            $table->unsignedInteger('quantity');
            $table->enum('status', ['pending', 'confirmed', 'released', 'expired'])->default('pending');
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['sku_id', 'status']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_reservations');
        Schema::dropIfExists('inventory');
    }
};
