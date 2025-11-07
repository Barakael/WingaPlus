<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'shop_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the shop that the user belongs to (for shop_owner and storekeeper roles).
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Get the shops owned by this user (for shop_owner role).
     */
    public function ownedShops()
    {
        return $this->hasMany(Shop::class, 'owner_id');
    }

    /**
     * Get the sales made by this user (for salesman role).
     */
    public function sales()
    {
        return $this->hasMany(Sale::class, 'salesman_id');
    }

    /**
     * Get the targets for this user (for salesman role).
     */
    public function targets()
    {
        return $this->hasMany(Target::class, 'salesman_id');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    /**
     * Check if user is a shop owner.
     */
    public function isShopOwner(): bool
    {
        return $this->hasRole('shop_owner');
    }

    /**
     * Check if user is a storekeeper.
     */
    public function isStorekeeper(): bool
    {
        return $this->hasRole('storekeeper');
    }

    /**
     * Check if user is a salesman.
     */
    public function isSalesman(): bool
    {
        return $this->hasRole('salesman');
    }

    /**
     * Check if user can manage a specific shop.
     */
    public function canManageShop(int $shopId): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->isShopOwner()) {
            return $this->ownedShops()->where('id', $shopId)->exists();
        }

        if ($this->isStorekeeper()) {
            return $this->shop_id === $shopId;
        }

        return false;
    }

    /**
     * Check if user can manage users.
     */
    public function canManageUsers(): bool
    {
        return $this->isSuperAdmin();
    }

    /**
     * Check if user can manage a specific user.
     */
    public function canManageUser(User $user): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->isShopOwner() && in_array($user->role, ['storekeeper', 'salesman'])) {
            // Shop owners can manage storekeepers and salesmen in their shops
            return $user->shop_id === null || $this->canManageShop($user->shop_id);
        }

        return false;
    }

    /**
     * Get users that this user can manage.
     */
    public function manageableUsers()
    {
        if ($this->isSuperAdmin()) {
            return User::all();
        }

        if ($this->isShopOwner()) {
            $shopIds = $this->ownedShops()->pluck('id');
            return User::whereIn('shop_id', $shopIds)
                      ->orWhere('role', 'salesman')
                      ->orWhere('id', $this->id)
                      ->get();
        }

        return collect([$this]);
    }
}
