<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n=== Creating Products ===\n";

        $products = [
            // Shop 1 Products (Dar es Salaam)
            [
                'name' => 'iPhone 15 Pro',
                'sku' => 'IPH15P-128',
                'category' => 'Smartphones',
                'price' => 3500000,
                'cost_price' => 3200000,
                'stock' => 15,
                'min_stock' => 5,
                'shop_id' => 1,
                'description' => 'Latest iPhone 15 Pro 128GB',
                'status' => 'active',
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'sku' => 'SAM-S24-256',
                'category' => 'Smartphones',
                'price' => 2800000,
                'cost_price' => 2500000,
                'stock' => 20,
                'min_stock' => 5,
                'shop_id' => 1,
                'description' => 'Samsung Galaxy S24 256GB',
                'status' => 'active',
            ],
            [
                'name' => 'Tecno Spark 10 Pro',
                'sku' => 'TEC-SP10P',
                'category' => 'Smartphones',
                'price' => 450000,
                'cost_price' => 380000,
                'stock' => 50,
                'min_stock' => 10,
                'shop_id' => 1,
                'description' => 'Tecno Spark 10 Pro budget smartphone',
                'status' => 'active',
            ],
            [
                'name' => 'Infinix Hot 30',
                'sku' => 'INF-HOT30',
                'category' => 'Smartphones',
                'price' => 380000,
                'cost_price' => 320000,
                'stock' => 45,
                'min_stock' => 10,
                'shop_id' => 1,
                'description' => 'Infinix Hot 30 affordable smartphone',
                'status' => 'active',
            ],
            [
                'name' => 'Xiaomi Redmi Note 13',
                'sku' => 'XIA-RN13',
                'category' => 'Smartphones',
                'price' => 650000,
                'cost_price' => 550000,
                'stock' => 30,
                'min_stock' => 8,
                'shop_id' => 1,
                'description' => 'Xiaomi Redmi Note 13 Pro',
                'status' => 'active',
            ],
            [
                'name' => 'JBL Flip 6',
                'sku' => 'JBL-FLIP6',
                'category' => 'Accessories',
                'price' => 180000,
                'cost_price' => 150000,
                'stock' => 25,
                'min_stock' => 5,
                'shop_id' => 1,
                'description' => 'JBL Flip 6 Bluetooth Speaker',
                'status' => 'active',
            ],
            [
                'name' => 'Samsung Earbuds Pro',
                'sku' => 'SAM-EBP',
                'category' => 'Accessories',
                'price' => 250000,
                'cost_price' => 200000,
                'stock' => 18,
                'min_stock' => 5,
                'shop_id' => 1,
                'description' => 'Samsung Galaxy Buds Pro',
                'status' => 'active',
            ],
            [
                'name' => 'Phone Case Universal',
                'sku' => 'CASE-UNI',
                'category' => 'Accessories',
                'price' => 15000,
                'cost_price' => 8000,
                'stock' => 100,
                'min_stock' => 20,
                'shop_id' => 1,
                'description' => 'Universal silicone phone case',
                'status' => 'active',
            ],

            // Shop 2 Products (Arusha)
            [
                'name' => 'iPhone 14',
                'sku' => 'IPH14-128',
                'category' => 'Smartphones',
                'price' => 2800000,
                'cost_price' => 2500000,
                'stock' => 10,
                'min_stock' => 3,
                'shop_id' => 2,
                'description' => 'iPhone 14 128GB',
                'status' => 'active',
            ],
            [
                'name' => 'Samsung Galaxy A54',
                'sku' => 'SAM-A54',
                'category' => 'Smartphones',
                'price' => 1200000,
                'cost_price' => 1000000,
                'stock' => 25,
                'min_stock' => 5,
                'shop_id' => 2,
                'description' => 'Samsung Galaxy A54 5G',
                'status' => 'active',
            ],
            [
                'name' => 'Tecno Camon 20',
                'sku' => 'TEC-CAM20',
                'category' => 'Smartphones',
                'price' => 550000,
                'cost_price' => 470000,
                'stock' => 35,
                'min_stock' => 8,
                'shop_id' => 2,
                'description' => 'Tecno Camon 20 Pro',
                'status' => 'active',
            ],
            [
                'name' => 'Screen Protector',
                'sku' => 'SCPROT-UNI',
                'category' => 'Accessories',
                'price' => 10000,
                'cost_price' => 5000,
                'stock' => 150,
                'min_stock' => 30,
                'shop_id' => 2,
                'description' => 'Tempered glass screen protector',
                'status' => 'active',
            ],
            [
                'name' => 'Fast Charger 33W',
                'sku' => 'CHRG-33W',
                'category' => 'Accessories',
                'price' => 35000,
                'cost_price' => 25000,
                'stock' => 40,
                'min_stock' => 10,
                'shop_id' => 2,
                'description' => '33W Fast Charger USB-C',
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        echo "✓ Created " . count($products) . " products\n";
        echo "=== Products Created Successfully ===\n\n";
    }
}
