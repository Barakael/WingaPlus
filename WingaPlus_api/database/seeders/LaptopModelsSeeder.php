<?php

namespace Database\Seeders;

use App\Models\LaptopModel;
use App\Models\LaptopVariant;
use Illuminate\Database\Seeder;

class LaptopModelsSeeder extends Seeder
{
    public function run(): void
    {
        $laptops = $this->getLaptopData();

        foreach ($laptops as $laptopData) {
            $model = LaptopModel::create([
                'brand' => $laptopData['brand'],
                'series' => $laptopData['series'],
                'model' => $laptopData['model'],
                'display_name' => $laptopData['display_name'],
                'processor_type' => $laptopData['processor_type'] ?? null,
                'release_year' => $laptopData['release_year'],
            ]);

            foreach ($laptopData['variants'] as $variantData) {
                LaptopVariant::create([
                    'laptop_model_id' => $model->id,
                    'ram' => $variantData['ram'],
                    'storage' => $variantData['storage'],
                    'color' => $variantData['color'] ?? null,
                ]);
            }
        }
    }

    private function getLaptopData(): array
    {
        return [
            // MacBook Air (Intel - 2019-2020)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 13" (2019)',
                'display_name' => 'MacBook Air 13" (2019)',
                'processor_type' => 'Intel Core i5',
                'release_year' => 2019,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '128GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '128GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '128GB SSD', 'color' => 'Gold'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Gold'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Gold'],
                ],
            ],
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 13" (2020)',
                'display_name' => 'MacBook Air 13" (2020)',
                'processor_type' => 'Intel Core i5',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Gold'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Gold'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Gold'],
                ],
            ],

            // MacBook Air (M1 - 2020)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 13" M1 (2020)',
                'display_name' => 'MacBook Air 13" M1 (2020)',
                'processor_type' => 'Apple M1',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Gold'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Gold'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Gold'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Gold'],
                ],
            ],

            // MacBook Air (M2 - 2022)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 13" M2 (2022)',
                'display_name' => 'MacBook Air 13" M2 (2022)',
                'processor_type' => 'Apple M2',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Midnight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Starlight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Midnight'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Starlight'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Midnight'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Starlight'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Midnight'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Starlight'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Air (M3 - 2024)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 13" M3 (2024)',
                'display_name' => 'MacBook Air 13" M3 (2024)',
                'processor_type' => 'Apple M3',
                'release_year' => 2024,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Midnight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Starlight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Midnight'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Starlight'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Midnight'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Starlight'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Midnight'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Starlight'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '24GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],
            [
                'brand' => 'Apple',
                'series' => 'MacBook Air',
                'model' => 'MacBook Air 15" M3 (2024)',
                'display_name' => 'MacBook Air 15" M3 (2024)',
                'processor_type' => 'Apple M3',
                'release_year' => 2024,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Midnight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Starlight'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Midnight'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Starlight'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Midnight'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Starlight'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '24GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 13" (Intel - 2019-2020)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 13" (2019)',
                'display_name' => 'MacBook Pro 13" (2019)',
                'processor_type' => 'Intel Core i5/i7',
                'release_year' => 2019,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 13" (2020)',
                'display_name' => 'MacBook Pro 13" (2020)',
                'processor_type' => 'Intel Core i5/i7',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 13" (M1 - 2020)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 13" M1 (2020)',
                'display_name' => 'MacBook Pro 13" M1 (2020)',
                'processor_type' => 'Apple M1',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 14" (M1 Pro/Max - 2021)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 14" M1 Pro (2021)',
                'display_name' => 'MacBook Pro 14" M1 Pro (2021)',
                'processor_type' => 'Apple M1 Pro',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 14" (M2 Pro/Max - 2023)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 14" M2 Pro (2023)',
                'display_name' => 'MacBook Pro 14" M2 Pro (2023)',
                'processor_type' => 'Apple M2 Pro',
                'release_year' => 2023,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 14" (M3 Pro/Max - 2023)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 14" M3 Pro (2023)',
                'display_name' => 'MacBook Pro 14" M3 Pro (2023)',
                'processor_type' => 'Apple M3 Pro',
                'release_year' => 2023,
                'variants' => [
                    ['ram' => '18GB', 'storage' => '512GB SSD', 'color' => 'Space Black'],
                    ['ram' => '18GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '18GB', 'storage' => '1TB SSD', 'color' => 'Space Black'],
                    ['ram' => '18GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '36GB', 'storage' => '2TB SSD', 'color' => 'Space Black'],
                    ['ram' => '36GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                    ['ram' => '36GB', 'storage' => '4TB SSD', 'color' => 'Space Black'],
                    ['ram' => '36GB', 'storage' => '4TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 16" (M1 Pro/Max - 2021)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 16" M1 Pro (2021)',
                'display_name' => 'MacBook Pro 16" M1 Pro (2021)',
                'processor_type' => 'Apple M1 Pro/Max',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                    ['ram' => '64GB', 'storage' => '4TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '64GB', 'storage' => '4TB SSD', 'color' => 'Silver'],
                    ['ram' => '64GB', 'storage' => '8TB SSD', 'color' => 'Space Gray'],
                    ['ram' => '64GB', 'storage' => '8TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 16" (M3 Pro/Max - 2023)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 16" M3 Pro (2023)',
                'display_name' => 'MacBook Pro 16" M3 Pro (2023)',
                'processor_type' => 'Apple M3 Pro/Max',
                'release_year' => 2023,
                'variants' => [
                    ['ram' => '18GB', 'storage' => '512GB SSD', 'color' => 'Space Black'],
                    ['ram' => '18GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '36GB', 'storage' => '1TB SSD', 'color' => 'Space Black'],
                    ['ram' => '36GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '48GB', 'storage' => '2TB SSD', 'color' => 'Space Black'],
                    ['ram' => '48GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                    ['ram' => '128GB', 'storage' => '4TB SSD', 'color' => 'Space Black'],
                    ['ram' => '128GB', 'storage' => '4TB SSD', 'color' => 'Silver'],
                    ['ram' => '128GB', 'storage' => '8TB SSD', 'color' => 'Space Black'],
                    ['ram' => '128GB', 'storage' => '8TB SSD', 'color' => 'Silver'],
                ],
            ],

            // MacBook Pro 16" (M4 Pro/Max - 2024)
            [
                'brand' => 'Apple',
                'series' => 'MacBook Pro',
                'model' => 'MacBook Pro 16" M4 Pro (2024)',
                'display_name' => 'MacBook Pro 16" M4 Pro (2024)',
                'processor_type' => 'Apple M4 Pro/Max',
                'release_year' => 2024,
                'variants' => [
                    ['ram' => '24GB', 'storage' => '512GB SSD', 'color' => 'Space Black'],
                    ['ram' => '24GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '48GB', 'storage' => '1TB SSD', 'color' => 'Space Black'],
                    ['ram' => '48GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                    ['ram' => '64GB', 'storage' => '2TB SSD', 'color' => 'Space Black'],
                    ['ram' => '64GB', 'storage' => '2TB SSD', 'color' => 'Silver'],
                    ['ram' => '128GB', 'storage' => '4TB SSD', 'color' => 'Space Black'],
                    ['ram' => '128GB', 'storage' => '4TB SSD', 'color' => 'Silver'],
                ],
            ],

            // Dell XPS 13 (2019-2024)
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 13 9300',
                'display_name' => 'Dell XPS 13 9300 (2020)',
                'processor_type' => 'Intel Core i5/i7 10th Gen',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Frost White'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Frost White'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Frost White'],
                ],
            ],
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 13 9310',
                'display_name' => 'Dell XPS 13 9310 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Frost White'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Frost White'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Platinum Silver'],
                ],
            ],
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 13 Plus 9320',
                'display_name' => 'Dell XPS 13 Plus 9320 (2022)',
                'processor_type' => 'Intel Core i5/i7 12th Gen',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Graphite'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Graphite'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Platinum'],
                ],
            ],
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 13 9340',
                'display_name' => 'Dell XPS 13 9340 (2024)',
                'processor_type' => 'Intel Core Ultra 5/7',
                'release_year' => 2024,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Graphite'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Graphite'],
                    ['ram' => '64GB', 'storage' => '2TB SSD', 'color' => 'Platinum'],
                ],
            ],

            // Dell XPS 15
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 15 9500',
                'display_name' => 'Dell XPS 15 9500 (2020)',
                'processor_type' => 'Intel Core i5/i7/i9 10th Gen',
                'release_year' => 2020,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '64GB', 'storage' => '2TB SSD', 'color' => 'Platinum Silver'],
                ],
            ],
            [
                'brand' => 'Dell',
                'series' => 'XPS',
                'model' => 'XPS 15 9520',
                'display_name' => 'Dell XPS 15 9520 (2022)',
                'processor_type' => 'Intel Core i5/i7/i9 12th Gen',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '64GB', 'storage' => '2TB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '64GB', 'storage' => '4TB SSD', 'color' => 'Platinum Silver'],
                ],
            ],

            // Dell Inspiron 15
            [
                'brand' => 'Dell',
                'series' => 'Inspiron',
                'model' => 'Inspiron 15 5000',
                'display_name' => 'Dell Inspiron 15 5000 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Platinum Silver'],
                ],
            ],
            [
                'brand' => 'Dell',
                'series' => 'Inspiron',
                'model' => 'Inspiron 15 3000',
                'display_name' => 'Dell Inspiron 15 3000 (2022)',
                'processor_type' => 'Intel Core i3/i5',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '4GB', 'storage' => '128GB SSD', 'color' => 'Carbon Black'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Carbon Black'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Carbon Black'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Carbon Black'],
                ],
            ],

            // HP Pavilion
            [
                'brand' => 'HP',
                'series' => 'Pavilion',
                'model' => 'Pavilion 15',
                'display_name' => 'HP Pavilion 15 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Natural Silver'],
                ],
            ],
            [
                'brand' => 'HP',
                'series' => 'Pavilion',
                'model' => 'Pavilion Aero 13',
                'display_name' => 'HP Pavilion Aero 13 (2022)',
                'processor_type' => 'AMD Ryzen 5/7',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Pale Rose Gold'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Pale Rose Gold'],
                ],
            ],

            // HP Envy
            [
                'brand' => 'HP',
                'series' => 'Envy',
                'model' => 'Envy 13',
                'display_name' => 'HP Envy 13 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Natural Silver'],
                ],
            ],
            [
                'brand' => 'HP',
                'series' => 'Envy',
                'model' => 'Envy x360 15',
                'display_name' => 'HP Envy x360 15 (2022)',
                'processor_type' => 'AMD Ryzen 5/7',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Natural Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Natural Silver'],
                ],
            ],

            // HP Spectre
            [
                'brand' => 'HP',
                'series' => 'Spectre',
                'model' => 'Spectre x360 13',
                'display_name' => 'HP Spectre x360 13 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Nightfall Black'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Poseidon Blue'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Nightfall Black'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Poseidon Blue'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Nightfall Black'],
                    ['ram' => '16GB', 'storage' => '2TB SSD', 'color' => 'Nightfall Black'],
                ],
            ],
            [
                'brand' => 'HP',
                'series' => 'Spectre',
                'model' => 'Spectre x360 14',
                'display_name' => 'HP Spectre x360 14 (2023)',
                'processor_type' => 'Intel Core i5/i7 13th Gen',
                'release_year' => 2023,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Nightfall Black'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Nightfall Black'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Nightfall Black'],
                ],
            ],

            // Lenovo ThinkPad X1 Carbon
            [
                'brand' => 'Lenovo',
                'series' => 'ThinkPad',
                'model' => 'ThinkPad X1 Carbon Gen 7',
                'display_name' => 'Lenovo ThinkPad X1 Carbon Gen 7 (2019)',
                'processor_type' => 'Intel Core i5/i7 8th Gen',
                'release_year' => 2019,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Black'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Black'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Black'],
                ],
            ],
            [
                'brand' => 'Lenovo',
                'series' => 'ThinkPad',
                'model' => 'ThinkPad X1 Carbon Gen 9',
                'display_name' => 'Lenovo ThinkPad X1 Carbon Gen 9 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Black'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Black'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Black'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Black'],
                ],
            ],
            [
                'brand' => 'Lenovo',
                'series' => 'ThinkPad',
                'model' => 'ThinkPad X1 Carbon Gen 11',
                'display_name' => 'Lenovo ThinkPad X1 Carbon Gen 11 (2023)',
                'processor_type' => 'Intel Core i5/i7 13th Gen',
                'release_year' => 2023,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Black'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Black'],
                    ['ram' => '32GB', 'storage' => '2TB SSD', 'color' => 'Black'],
                ],
            ],

            // Lenovo IdeaPad
            [
                'brand' => 'Lenovo',
                'series' => 'IdeaPad',
                'model' => 'IdeaPad 5',
                'display_name' => 'Lenovo IdeaPad 5 (2022)',
                'processor_type' => 'AMD Ryzen 5/7',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Platinum Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Platinum Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Platinum Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Platinum Gray'],
                ],
            ],

            // Lenovo Yoga
            [
                'brand' => 'Lenovo',
                'series' => 'Yoga',
                'model' => 'Yoga 9i',
                'display_name' => 'Lenovo Yoga 9i (2022)',
                'processor_type' => 'Intel Core i7 12th Gen',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Storm Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Oatmeal'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Storm Gray'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Storm Gray'],
                ],
            ],

            // Lenovo Legion (Gaming)
            [
                'brand' => 'Lenovo',
                'series' => 'Legion',
                'model' => 'Legion 5 Pro',
                'display_name' => 'Lenovo Legion 5 Pro (2022)',
                'processor_type' => 'AMD Ryzen 7',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Storm Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Storm Gray'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Storm Gray'],
                ],
            ],

            // Asus ZenBook
            [
                'brand' => 'Asus',
                'series' => 'ZenBook',
                'model' => 'ZenBook 14',
                'display_name' => 'Asus ZenBook 14 (2022)',
                'processor_type' => 'Intel Core i5/i7 12th Gen',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Pine Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Pine Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Pine Gray'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Pine Gray'],
                ],
            ],

            // Asus VivoBook
            [
                'brand' => 'Asus',
                'series' => 'VivoBook',
                'model' => 'VivoBook 15',
                'display_name' => 'Asus VivoBook 15 (2021)',
                'processor_type' => 'Intel Core i3/i5',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '4GB', 'storage' => '128GB SSD', 'color' => 'Slate Gray'],
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Slate Gray'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Slate Gray'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Slate Gray'],
                ],
            ],

            // Asus ROG (Gaming)
            [
                'brand' => 'Asus',
                'series' => 'ROG',
                'model' => 'ROG Zephyrus G14',
                'display_name' => 'Asus ROG Zephyrus G14 (2022)',
                'processor_type' => 'AMD Ryzen 9',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Moonlight White'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Moonlight White'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Moonlight White'],
                ],
            ],

            // Acer Aspire
            [
                'brand' => 'Acer',
                'series' => 'Aspire',
                'model' => 'Aspire 5',
                'display_name' => 'Acer Aspire 5 (2021)',
                'processor_type' => 'Intel Core i5/i7 11th Gen',
                'release_year' => 2021,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                ],
            ],

            // Acer Swift
            [
                'brand' => 'Acer',
                'series' => 'Swift',
                'model' => 'Swift 3',
                'display_name' => 'Acer Swift 3 (2022)',
                'processor_type' => 'AMD Ryzen 5/7',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '8GB', 'storage' => '256GB SSD', 'color' => 'Silver'],
                    ['ram' => '8GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Silver'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Silver'],
                ],
            ],

            // Acer Predator (Gaming)
            [
                'brand' => 'Acer',
                'series' => 'Predator',
                'model' => 'Predator Helios 300',
                'display_name' => 'Acer Predator Helios 300 (2022)',
                'processor_type' => 'Intel Core i7 12th Gen',
                'release_year' => 2022,
                'variants' => [
                    ['ram' => '16GB', 'storage' => '512GB SSD', 'color' => 'Black'],
                    ['ram' => '16GB', 'storage' => '1TB SSD', 'color' => 'Black'],
                    ['ram' => '32GB', 'storage' => '1TB SSD', 'color' => 'Black'],
                ],
            ],
        ];
    }
}
