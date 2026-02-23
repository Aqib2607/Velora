<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return;
        }

        if (!$response->isSuccessful()) {
            return;
        }

        $user   = $request->user();
        $tenant = app('tenant');

        AuditLog::create([
            'tenant_id'   => $tenant?->id,
            'user_id'     => $user?->id,
            'entity_type' => $request->route()?->getName() ?? $request->path(),
            'entity_id'   => $request->route('id'),
            'action'      => strtolower($request->method()),
            'new_value'   => $request->except(['password', 'password_confirmation', 'card_number', 'cvv']),
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);
    }
}
