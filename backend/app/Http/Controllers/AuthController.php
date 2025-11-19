<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Handle an incoming authentication request (Login).
     */
    public function login(Request $request)
    {
        // Validate the incoming request fields
        $request->validate([
            'username' => 'required|string',
            'accessKey' => 'required|string',
        ]);

        // Find user by username
        $user = User::where('username', $request->username)->first();

        // Check if user exists and password matches
        if (!$user || !Hash::check($request->accessKey, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Invalid credentials'],
            ]);
        }

        // Create a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user data and the token
        return response()->json([
            'user' => [
                'id' => (string) $user->id,
                'username' => $user->username,
                'name' => $user->name,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Get the authenticated user (Session Check).
     */
    public function checkSession(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(null, 401);
        }

        return response()->json([
            'id' => (string) $user->id,
            'username' => $user->username,
            'name' => $user->name,
        ]);
    }

    /**
     * Log the user out (Logout).
     */
    public function logout(Request $request)
    {
        // Delete the current token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
