<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n╔══════════════════════════════════════╗\n";
        echo "║   WingaPro Database Seeding        ║\n";
        echo "╚══════════════════════════════════════╝\n";

        $this->call([
            ShopSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
        ]);

        echo "╔══════════════════════════════════════╗\n";
        echo "║   Seeding Completed Successfully!    ║\n";
        echo "╚══════════════════════════════════════╝\n\n";
    }
}
