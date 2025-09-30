<?php

namespace App\Http\Controllers;

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
                        ->get()->map(function ($user) {
                            if ($user->image) {
                                $user->image = Storage::url($user->image);
                            }
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

        Notification::create([
            "from" => $currentUser->id,
            "to" => $user->id,
        ]);

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

        Chat::create([
            "user_1" => $currentUser->id,
            "user_2" => $notification->from
        ]);

        $notification->delete();

        return response()->json(["message" => "friend added successfully"]);
    }
}
