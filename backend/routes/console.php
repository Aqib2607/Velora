<?php

use App\Jobs\CleanupExpiredReservations;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Clean up expired 15-minute inventory reservations every minute
Schedule::job(new CleanupExpiredReservations())->everyMinute();

// Clean up expired idempotency keys daily
Schedule::command('model:prune', ['--model' => \App\Models\IdempotencyKey::class])->daily();
