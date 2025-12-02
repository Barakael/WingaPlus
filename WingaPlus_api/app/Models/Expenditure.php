<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expenditure extends Model
{
    protected $fillable = [
        'salesman_id',
        'name',
        'amount',
        'notes',
        'expenditure_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expenditure_date' => 'datetime',
    ];

    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }
}

