<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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

        if ($user->image) {
            $user->image = Storage::url($user->image);
        }

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

        if ($user->image) {
            $user->image = Storage::url($user->image);
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }


    public function logout () {
        request()->user()->currentAccessToken()->delete();
        return response()->json(['message'=> 'Logged out successfully.'], 200);
    }

    public function update() {
    $validator = Validator::make(request()->all(), [
        'fullName' => 'sometimes|string|min:4|max:255', // Add 'sometimes'
        'password' => 'sometimes|string|min:8|max:255|confirmed', // Add 'sometimes'
    ]);
    
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()]);
    }

    $user = request()->user();
    $data = [];

    // Check if any fields are provided
    if (!request()->has('fullName') && !request()->has("password")) {
        return response()->json(['message' => 'No fields to update']);
    }

    if (request()->has('fullName')) {
        $data["fullName"] = request('fullName');
    }

    if (request()->has('password')) {
        $data["password"] = Hash::make(request('password')); // Hash the password
    }

    $user->update($data);

    
    return response()->json([
        "message" => "User updated successfully",
        "user" => $user
    ]);
}
    public function uploadProfileImage() {
    $validator = Validator::make(request()->all(), [
        "image" => "required|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,tif,ico,heic,heif,avif|max:2048"
    ]);

    if ($validator->fails()) {
        return response()->json(["errors" => $validator->errors()], 422);
    }

    $user = request()->user();

    if (request()->hasFile("image")) {
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }
        
        $file = request()->file("image");
        $imagePath = $file->store("profileImages", "public");
        $user->image = $imagePath;
        $user->save();

        $user->image = Storage::url($user->image);
        
        return response()->json([
            "message" => "Profile image uploaded successfully",
            "user" => $user
        ]);
    }

    return response()->json(["message" => "No image provided"], 400);
}
}
