<?php

use App\Models\Chat;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('notification.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-create.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-delete.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{id}', function ($user, $id) {
    $chat = Chat::findOrFail($id);
    return $user->id == $chat->user_1 || $user->id == $chat->user_2;
});

Broadcast::channel('message-delete.{id}', function ($user, $id) {
    $chat = Chat::findOrFail($id);
    return $user->id == $chat->user_1 || $user->id == $chat->user_2;
});
