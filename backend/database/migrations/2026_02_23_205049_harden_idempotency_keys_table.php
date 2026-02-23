<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('idempotency_keys', function (Blueprint $table) {
            $table->string('request_hash', 64)->after('route')->index();
            $table->integer('status_code')->after('request_hash')->default(200);
            $table->longText('response_body')->after('status_code')->nullable();

            // Make legacy column nullable to allow transition to hardened storage
            $table->text('response_hash')->nullable()->change();

            // Cleanup old column if needed, or keep for transition
            // $table->dropColumn('response_hash');
        });
    }

    public function down(): void
    {
        Schema::table('idempotency_keys', function (Blueprint $table) {
            $table->dropColumn(['request_hash', 'status_code', 'response_body']);
        });
    }
};
