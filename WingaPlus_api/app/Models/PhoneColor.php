<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PhoneColor extends Model
{
    protected $fillable = [
        'phone_variant_id',
        'color',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(PhoneVariant::class, 'phone_variant_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'phone_color_id');
    }

    public function getFullSpecificationAttribute()
    {
        $variant = $this->variant;
        $model = $variant->phoneModel;
        return "{$model->display_name} {$variant->storage} {$this->color}";
    }
}
