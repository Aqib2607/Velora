<?php

namespace Tests\Feature\Financial;

use App\Models\Tenant;
use App\Models\User;
use App\Models\IdempotencyKey;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Route;

class IdempotencyTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tenant = Tenant::create(['name' => 'Test Tenant', 'slug' => 'test-tenant', 'domain' => 'test.com']);
        $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);

        // Define a test route with the middleware
        Route::post('/test-idempotency', function () {
            return response()->json(['success' => true, 'timestamp' => now()->toIso8601String()]);
        })->middleware(['web', 'auth', 'idempotency']);
    }

    /** @test */
    public function test_it_replays_the_same_response_for_the_same_key()
    {
        $this->actingAs($this->user);
        $key = 'test-key-123';

        // First request
        $response1 = $this->postJson('/test-idempotency', [], ['Idempotency-Key' => $key]);
        $response1->assertStatus(200);
        $data1 = $response1->json();

        // Second request with same key
        $response2 = $this->postJson('/test-idempotency', [], ['Idempotency-Key' => $key]);
        $response2->assertStatus(200);
        $response2->assertHeader('X-Idempotency-Replayed', 'true');
        $data2 = $response2->json();

        // Ensure both responses are identical (same timestamp)
        $this->assertEquals($data1['timestamp'], $data2['timestamp']);
    }

    /** @test */
    public function test_it_blocks_different_payloads_using_the_same_key()
    {
        $this->actingAs($this->user);
        $key = 'conflict-key';

        // First request with payload A
        $this->postJson('/test-idempotency', ['amount' => 100], ['Idempotency-Key' => $key])
            ->assertStatus(200);

        // Second request with DIFFERENT payload B using same key
        $response = $this->postJson('/test-idempotency', ['amount' => 200], ['Idempotency-Key' => $key]);

        $response->assertStatus(409);
        $response->assertJsonPath('error', 'Idempotency Key Conflict');
    }
}
