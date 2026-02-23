<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->nullOnDelete();
            $table->string('provider')->default('stripe'); // extensible
            $table->string('event_id')->unique();          // stripe event id — deduplication
            $table->string('event_type');
            $table->json('payload');
            $table->enum('status', ['pending', 'processing', 'processed', 'failed'])->default('pending');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['provider', 'event_type']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
    }
};
