<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LaptopModel extends Model
{
    protected $fillable = [
        'brand',
        'series',
        'model',
        'display_name',
        'processor_type',
        'release_year',
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(LaptopVariant::class);
    }
}
