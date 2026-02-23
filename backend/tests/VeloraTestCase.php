<?php

namespace Tests;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class VeloraTestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected Tenant $tenantA;
    protected Tenant $tenantB;
    protected User   $adminA;
    protected User   $sellerUserA;
    protected User   $buyerA;
    protected User   $buyerB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $this->tenantA     = Tenant::where('slug', 'alpha')->first();
        $this->tenantB     = Tenant::where('slug', 'beta')->first();
        $this->adminA      = User::where('email', 'admin@alpha.test')->first();
        $this->sellerUserA = User::where('email', 'seller@alpha.test')->first();
        $this->buyerA      = User::where('email', 'buyer@alpha.test')->first();
        $this->buyerB      = User::where('email', 'buyer@beta.test')->first();

        // Bind tenant A by default (most tests use it)
        app()->instance('tenant', $this->tenantA);
    }

    /**
     * Returns request headers that simulate a Tenant A authenticated request.
     */
    protected function headersForTenantA(?User $user = null): array
    {
        $user ??= $this->buyerA;
        Sanctum::actingAs($user);
        return ['X-Tenant-ID' => $this->tenantA->id, 'Accept' => 'application/json'];
    }

    /**
     * Returns request headers for Tenant B.
     */
    protected function headersForTenantB(?User $user = null): array
    {
        $user ??= $this->buyerB;
        app()->instance('tenant', $this->tenantB);
        Sanctum::actingAs($user);
        return ['X-Tenant-ID' => $this->tenantB->id, 'Accept' => 'application/json'];
    }
}
