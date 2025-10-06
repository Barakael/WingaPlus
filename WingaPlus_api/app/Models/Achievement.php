<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Achievement extends Model
{
    protected $fillable = [
        'salesman_id',
        'type',
        'title',
        'description',
        'badge_icon',
        'points',
        'unlocked_at',
        'metadata',
    ];

    protected $casts = [
        'points' => 'integer',
        'unlocked_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }
}
