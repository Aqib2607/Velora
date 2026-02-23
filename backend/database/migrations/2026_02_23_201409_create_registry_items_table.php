<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registry_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registry_id')->constrained('registries')->cascadeOnDelete();
            $table->foreignId('sku_id')->constrained('skus')->cascadeOnDelete();
            $table->unsignedInteger('quantity_desired')->default(1);
            $table->unsignedInteger('quantity_purchased')->default(0);
            $table->boolean('is_essential')->default(false);
            $table->timestamps();

            // Prevent duplicate items in same registry
            $table->unique(['registry_id', 'sku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registry_items');
    }
};
