<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Shop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        User::firstOrCreate(
            ['email' => 'admin@wingaplus.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
            ]
        );

        // Create a shop for testing
        $shop = Shop::firstOrCreate(
            ['name' => 'Test Shop'],
            [
                'location' => '123 Test Street',
            ]
        );

        // Create Shop Owner
        $shopOwner = User::firstOrCreate(
            ['email' => 'owner@wingaplus.com'],
            [
                'name' => 'Shop Owner',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'shop_id' => $shop->id,
            ]
        );

        // Create Storekeeper
        User::firstOrCreate(
            ['email' => 'storekeeper@wingaplus.com'],
            [
                'name' => 'Store Keeper',
                'password' => Hash::make('password123'),
                'role' => 'storekeeper',
                'shop_id' => $shop->id,
            ]
        );

        // Create Salesman (independent of shop)
        User::firstOrCreate(
            ['email' => 'salesman@wingaplus.com'],
            [
                'name' => 'Test Salesman',
                'password' => Hash::make('password123'),
                'role' => 'salesman',
            ]
        );
    }
}
