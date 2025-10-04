<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Route::get("/", function () {
    return response()->json(["message" => "API is working"]);
});

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::post("/auth/signup", [AuthController::class, "signup"]);
Route::post("/auth/login", [AuthController::class, "login"]);
Route::post("/auth/logout", [AuthController::class, "logout"])->middleware("auth:sanctum");
Route::put("/auth/update", [AuthController::class, "update"])->middleware("auth:sanctum");
Route::post("/auth/uploadProfileImage", [AuthController::class, "uploadProfileImage"])->middleware("auth:sanctum");

Route::get("/users/search/{username}", [UserController::class,"search"])->middleware("auth:sanctum");
Route::post("/users/add/friend/{userID}", [UserController::class,"addFriend"])->middleware("auth:sanctum");
Route::get("/users/notifications", [UserController::class,"notifications"])->middleware("auth:sanctum");
Route::get("/users/remove/notifications/{id}", [UserController::class,"removeNotification"])->middleware("auth:sanctum");
Route::get("/users/accept/notifications/{id}", [UserController::class,"acceptNotification"])->middleware("auth:sanctum");

Route::get("/chats/all", [ChatController::class,"allChats"])->middleware("auth:sanctum");
Route::delete("/chats/delete/{id}", [ChatController::class,"deleteChat"])->middleware("auth:sanctum");

Route::get("/messages/{chatID}", [MessageController::class,"allMessages"])->middleware("auth:sanctum");
Route::post("/messages/send/{chatID}", [MessageController::class,"sendMessage"])->middleware("auth:sanctum");
Route::delete("/messages/delete/{chatID}/{messageID}", [MessageController::class,"deleteMessage"])->middleware("auth:sanctum");