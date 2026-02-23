<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Sku;
use Tests\VeloraTestCase;

class TenantIsolationTest extends VeloraTestCase
{
    public function test_tenant_a_user_cannot_see_tenant_b_data(): void
    {
        // Product belongs to Tenant A — seeded
        $productA = Product::where('tenant_id', $this->tenantA->id)->first();
        $this->assertNotNull($productA);

        // While scoped to Tenant B, the product should be invisible
        app()->instance('tenant', $this->tenantB);

        $visibleToB = Product::find($productA->id);

        $this->assertNull($visibleToB, 'Tenant B should not be able to see Tenant A products via global scope.');
    }

    public function test_api_returns_404_for_cross_tenant_product_fetch(): void
    {
        $productA = Product::where('tenant_id', $this->tenantA->id)->first();

        // Act as Tenant B user trying to access Tenant A's product via the API
        $headers = $this->headersForTenantB($this->buyerB);

        $response = $this->getJson("/api/v1/catalog/products/{$productA->id}", $headers);

        // Should be 404 (not found under Tenant B scope) — not 403 to avoid disclosure
        $response->assertStatus(404);
    }

    public function test_api_returns_only_current_tenant_products(): void
    {
        // Ensure the API only returns products scoped to the requesting tenant
        $headers = $this->headersForTenantA();

        $response = $this->getJson('/api/v1/catalog/products', $headers);
        $response->assertOk();

        $data = $response->json('data.data');

        foreach ($data as $product) {
            $this->assertEquals(
                $this->tenantA->id,
                $product['tenant_id'],
                'Response included product from a different tenant!'
            );
        }
    }

    public function test_tenant_global_scope_auto_applies_on_create(): void
    {
        app()->instance('tenant', $this->tenantA);

        $sku = Sku::where('tenant_id', $this->tenantA->id)->first();

        $product = Product::create([
            'seller_profile_id' => \App\Models\SellerProfile::where('tenant_id', $this->tenantA->id)->first()->id,
            'name'              => 'Auto-scoped Product',
            'slug'              => 'auto-scoped-product',
            'status'            => 'draft',
        ]);

        $this->assertEquals($this->tenantA->id, $product->tenant_id, 'HasTenantScope should auto-inject tenant_id on create.');
    }

    public function test_users_are_scoped_to_their_own_tenant(): void
    {
        app()->instance('tenant', $this->tenantA);
        $usersA = \App\Models\User::get();
        foreach ($usersA as $user) {
            $this->assertEquals($this->tenantA->id, $user->tenant_id);
        }

        app()->instance('tenant', $this->tenantB);
        $usersB = \App\Models\User::get();
        foreach ($usersB as $user) {
            $this->assertEquals($this->tenantB->id, $user->tenant_id);
        }
    }
}
