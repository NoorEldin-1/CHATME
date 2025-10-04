<?php

namespace App\Http\Controllers;

use App\Events\ChatCreate;
use App\Events\NotificationSent;
use App\Models\Chat;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function search($username) {
        $currentUser = request()->user();
        $users = User::where("username", "!=", $currentUser->username)
                        ->whereRaw('LOWER(username) LIKE ?', ['%' . strtolower($username) . '%'])
                        ->latest("id")
                        ->get()->map(function ($user) use ($currentUser) {
                            if ($user->image) {
                                $user->image = Storage::url($user->image);
                            }
                            $user->is_pending = Notification::where("from" , $currentUser->id)->where("to" , $user->id)->first() ? true : false;
                            $user->is_friend = Chat::where("user_1", $user->id)
                            ->orWhere("user_2", $user->id)
                            ->where("user_1", $currentUser->id)
                            ->orWhere("user_2", $currentUser->id)
                            ->first() ? true : false;
                            return $user;
                        });
        return response()->json(["users" => $users]);
    }

    public function addFriend($userID) {
        $currentUser = request()->user();
        $user = User::where("id" , $userID)->first();
        if (!$user) {
            return response()->json(["message" => "user not found"]);
        }

        $notification =  Notification::create([
            "from" => $currentUser->id,
            "to" => $user->id,
        ]);

        event(new NotificationSent($notification));

        return response()->json(["message" => "request send"]);
    }

    public function notifications() {
        $currentUser = request()->user();
        $notifications = Notification::where("to", $currentUser->id)->with("fromUser")->latest("id")->get();

        return response()->json(["notifications" => $notifications]);
    }

    public function removeNotification($id) {
        $currentUser = request()->user();
        $notification = Notification::where("id", $id)
                                    ->where("to" , $currentUser->id)
                                    ->first();
        if (!$notification) {
            return response()->json(["message" => "notification not found"]);
        }
        $notification->delete();

        return response()->json(["message" => "notification deleted successfully"]);
    }

    public function acceptNotification($id) {
        $currentUser = request()->user();
        $notification = Notification::where("id", $id)
                                    ->where("to", $currentUser->id)
                                    ->first();

        if (!$notification) {
            return response()->json(["message" => "notification not found"]);
        }

        $chat = Chat::create([
            "user_1" => $currentUser->id,
            "user_2" => $notification->from
        ]);

        $notification->delete();

        event(new ChatCreate($chat));

        return response()->json(["message" => "friend added successfully"]);
    }
}
