<?php

namespace App\Http\Middleware;

use App\Models\IdempotencyKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdempotencyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only applies to mutating requests and check if Idempotency-Key is present
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            return $next($request);
        }

        $key = $request->header('Idempotency-Key');
        if (!$key) {
            return $next($request);
        }

        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        // Generate a hash of the request content to ensure identical payload
        $requestHash = hash('sha256', serialize([
            'path' => $request->path(),
            'query' => $request->query(),
            'body' => $request->all(),
        ]));

        $route = $request->route()?->getName() ?? $request->path();

        // 1. Double check for duplicate request with the same hash
        $existing = IdempotencyKey::where('key', $key)
            ->where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->first();

        if ($existing) {
            // Verify payload has not changed for the same key
            if ($existing->request_hash !== $requestHash) {
                return response()->json([
                    'error' => 'Idempotency Key Conflict',
                    'message' => 'The idempotency key was previously used with a different request payload.'
                ], 409);
            }

            // Return original response
            return response($existing->response_body, $existing->status_code)
                ->header('X-Idempotency-Replayed', 'true');
        }

        // 2. Execute request
        $response = $next($request);

        // 3. Store snapshot only if status is within successful or redirect range
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 400) {
            IdempotencyKey::create([
                'key' => $key,
                'user_id' => $user->id,
                'route' => $route,
                'request_hash' => $requestHash,
                'status_code' => $response->getStatusCode(),
                'response_body' => $response->getContent(),
                'expires_at' => now()->addHours(24),
            ]);
        }

        return $response;
    }
}
