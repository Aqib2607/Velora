<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseController
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success('Registration successful', [
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (! $user->is_active) {
            return $this->error('Your account is inactive. Please contact support.', 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success('Login successful', [
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success('Logged out successfully');
    }

    public function me(Request $request)
    {
        return $this->success('User profile retrieved successfully', new \App\Http\Resources\UserResource($request->user()));
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
        ]);

        $request->user()->update($request->only('name', 'email', 'phone', 'bio'));

        return $this->success('Profile updated successfully', $request->user());
    }

    public function updateAvatar(Request $request, \App\Services\ImageService $imageService)
    {
        $request->validate([
            'avatar' => 'required|image|max:5120', // Increased max size since we optimize
        ]);

        // Use ImageService to resize and optimize
        $url = $imageService->optimizeAndSave(
            $request->file('avatar'),
            'avatars',
            400, 
            400
        );

        $request->user()->update(['avatar_url' => $url]);

        return $this->success('Avatar updated successfully', ['avatar_url' => $url]);
    }
}
