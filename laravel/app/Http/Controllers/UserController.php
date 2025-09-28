<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\PseudoTypes\LowercaseString;

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
}
