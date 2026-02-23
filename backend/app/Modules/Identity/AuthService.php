<?php

namespace App\Modules\Identity;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register a new user under the current tenant.
     */
    public function register(array $data, Tenant $tenant): array
    {
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone'] ?? null,
            'password'  => Hash::make($data['password']),
            'status'    => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Authenticate a user.
     *
     * @throws ValidationException
     */
    public function login(array $credentials, Tenant $tenant): array
    {
        $user = User::where('email', $credentials['email'])
            ->where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke old tokens
        $user->tokens()->each(fn($t) => $t->delete());

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Logout the current user.
     */
    public function logout(User $user): void
    {
        $user->deleteCurrentAccessToken();
    }
}
