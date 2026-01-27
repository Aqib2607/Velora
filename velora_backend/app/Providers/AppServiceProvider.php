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

        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Support\Facades\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Custom Verification URL for SPA
        \Illuminate\Auth\Notifications\VerifyEmail::createUrlUsing(function (object $notifiable) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            // Extract parameters from the default generated URL (which is a signed route)
            // Or manually construct it. The default $url is the backend route.
            // A safer way is to manually construct the signature logic or pass the signed params.
            // Laravel's temporarySignedRoute generates the backend URL.
            // We want: FRONTEND_URL/verify-email/{id}/{hash}?expires=...&signature=...

            // Re-generate signature for frontend? Or just use the backend URL's query params?
            // Actually, usually we point to the FRONTEND, which then calls the BACKEND (signed).
            // So we can send the verifying Endpoint URL as a query param or separate parts.
            // Simplest standard practice: Frontend receives ID + Hash + Query Params, then makes API call to Backend.

            // Let's reconstruct the components we need.
            $id = $notifiable->getKey();
            $hash = sha1($notifiable->getEmailForVerification());

            // We need to match the signature generation of the backend route we will create.
            // However, usually we can just use the backend Signed URL and pass it to frontend? No, front needs to load page.

            // Let's build the frontend URL with the backend API URL as a parameter? No, that's complex.
            // Standard: Frontend URL has params -> Frontend calls Backend with those params.
            // The backend verification route MUST match the signature.
            // The signature is based on the URL. If we change the URL (to frontend), the signature from backend won't match if backend uses backend-route for validation.
            // Strategy: We will point the email to the Frontend.
            // The Frontend will take `id` and `hash` and `expires` and `signature` and send them to the Backend `GET /email/verify/...`.
            // The Backend `UrlGenerator` signs the *Backend* URL.
            // So we need to generate a valid *Backend* Signed URL, extract the query parameters (expires, signature), and append them to the Frontend URL.

            $backendVerifyUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'verification.verify',
                \Illuminate\Support\Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $id,
                    'hash' => $hash,
                ]
            );

            $query = parse_url($backendVerifyUrl, PHP_URL_QUERY);

            return "{$frontendUrl}/verify-email/{$id}/{$hash}?{$query}";
        });
    }
}
