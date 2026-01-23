<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PhoneModel extends Model
{
    protected $fillable = [
        'brand',
        'generation',
        'model',
        'display_name',
        'release_year',
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(PhoneVariant::class);
    }

    public function getAllColors()
    {
        return PhoneColor::whereHas('variant', function ($query) {
            $query->where('phone_model_id', $this->id);
        })->get();
    }
}
