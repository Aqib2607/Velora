<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('preferred_language')->default('en')->after('email');
            $table->string('preferred_region')->default('US')->after('preferred_language');
            $table->string('preferred_currency')->default('USD')->after('preferred_region');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['preferred_language', 'preferred_region', 'preferred_currency']);
        });
    }
};
