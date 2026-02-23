<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gift_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('purchaser_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code')->unique(); // Unique index enforced
            $table->decimal('initial_balance', 14, 2);
            $table->decimal('current_balance', 14, 2);
            $table->string('currency', 3)->default('USD'); // Redemption is typically USD restricted or converted at redemption
            $table->enum('status', ['active', 'redeemed', 'expired', 'disabled'])->default('active');
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gift_cards');
    }
};
