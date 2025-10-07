<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Target extends Model
{
    protected $fillable = [
        'salesman_id',
        'team_id',
        'shop_id',
        'name',
        'period',
        'metric',
        'target_value',
        'status',
        'bonus_amount',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
    ];

    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
