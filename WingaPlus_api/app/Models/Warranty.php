<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Warranty extends Model
{
    protected $fillable = [
        'phone_name',
        'customer_name',
        'customer_email',
        'customer_phone',
        'store_name',
        'color',
        'storage',
        'price',
        'imei_number',
        'warranty_period',
        'status',
    ];

    protected $appends = ['calculated_status'];

    /**
     * Get the calculated status based on warranty period
     */
    public function getCalculatedStatusAttribute()
    {
        $createdDate = Carbon::parse($this->created_at);
        $expiryDate = $createdDate->addMonths($this->warranty_period);
        $now = Carbon::now();

        return $now->isBefore($expiryDate) ? 'active' : 'expired';
    }

    /**
     * Get the expiry date
     */
    public function getExpiryDateAttribute()
    {
        return Carbon::parse($this->created_at)->addMonths($this->warranty_period);
    }
}
