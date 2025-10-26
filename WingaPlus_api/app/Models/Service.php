<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = [
        'device_name',
        'issue',
        'customer_name',
        'store_name',
        'issue_price',
        'service_price',
        'final_price',
        'offers',
        'cost_price',
        'ganji',
        'salesman_id',
        'service_date',
    ];

    protected $casts = [
        'issue_price' => 'decimal:2',
        'service_price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'offers' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'ganji' => 'decimal:2',
    ];

    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }
}
