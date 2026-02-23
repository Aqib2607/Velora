<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->string('code');
            $table->decimal('balance', 14, 2)->default(0);
            $table->timestamps();

            $table->unique(['tenant_id', 'code']); // each tenant has their own account codes
            $table->index('tenant_id');
        });

        Schema::create('ledger_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('reference');         // e.g. order_123, refund_456
            $table->string('description');
            $table->enum('status', ['pending', 'posted', 'reversed'])->default('posted');
            $table->timestamp('posted_at');
            $table->timestamps();

            $table->index(['tenant_id', 'reference']);
        });

        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('transaction_id')->constrained('ledger_transactions');
            $table->foreignId('account_id')->constrained('ledger_accounts');
            $table->enum('type', ['debit', 'credit']);
            $table->decimal('amount', 14, 2);
            $table->text('memo')->nullable();
            $table->timestamps();

            // Immutable — no update or delete allowed (enforced via DB trigger)
            $table->index(['account_id', 'created_at']);
            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
        Schema::dropIfExists('ledger_transactions');
        Schema::dropIfExists('ledger_accounts');
    }
};
