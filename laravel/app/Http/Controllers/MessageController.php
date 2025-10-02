<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function allMessages($chatID) {
        $chat = Chat::find($chatID);

        if (!$chat) {
            return response()->json(["message" => "Chat not found"]);
        }

        $messages = $chat->messages()->get();

        return response()->json(["messages" => $messages]);
    }

    public function sendMessage($chatID) {
        $chat = Chat::find($chatID);

        if (!$chat) {
            return response()->json(["message" => "Chat not found"]);
        }

        $validator = Validator::make(request()->all(), [
            "content" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json(["message" => $validator->errors()]);
        }

        $message = Message::create([
            "chat_id" => $chatID,
            "user_id" => request()->user()->id,
            "content" => request()->content,
        ]);

        return response()->json(["message" => $message]);
    }

    public function deleteMessage($chatID, $messageID) {
        $chat = Chat::find($chatID);

        if (!$chat) {
            return response()->json(["message" => "Chat not found"]);
        }

        $message = Message::find($messageID);

        if (!$message) {
            return response()->json(["message" => "Message not found"]);
        }

        if ($message->user_id != request()->user()->id) {
            return response()->json(["message" => "You are not authorized to delete this message"]);
        }

        $message->delete();

        return response()->json(["message" => "Message deleted successfully"]);
    }
}
