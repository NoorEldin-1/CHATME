<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatCreate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chat;

    public function __construct($chat)
    {
        $this->chat = $chat->load("user1", "user2");
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat-create.' . $this->chat->user1->id),
            new PrivateChannel('chat-create.' . $this->chat->user2->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'chat' => $this->chat
        ];
    }
}
