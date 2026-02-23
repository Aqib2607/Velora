<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            // Composite index for high-speed transaction auditing per tenant
            $table->index(['tenant_id', 'transaction_id'], 'idx_ledger_tenant_transaction');

            // Composite index for account history lookups
            $table->index(['account_id', 'tenant_id', 'created_at'], 'idx_ledger_account_tenant_history');
        });

        Schema::table('ledger_transactions', function (Blueprint $table) {
            // Composite index for searching transactions by reference and status per tenant
            $table->index(['tenant_id', 'reference'], 'idx_trans_tenant_ref');
            $table->index(['tenant_id', 'status', 'posted_at'], 'idx_trans_tenant_status_date');
        });
    }

    public function down(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->dropIndex('idx_ledger_tenant_transaction');
            $table->dropIndex('idx_ledger_account_tenant_history');
        });

        Schema::table('ledger_transactions', function (Blueprint $table) {
            $table->dropIndex('idx_trans_tenant_ref');
            $table->dropIndex('idx_trans_tenant_status_date');
        });
    }
};
