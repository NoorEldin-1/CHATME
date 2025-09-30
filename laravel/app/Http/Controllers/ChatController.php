<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function allChats() {
        $currentUser = request()->user();

        $chats = Chat::where("user_1" , $currentUser->id)
                    ->orWhere("user_2", $currentUser->id)
                    ->with(["user1", "user2"])
                    ->latest("id")
                    ->get()
                    ->map(function ($chat) use ($currentUser) {
                        $otherUser = $chat->user_1 == $currentUser->id ? $chat->user2 : $chat->user1;

                        if ($otherUser->image) {
                            $otherUser->image = Storage::url($otherUser->image);
                        }

                        return [
                            "id" => $chat->id,
                            "other_user" => $otherUser,
                            "created_at" => $chat->created_at,
                            "updated_at" => $chat->updated_at,
                        ];
                    });

        return response()->json(["chats" => $chats]);
    }
}
