<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatDelete implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastChat;

    public function __construct($broadcastChat)
    {
        $this->broadcastChat = $broadcastChat;
    }

    
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat-delete.' . $this->broadcastChat->user_1),
            new PrivateChannel('chat-delete.' . $this->broadcastChat->user_2),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'chat' => $this->broadcastChat->id,
        ];
    }
}
