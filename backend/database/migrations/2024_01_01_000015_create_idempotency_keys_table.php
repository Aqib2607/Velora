<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('idempotency_keys', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('route');
            $table->text('response_hash');   // stores serialized response
            $table->timestamp('expires_at'); // 24h TTL
            $table->timestamps();

            $table->unique(['key', 'user_id', 'route']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idempotency_keys');
    }
};
