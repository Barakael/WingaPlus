<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'product_id',
        'product_name',
        'warranty_id', // newly added foreign key
        // unified warranty fields stored on sales table
        'has_warranty',
        'warranty_start',
        'warranty_end',
        'warranty_status',
        'warranty_details',
        // service fields
        'is_service',
        'service_status',
        'service_details',
        'salesman_id',
        'customer_name',
        'customer_phone',
        'quantity',
        'unit_price',
        'selling_price',
        'cost_price',
        'offers',
        'total_amount',
        'ganji',
        'warranty_months',
        'sale_date',
        'reference_store',
        'category',
        'phone_name',
        'imei',
        'color',
        'storage',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'offers' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'ganji' => 'decimal:2',
        'warranty_months' => 'integer',
        'has_warranty' => 'boolean',
        'warranty_start' => 'datetime',
        'warranty_end' => 'datetime',
        'warranty_details' => 'array',
        'is_service' => 'boolean',
        'service_details' => 'array',
        'sale_date' => 'datetime',
    ];

    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }

    public function commissions(): HasMany
    {
        return $this->hasMany(Commission::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function warranty(): BelongsTo
    {
        return $this->belongsTo(Warranty::class);
    }
}
