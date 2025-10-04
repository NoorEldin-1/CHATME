<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDelete implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastMessage;

    public function __construct($broadcastMessage)
    {
        $this->broadcastMessage = $broadcastMessage;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('message-delete.' . $this->broadcastMessage->chat_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            "message_id" => $this->broadcastMessage->message_id,
        ];
    }
}
