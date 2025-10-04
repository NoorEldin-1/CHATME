<?php

namespace App\Http\Controllers;

use App\Events\MessageDelete;
use App\Events\MessageSent;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function allMessages($chatID) {
        $chat = Chat::findOrFail($chatID);

        $messages = $chat->messages()->get();

        return response()->json(["messages" => $messages]);
    }

    public function sendMessage($chatID) {
        $chat = Chat::findOrFail($chatID);

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

        event(new MessageSent($message));

        return response()->json(["message" => $message]);
    }

    public function deleteMessage($chatID, $messageID) {
        $chat = Chat::findOrFail($chatID);

        $message = Message::findOrFail($messageID);

        if ($message->user_id != request()->user()->id) {
            return response()->json(["message" => "You are not authorized to delete this message"]);
        }

        $message->delete();

        $broadcastMessage = (object) [
            "chat_id" => $chatID,
            "message_id" => $messageID,
            "user_1" => $chat->user_1,
            "user_2" => $chat->user_2,
        ];

        event(new MessageDelete($broadcastMessage));

        return response()->json(["message" => "Message deleted successfully"]);
    }
}
