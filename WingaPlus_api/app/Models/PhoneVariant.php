<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PhoneVariant extends Model
{
    protected $fillable = [
        'phone_model_id',
        'storage',
    ];

    public function phoneModel(): BelongsTo
    {
        return $this->belongsTo(PhoneModel::class);
    }

    public function colors(): HasMany
    {
        return $this->hasMany(PhoneColor::class);
    }
}
