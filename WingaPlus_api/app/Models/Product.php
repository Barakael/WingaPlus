<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'sku',
        'category',
        'category_id',
        'price',
        'cost_price',
        'stock',
        'min_stock',
        'shop_id',
        'description',
        'image_url',
        'status',
        'source',
        'imei',
        'ram',
        'color',
        'storage',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Check if product is low on stock
    public function isLowStock(): bool
    {
        return $this->stock <= $this->min_stock;
    }

    // Calculate profit margin
    public function getProfitMargin(): float
    {
        if ($this->price <= 0) return 0;
        return (($this->price - $this->cost_price) / $this->price) * 100;
    }
}
