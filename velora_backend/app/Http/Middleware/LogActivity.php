<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Check if we should log this request
        if ($this->shouldLog($request)) {
            try {
                ActivityLog::create([
                    'user_id' => $request->user()?->id,
                    'method' => $request->method(),
                    'path' => $request->path(),
                    'status_code' => $response->getStatusCode(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } catch (\Exception $e) {
                // Fail silently to not impact user experience
                Log::error('Failed to log activity: '.$e->getMessage());
            }
        }

        return $response;
    }

    protected function shouldLog(Request $request): bool
    {
        // Don't log read-only requests for public assets or health checks if needed
        // For now, log everything except maybe login attempts if sensitive?
        // Or specific noisy paths.

        $excludedPaths = [
            'health',
            'broadcasting/auth',
            'sanctum/csrf-cookie',
        ];

        foreach ($excludedPaths as $path) {
            if ($request->is($path)) {
                return false;
            }
        }

        return true;
    }
}
