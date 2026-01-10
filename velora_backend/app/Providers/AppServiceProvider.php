<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->isProduction()) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \Illuminate\Support\Facades\RateLimiter::for('api', function (Request $request) {
            return \Illuminate\Support\Facades\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
        
        // Strict Login Throttling mentioned in Prompt 38 is typically default 'login' limiter in Laravel.
        // But we can define explicitly if needed or rely on Fortify/Breeze defaults if installed (Manual here).
        // Let's add specific logic for auth routes in routes/api.php using throttle middleware directly.
    }
}
