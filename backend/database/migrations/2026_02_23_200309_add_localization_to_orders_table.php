<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Enforces enterprise-grade historical financial tracking.
     * Orders store the currency snapshot and exchange rate used at the exact time of purchase.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('currency_code', 3)->default('USD')->after('total');
            $table->decimal('exchange_rate_snapshot', 14, 6)->default(1.000000)->after('currency_code');
            $table->string('region_code')->nullable()->after('exchange_rate_snapshot');

            // Index for faster regional reporting
            $table->index('region_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['region_code']);
            $table->dropColumn(['currency_code', 'exchange_rate_snapshot', 'region_code']);
        });
    }
};
