<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function signup () {
        $validator = Validator::make(request()->all(), [
            'fullName' => 'required|string|min:4|max:255',
            'username' => 'required|string|min:4|max:255|unique:users,username',
            'password' => 'required|string|min:8|max:255|confirmed',
            'password_confirmation' => 'required|string|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()]);
        }

        $user = User::create([
            'fullName' => request('fullName'),
            'username' => request('username'),
            'password' => request('password'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function login () {
        $validator = Validator::make(request()->all(), [
            'username' => 'required|string|min:4|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()]);
        }

        $user = User::where('username', request('username'))->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials']);
        } 
        if (!Hash::check(request('password'), $user->password)) {
            return response()->json(['message' => 'Invalid credentials']);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }


    public function logout () {
        request()->user()->currentAccessToken()->delete();
        return response()->json(['message'=> 'Logged out successfully.'], 200);
    }
}
