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
        // Only applies to mutating requests
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            return $next($request);
        }

        $key = $request->header('Idempotency-Key');

        if (!$key) {
            return $next($request);
        }

        $user  = $request->user();
        $route = $request->route()?->getName() ?? $request->path();

        // Check for existing key
        $existing = IdempotencyKey::where('key', $key)
            ->where('user_id', $user?->id)
            ->where('route', $route)
            ->where('expires_at', '>', now())
            ->first();

        if ($existing) {
            $responseData = unserialize($existing->response_hash);
            return response()->json($responseData['body'], $responseData['status']);
        }

        $response = $next($request);

        // Store the response if successful
        if ($response->isSuccessful() && $user) {
            IdempotencyKey::create([
                'key'           => $key,
                'user_id'       => $user->id,
                'route'         => $route,
                'response_hash' => serialize([
                    'status' => $response->getStatusCode(),
                    'body'   => json_decode($response->getContent(), true),
                ]),
                'expires_at' => now()->addHours(24),
            ]);
        }

        return $response;
    }
}
