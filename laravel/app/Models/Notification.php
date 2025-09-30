<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ["from", "to"];

    public function fromUser() {
        return $this->belongsTo(User::class, 'from');
    }

    public function toUser() {
        return $this->belongsTo(User::class, 'to');
    }
}
