<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Modules\Identity\AuthService;
use Illuminate\Validation\ValidationException;
use Tests\VeloraTestCase;

class AuthTest extends VeloraTestCase
{
    public function test_user_can_register_under_a_tenant(): void
    {
        $service = app(AuthService::class);

        $result = $service->register([
            'name'     => 'New User',
            'email'    => 'newuser@alpha.test',
            'password' => 'Password123!',
        ], $this->tenantA);

        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertEquals($this->tenantA->id, $result['user']->tenant_id);

        $this->assertDatabaseHas('users', [
            'email'     => 'newuser@alpha.test',
            'tenant_id' => $this->tenantA->id,
        ]);
    }

    public function test_user_can_login_and_receives_token(): void
    {
        $service = app(AuthService::class);

        $result = $service->login([
            'email'    => 'buyer@alpha.test',
            'password' => 'password',
        ], $this->tenantA);

        $this->assertNotEmpty($result['token']);
        $this->assertEquals($this->buyerA->id, $result['user']->id);
    }

    public function test_wrong_password_throws_validation_exception(): void
    {
        $this->expectException(ValidationException::class);

        $service = app(AuthService::class);
        $service->login([
            'email'    => 'buyer@alpha.test',
            'password' => 'wrong_password',
        ], $this->tenantA);
    }

    public function test_cross_tenant_login_is_rejected(): void
    {
        // Buyer A's credentials tried against Tenant B's scope
        $this->expectException(ValidationException::class);

        $service = app(AuthService::class);
        $service->login([
            'email'    => 'buyer@alpha.test',
            'password' => 'password',
        ], $this->tenantB); // ← wrong tenant
    }

    public function test_api_register_endpoint_returns_token_and_201(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name'                  => 'API Reg User',
            'email'                 => 'apireg@alpha.test',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ], ['X-Tenant-ID' => $this->tenantA->id, 'Accept' => 'application/json']);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'data' => ['user', 'token'],
            ]);
    }

    public function test_api_login_endpoint_returns_token(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => 'buyer@alpha.test',
            'password' => 'password',
        ], ['X-Tenant-ID' => $this->tenantA->id, 'Accept' => 'application/json']);

        $response->assertOk()->assertJsonStructure([
            'status',
            'data' => ['user', 'token'],
        ]);
    }
}
