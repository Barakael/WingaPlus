<?php

namespace Database\Seeders;

use App\Models\PhoneModel;
use App\Models\PhoneVariant;
use App\Models\PhoneColor;
use Illuminate\Database\Seeder;

class PhoneModelsSeeder extends Seeder
{
    public function run(): void
    {
        $phones = $this->getPhoneData();

        foreach ($phones as $phoneData) {
            $model = PhoneModel::create([
                'brand' => $phoneData['brand'],
                'generation' => $phoneData['generation'],
                'model' => $phoneData['model'],
                'display_name' => $phoneData['display_name'],
                'release_year' => $phoneData['release_year'],
            ]);

            foreach ($phoneData['variants'] as $variantData) {
                $variant = PhoneVariant::create([
                    'phone_model_id' => $model->id,
                    'storage' => $variantData['storage'],
                ]);

                foreach ($variantData['colors'] as $color) {
                    PhoneColor::create([
                        'phone_variant_id' => $variant->id,
                        'color' => $color,
                    ]);
                }
            }
        }
    }

    private function getPhoneData(): array
    {
        return [
            // iPhone X
            [
                'brand' => 'Apple',
                'generation' => 'iPhone X',
                'model' => 'X',
                'display_name' => 'iPhone X',
                'release_year' => 2017,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Space Gray', 'Silver'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Gray', 'Silver'],
                    ],
                ],
            ],
            
            // iPhone XS
            [
                'brand' => 'Apple',
                'generation' => 'iPhone XS',
                'model' => 'XS',
                'display_name' => 'iPhone XS',
                'release_year' => 2018,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone XS',
                'model' => 'XS Max',
                'display_name' => 'iPhone XS Max',
                'release_year' => 2018,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold'],
                    ],
                ],
            ],
            
            // iPhone XR
            [
                'brand' => 'Apple',
                'generation' => 'iPhone XR',
                'model' => 'XR',
                'display_name' => 'iPhone XR',
                'release_year' => 2018,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Black', 'White', 'Blue', 'Yellow', 'Coral', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Blue', 'Yellow', 'Coral', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Blue', 'Yellow', 'Coral', '(PRODUCT)RED'],
                    ],
                ],
            ],
            
            // iPhone 11
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 11',
                'model' => '11',
                'display_name' => 'iPhone 11',
                'release_year' => 2019,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Black', 'White', 'Green', 'Yellow', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Green', 'Yellow', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Green', 'Yellow', 'Purple', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 11',
                'model' => '11 Pro',
                'display_name' => 'iPhone 11 Pro',
                'release_year' => 2019,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 11',
                'model' => '11 Pro Max',
                'display_name' => 'iPhone 11 Pro Max',
                'release_year' => 2019,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
                    ],
                ],
            ],
            
            // iPhone 12
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 12',
                'model' => '12',
                'display_name' => 'iPhone 12',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 12',
                'model' => '12 mini',
                'display_name' => 'iPhone 12 mini',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Blue', 'Green', 'Purple', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 12',
                'model' => '12 Pro',
                'display_name' => 'iPhone 12 Pro',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 12',
                'model' => '12 Pro Max',
                'display_name' => 'iPhone 12 Pro Max',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
                    ],
                ],
            ],
            
            // iPhone 13
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 13',
                'model' => '13',
                'display_name' => 'iPhone 13',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 13',
                'model' => '13 mini',
                'display_name' => 'iPhone 13 mini',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Pink', 'Green', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 13',
                'model' => '13 Pro',
                'display_name' => 'iPhone 13 Pro',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 13',
                'model' => '13 Pro Max',
                'display_name' => 'iPhone 13 Pro Max',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Graphite', 'Silver', 'Gold', 'Sierra Blue', 'Alpine Green'],
                    ],
                ],
            ],
            
            // iPhone 14
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 14',
                'model' => '14',
                'display_name' => 'iPhone 14',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 14',
                'model' => '14 Plus',
                'display_name' => 'iPhone 14 Plus',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Midnight', 'Starlight', 'Blue', 'Purple', 'Yellow', '(PRODUCT)RED'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 14',
                'model' => '14 Pro',
                'display_name' => 'iPhone 14 Pro',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 14',
                'model' => '14 Pro Max',
                'display_name' => 'iPhone 14 Pro Max',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
                    ],
                ],
            ],
            
            // iPhone 15
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 15',
                'model' => '15',
                'display_name' => 'iPhone 15',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 15',
                'model' => '15 Plus',
                'display_name' => 'iPhone 15 Plus',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 15',
                'model' => '15 Pro',
                'display_name' => 'iPhone 15 Pro',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 15',
                'model' => '15 Pro Max',
                'display_name' => 'iPhone 15 Pro Max',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                ],
            ],
            
            // iPhone 16
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 16',
                'model' => '16',
                'display_name' => 'iPhone 16',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 16',
                'model' => '16 Plus',
                'display_name' => 'iPhone 16 Plus',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 16',
                'model' => '16 Pro',
                'display_name' => 'iPhone 16 Pro',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 16',
                'model' => '16 Pro Max',
                'display_name' => 'iPhone 16 Pro Max',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
                    ],
                ],
            ],
            
            // iPhone 17
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 17',
                'model' => '17',
                'display_name' => 'iPhone 17',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '2TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 17',
                'model' => '17 Air',
                'display_name' => 'iPhone 17 Air',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '2TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                ],
            ],
            [
                'brand' => 'Apple',
                'generation' => 'iPhone 17',
                'model' => '17 Pro',
                'display_name' => 'iPhone 17 Pro',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                    [
                        'storage' => '2TB',
                        'colors' => ['Cosmic Orange', 'Deep Blue', 'Silver'],
                    ],
                ],
            ],

            // Samsung Galaxy S20 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S20',
                'model' => 'S20',
                'display_name' => 'Galaxy S20',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Gray', 'Cosmic Black', 'Cloud Blue', 'Cloud Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S20',
                'model' => 'S20+',
                'display_name' => 'Galaxy S20+',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Gray', 'Cosmic Black', 'Cloud Blue', 'Cloud Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S20',
                'model' => 'S20 Ultra',
                'display_name' => 'Galaxy S20 Ultra',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Cosmic Gray', 'Cosmic Black'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Cosmic Gray', 'Cosmic Black'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Cosmic Gray', 'Cosmic Black'],
                    ],
                ],
            ],

            // Samsung Galaxy S21 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S21',
                'model' => 'S21',
                'display_name' => 'Galaxy S21',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Gray', 'Phantom White', 'Phantom Violet', 'Phantom Pink'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Gray', 'Phantom White', 'Phantom Violet', 'Phantom Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S21',
                'model' => 'S21+',
                'display_name' => 'Galaxy S21+',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Gray', 'Phantom White', 'Phantom Violet', 'Phantom Pink'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Gray', 'Phantom White', 'Phantom Violet', 'Phantom Pink'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S21',
                'model' => 'S21 Ultra',
                'display_name' => 'Galaxy S21 Ultra',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Black', 'Phantom Silver', 'Phantom Titanium', 'Phantom Navy', 'Phantom Brown'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Phantom Silver', 'Phantom Titanium', 'Phantom Navy', 'Phantom Brown'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Phantom Black', 'Phantom Silver', 'Phantom Titanium', 'Phantom Navy', 'Phantom Brown'],
                    ],
                ],
            ],

            // Samsung Galaxy S22 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S22',
                'model' => 'S22',
                'display_name' => 'Galaxy S22',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Black', 'Phantom White', 'Green', 'Pink Gold', 'Bora Purple'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Phantom White', 'Green', 'Pink Gold', 'Bora Purple'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S22',
                'model' => 'S22+',
                'display_name' => 'Galaxy S22+',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Black', 'Phantom White', 'Green', 'Pink Gold', 'Bora Purple'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Phantom White', 'Green', 'Pink Gold', 'Bora Purple'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S22',
                'model' => 'S22 Ultra',
                'display_name' => 'Galaxy S22 Ultra',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Burgundy', 'Phantom Black', 'Green', 'Phantom White'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Burgundy', 'Phantom Black', 'Green', 'Phantom White'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Burgundy', 'Phantom Black', 'Green', 'Phantom White'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Burgundy', 'Phantom Black', 'Green', 'Phantom White'],
                    ],
                ],
            ],

            // Samsung Galaxy S23 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S23',
                'model' => 'S23',
                'display_name' => 'Galaxy S23',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S23',
                'model' => 'S23+',
                'display_name' => 'Galaxy S23+',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S23',
                'model' => 'S23 Ultra',
                'display_name' => 'Galaxy S23 Ultra',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender', 'Lime', 'Sky Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender', 'Lime', 'Sky Blue'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Phantom Black', 'Cream', 'Green', 'Lavender', 'Lime', 'Sky Blue'],
                    ],
                ],
            ],

            // Samsung Galaxy S24 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S24',
                'model' => 'S24',
                'display_name' => 'Galaxy S24',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S24',
                'model' => 'S24+',
                'display_name' => 'Galaxy S24+',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S24',
                'model' => 'S24 Ultra',
                'display_name' => 'Galaxy S24 Ultra',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow', 'Titanium Blue', 'Titanium Green'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow', 'Titanium Blue', 'Titanium Green'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow', 'Titanium Blue', 'Titanium Green'],
                    ],
                ],
            ],

            // Samsung Galaxy S25 Series
            [
                'brand' => 'Samsung',
                'generation' => 'S25',
                'model' => 'S25',
                'display_name' => 'Galaxy S25',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S25',
                'model' => 'S25+',
                'display_name' => 'Galaxy S25+',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                ],
            ],
            [
                'brand' => 'Samsung',
                'generation' => 'S25',
                'model' => 'S25 Ultra',
                'display_name' => 'Galaxy S25 Ultra',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Titanium Silver', 'Titanium Black', 'Sparkling Blue'],
                    ],
                ],
            ],

            // Google Pixel 4
            [
                'brand' => 'Google',
                'generation' => 'Pixel 4',
                'model' => 'Pixel 4',
                'display_name' => 'Google Pixel 4',
                'release_year' => 2019,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Just Black', 'Clearly White', 'Oh So Orange'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Just Black', 'Clearly White', 'Oh So Orange'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 4',
                'model' => 'Pixel 4 XL',
                'display_name' => 'Google Pixel 4 XL',
                'release_year' => 2019,
                'variants' => [
                    [
                        'storage' => '64GB',
                        'colors' => ['Just Black', 'Clearly White', 'Oh So Orange'],
                    ],
                    [
                        'storage' => '128GB',
                        'colors' => ['Just Black', 'Clearly White', 'Oh So Orange'],
                    ],
                ],
            ],

            // Google Pixel 5
            [
                'brand' => 'Google',
                'generation' => 'Pixel 5',
                'model' => 'Pixel 5',
                'display_name' => 'Google Pixel 5',
                'release_year' => 2020,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Just Black', 'Sorta Sage'],
                    ],
                ],
            ],

            // Google Pixel 6
            [
                'brand' => 'Google',
                'generation' => 'Pixel 6',
                'model' => 'Pixel 6',
                'display_name' => 'Google Pixel 6',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Stormy Black', 'Kinda Coral', 'Sorta Seafoam'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Stormy Black', 'Kinda Coral', 'Sorta Seafoam'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 6',
                'model' => 'Pixel 6 Pro',
                'display_name' => 'Google Pixel 6 Pro',
                'release_year' => 2021,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Stormy Black', 'Cloudy White', 'Sorta Sunny'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Stormy Black', 'Cloudy White', 'Sorta Sunny'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Stormy Black', 'Cloudy White', 'Sorta Sunny'],
                    ],
                ],
            ],

            // Google Pixel 7
            [
                'brand' => 'Google',
                'generation' => 'Pixel 7',
                'model' => 'Pixel 7',
                'display_name' => 'Google Pixel 7',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Snow', 'Lemongrass'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Snow', 'Lemongrass'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 7',
                'model' => 'Pixel 7 Pro',
                'display_name' => 'Google Pixel 7 Pro',
                'release_year' => 2022,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Snow', 'Hazel'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Snow', 'Hazel'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Obsidian', 'Snow', 'Hazel'],
                    ],
                ],
            ],

            // Google Pixel 8
            [
                'brand' => 'Google',
                'generation' => 'Pixel 8',
                'model' => 'Pixel 8',
                'display_name' => 'Google Pixel 8',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Rose', 'Hazel', 'Mint'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Rose', 'Hazel', 'Mint'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 8',
                'model' => 'Pixel 8 Pro',
                'display_name' => 'Google Pixel 8 Pro',
                'release_year' => 2023,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Bay', 'Mint'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Bay', 'Mint'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Bay', 'Mint'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Obsidian', 'Porcelain', 'Bay', 'Mint'],
                    ],
                ],
            ],

            // Google Pixel 9
            [
                'brand' => 'Google',
                'generation' => 'Pixel 9',
                'model' => 'Pixel 9',
                'display_name' => 'Google Pixel 9',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 9',
                'model' => 'Pixel 9 Pro',
                'display_name' => 'Google Pixel 9 Pro',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 9',
                'model' => 'Pixel 9 Pro XL',
                'display_name' => 'Google Pixel 9 Pro XL',
                'release_year' => 2024,
                'variants' => [
                    [
                        'storage' => '128GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '256GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
                    ],
                ],
            ],

            // Google Pixel 10
            [
                'brand' => 'Google',
                'generation' => 'Pixel 10',
                'model' => 'Pixel 10',
                'display_name' => 'Google Pixel 10',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 10',
                'model' => 'Pixel 10 Pro',
                'display_name' => 'Google Pixel 10 Pro',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                ],
            ],
            [
                'brand' => 'Google',
                'generation' => 'Pixel 10',
                'model' => 'Pixel Fold',
                'display_name' => 'Google Pixel Fold',
                'release_year' => 2025,
                'variants' => [
                    [
                        'storage' => '256GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '512GB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                    [
                        'storage' => '1TB',
                        'colors' => ['Moonstone', 'Jade', 'Indigo', 'Frost'],
                    ],
                ],
            ],
        ];
    }
}
