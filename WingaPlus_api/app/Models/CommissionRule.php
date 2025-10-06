<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommissionRule extends Model
{
    protected $fillable = [
        'shop_id',
        'name',
        'type',
        'base_rate',
        'tiers',
        'is_active',
    ];

    protected $casts = [
        'tiers' => 'array', 
        'base_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
