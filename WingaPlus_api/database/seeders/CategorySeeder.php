<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n=== Creating Default Categories ===\n";

        // Get all shops
        $shops = DB::table('shops')->get();
        
        // Default categories that every shop should have
        $defaultCategories = [
            [
                'name' => 'Phones',
                'description' => 'Mobile phones and smartphones'
            ],
            [
                'name' => 'Laptops',
                'description' => 'Laptops and notebook computers'
            ],
            [
                'name' => 'Accessories',
                'description' => 'Phone and laptop accessories'
            ],
        ];

        // Create default categories for each shop
        foreach ($shops as $shop) {
            foreach ($defaultCategories as $category) {
                // Check if category already exists for this shop
                $exists = DB::table('categories')
                    ->where('shop_id', $shop->id)
                    ->where('name', $category['name'])
                    ->exists();

                if (!$exists) {
                    DB::table('categories')->insert([
                        'name' => $category['name'],
                        'description' => $category['description'],
                        'shop_id' => $shop->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    
                    echo "✓ Created category '{$category['name']}' for shop '{$shop->name}'\n";
                }
            }
        }

        echo "✓ Default categories seeding completed\n\n";
    }
}
