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
        echo "\n=== Creating Users ===\n";

        // Super Admin
        User::firstOrCreate(
            ['email' => 'admin@wingaplus.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'phone' => '+255 700 000 000',
                'shop_id' => null,
            ]
        );
        echo "✓ Super Admin: admin@wingaplus.com / password\n";

        // Shop Owners
        $owner1 = User::firstOrCreate(
            ['email' => 'john@wingaelectronics.co.tz'],
            [
                'name' => 'John Mwamba',
                'password' => Hash::make('password'),
                'role' => 'shop_owner',
                'phone' => '+255 712 111 111',
                'shop_id' => 1,
            ]
        );

        $owner2 = User::firstOrCreate(
            ['email' => 'grace@wingaelectronics.co.tz'],
            [
                'name' => 'Grace Moshi',
                'password' => Hash::make('password'),
                'role' => 'shop_owner',
                'phone' => '+255 713 222 222',
                'shop_id' => 2,
            ]
        );
        echo "✓ Shop Owners: john@, grace@wingaelectronics.co.tz / password\n";

        // Salesmen for Shop 1 (Dar es Salaam)
        User::firstOrCreate(
            ['email' => 'james@wingaelectronics.co.tz'],
            [
                'name' => 'James Kikwete',
                'password' => Hash::make('password'),
                'role' => 'salesman',
                'phone' => '+255 712 333 333',
                'shop_id' => 1,
            ]
        );

        User::firstOrCreate(
            ['email' => 'mary@wingaelectronics.co.tz'],
            [
                'name' => 'Mary Nyerere',
                'password' => Hash::make('password'),
                'role' => 'salesman',
                'phone' => '+255 712 444 444',
                'shop_id' => 1,
            ]
        );

        User::firstOrCreate(
            ['email' => 'david@wingaelectronics.co.tz'],
            [
                'name' => 'David Mwinyi',
                'password' => Hash::make('password'),
                'role' => 'salesman',
                'phone' => '+255 712 555 555',
                'shop_id' => 1,
            ]
        );

        // Salesmen for Shop 2 (Arusha)
        User::firstOrCreate(
            ['email' => 'sarah@wingaelectronics.co.tz'],
            [
                'name' => 'Sarah Kilimanjaro',
                'password' => Hash::make('password'),
                'role' => 'salesman',
                'phone' => '+255 713 666 666',
                'shop_id' => 2,
            ]
        );

        User::firstOrCreate(
            ['email' => 'peter@wingaelectronics.co.tz'],
            [
                'name' => 'Peter Meru',
                'password' => Hash::make('password'),
                'role' => 'salesman',
                'phone' => '+255 713 777 777',
                'shop_id' => 2,
            ]
        );
        echo "✓ Salesmen: james@, mary@, david@, sarah@, peter@wingaelectronics.co.tz / password\n";

        // Storekeeper
        User::firstOrCreate(
            ['email' => 'anna@wingaelectronics.co.tz'],
            [
                'name' => 'Anna Mgeni',
                'password' => Hash::make('password'),
                'role' => 'storekeeper',
                'phone' => '+255 712 888 888',
                'shop_id' => 1,
            ]
        );
        echo "✓ Storekeeper: anna@wingaelectronics.co.tz / password\n";
        echo "=== Users Created Successfully ===\n\n";
    }
}
