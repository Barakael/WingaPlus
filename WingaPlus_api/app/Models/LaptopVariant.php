<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LaptopVariant extends Model
{
    protected $fillable = [
        'laptop_model_id',
        'ram',
        'storage',
        'color',
    ];

    public function laptopModel(): BelongsTo
    {
        return $this->belongsTo(LaptopModel::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'laptop_variant_id');
    }

    public function getFullSpecificationAttribute()
    {
        $model = $this->laptopModel;
        $colorPart = $this->color ? " {$this->color}" : '';
        return "{$model->display_name} {$this->ram} RAM {$this->storage}{$colorPart}";
    }
}
