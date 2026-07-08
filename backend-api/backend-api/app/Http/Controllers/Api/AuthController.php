<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login
     * Validates credentials and returns a JWT access token + user payload.
     * Matches the shape expected by AuthContext.jsx: { access_token, user }.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = Auth::guard('api')->attempt($credentials)) {
                return response()->json([
                    'message' => 'Incorrect email or password.',
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Could not create token.',
            ], 500);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => new UserResource(Auth::guard('api')->user()),
        ]);
    }

    /**
     * GET /api/auth/me
     * Returns the currently authenticated user, resolved from the JWT.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    /**
     * POST /api/auth/logout
     * Invalidates the current JWT so it can no longer be used.
     */
    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }

    /**
     * POST /api/auth/refresh
     * Issues a new token from a still-valid (not-yet-expired) one.
     */
    public function refresh(): JsonResponse
    {
        return response()->json([
            'access_token' => Auth::guard('api')->refresh(),
            'token_type' => 'bearer',
        ]);
    }
}
