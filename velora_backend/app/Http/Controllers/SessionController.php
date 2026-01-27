<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SessionController extends BaseController
{
    public function index(Request $request)
    {
        $tokens = $request->user()->tokens->map(function ($token) use ($request) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_current' => $token->id === $request->user()->currentAccessToken()->id,
                // Detecting device info from token name or capabilities is tricky if not stored.
                // Assuming token name holds device info or user agent isn't stored by default Sanctum.
                // We'll just show what we have.
            ];
        });

        return $this->success('Sessions retrieved successfully', $tokens);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        // Find token belonging to user
        $token = $user->tokens()->where('id', $id)->first();

        if (! $token) {
            return $this->error('Session not found', 404);
        }

        $token->delete();

        return $this->success('Session revoked successfully');
    }

    public function destroyOtherSessions(Request $request)
    {
        $currentId = $request->user()->currentAccessToken()->id;

        $request->user()->tokens()->where('id', '!=', $currentId)->delete();

        return $this->success('All other sessions revoked successfully');
    }
}
