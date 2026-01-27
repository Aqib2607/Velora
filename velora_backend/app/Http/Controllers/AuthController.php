<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
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
            'role' => $request->role,
        ]);

        event(new Registered($user));

        // Send Welcome Email
        try {
            \Illuminate\Support\Facades\Mail::to($user)->send(new \App\Mail\WelcomeEmail($user));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send welcome email: '.$e->getMessage());
        }

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

        // Check for 2FA
        if ($user->hasEnabledTwoFactorAuthentication()) {
            return response()->json([
                'two_factor' => true,
                'user_id' => $user->id, // Send ID so frontend can pass it back to verify code
            ]);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success('Login successful', [
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function loginWith2fa(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required',
        ]);

        $user = User::find($request->user_id);

        $google2fa = new \PragmaRX\Google2FA\Google2FA;
        $secret = decrypt($user->two_factor_secret);

        if (! $google2fa->verifyKey($secret, $request->code)) {
            // Check recovery codes
            $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
            if (in_array($request->code, $recoveryCodes)) {
                // Remove used code
                $user->forceFill([
                    'two_factor_recovery_codes' => encrypt(json_encode(array_values(array_diff($recoveryCodes, [$request->code])))),
                ])->save();
            } else {
                throw ValidationException::withMessages([
                    'code' => ['The provided two-factor authentication code was invalid.'],
                ]);
            }
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
            'email' => 'required|email|unique:users,email,'.$request->user()->id,
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

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return $this->success('Password updated successfully');
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $user = $request->user();

        if (! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password does not match your current password.'],
            ]);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Soft delete user
        $user->delete();

        return $this->success('Account deleted successfully');
    }
}
