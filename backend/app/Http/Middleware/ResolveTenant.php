<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Try X-Tenant-ID header first
        $tenantId = $request->header('X-Tenant-ID');

        // 2. Fallback to subdomain (e.g. acme.velora.app)
        if (!$tenantId) {
            $host   = $request->getHost();
            $parts  = explode('.', $host);
            $slug   = count($parts) >= 3 ? $parts[0] : null;

            if ($slug) {
                $tenant = Tenant::where('slug', $slug)->where('status', 'active')->first();
            }
        }

        // 3. Resolve by ID if header was provided
        if ($tenantId && !isset($tenant)) {
            $tenant = Tenant::where('id', $tenantId)->where('status', 'active')->first();
        }

        if (empty($tenant)) {
            return response()->json([
                'status'     => 'error',
                'message'    => 'Tenant not found or inactive.',
                'error_code' => 'TENANT_UNRESOLVABLE',
            ], 403);
        }

        // 4. Bind tenant to container for global scope
        app()->instance('tenant', $tenant);
        $request->attributes->set('tenant', $tenant);

        return $next($request);
    }
}
