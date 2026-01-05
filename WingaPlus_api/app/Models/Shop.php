<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    protected $fillable = [
        'name',
        'location',
        'address',
        'phone',
        'email',
        'owner_id',
        'status',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['effective_email'];

    /**
     * Boot the model and add event listeners
     */
    protected static function boot()
    {
        parent::boot();

        // When a new shop is created, automatically create default categories
        static::created(function ($shop) {
            $defaultCategories = [
                ['name' => 'Phones', 'description' => 'Mobile phones and smartphones'],
                ['name' => 'Laptops', 'description' => 'Laptops and notebook computers'],
                ['name' => 'Accessories', 'description' => 'Phone and laptop accessories'],
            ];

            foreach ($defaultCategories as $category) {
                Category::create([
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'shop_id' => $shop->id,
                ]);
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the effective email (shop email or owner's email)
     */
    public function getEffectiveEmailAttribute(): ?string
    {
        return $this->email ?: $this->owner?->email;
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function commissionRules(): HasMany
    {
        return $this->hasMany(CommissionRule::class);
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
}
