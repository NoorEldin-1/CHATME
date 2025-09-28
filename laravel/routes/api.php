<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/", function () {
    return response()->json(["message" => "API is working"]);
});

Route::post("/auth/signup", [AuthController::class, "signup"]);
Route::post("/auth/login", [AuthController::class, "login"]);
Route::post("/auth/logout", [AuthController::class, "logout"])->middleware("auth:sanctum");
Route::put("/auth/update", [AuthController::class, "update"])->middleware("auth:sanctum");
Route::post("/auth/uploadProfileImage", [AuthController::class, "uploadProfileImage"])->middleware("auth:sanctum");

Route::get("/users/search/{username}", [UserController::class,"search"])->middleware("auth:sanctum");