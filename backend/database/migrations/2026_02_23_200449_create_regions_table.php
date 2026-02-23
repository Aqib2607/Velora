<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 2)->unique(); // e.g. US, EU, BD
            $table->string('name');
            $table->string('currency_code', 3);
            $table->string('locale')->default('en-US');
            $table->decimal('tax_rate', 5, 4)->default(0.0000);
            $table->string('shipping_region')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
