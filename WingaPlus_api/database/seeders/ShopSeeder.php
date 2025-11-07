<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = [
            [
                'name' => 'Winga Electronics - Dar es Salaam',
                'location' => 'Kariakoo',
                'address' => 'Kariakoo Market, Dar es Salaam',
                'phone' => '+255 712 345 678',
                'email' => 'dar@wingaelectronics.co.tz',
                'status' => 'active',
                'description' => 'Main branch in Dar es Salaam specializing in smartphones and electronics',
                'owner_id' => null, // Will be updated after users are created
            ],
            [
                'name' => 'Winga Electronics - Arusha',
                'location' => 'Arusha Central',
                'address' => 'Clock Tower, Arusha',
                'phone' => '+255 713 456 789',
                'email' => 'arusha@wingaelectronics.co.tz',
                'status' => 'active',
                'description' => 'Arusha branch serving northern Tanzania',
                'owner_id' => null,
            ],
            [
                'name' => 'Winga Electronics - Mwanza',
                'location' => 'Mwanza City',
                'address' => 'Kenyatta Road, Mwanza',
                'phone' => '+255 714 567 890',
                'email' => 'mwanza@wingaelectronics.co.tz',
                'status' => 'active',
                'description' => 'Lakeside branch in Mwanza',
                'owner_id' => null,
            ],
            [
                'name' => 'Winga Mobile - Dodoma',
                'location' => 'Dodoma Capital',
                'address' => 'Nyerere Square, Dodoma',
                'phone' => '+255 715 678 901',
                'email' => 'dodoma@wingamobile.co.tz',
                'status' => 'active',
                'description' => 'Capital city mobile phone shop',
                'owner_id' => null,
            ],
            [
                'name' => 'Winga Tech - Mbeya',
                'location' => 'Mbeya Town',
                'address' => 'Iyunga Street, Mbeya',
                'phone' => '+255 716 789 012',
                'email' => 'mbeya@wingatech.co.tz',
                'status' => 'inactive',
                'description' => 'Southern highlands tech shop - Currently under renovation',
                'owner_id' => null,
            ],
        ];

        echo "\n=== Creating Shops ===\n";
        foreach ($shops as $shop) {
            Shop::create($shop);
        }
        echo "✓ Created " . count($shops) . " shops\n";
        echo "=== Shops Created Successfully ===\n\n";
    }
}
