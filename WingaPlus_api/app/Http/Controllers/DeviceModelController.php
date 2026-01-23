<?php

namespace App\Http\Controllers;

use App\Models\PhoneModel;
use App\Models\PhoneVariant;
use App\Models\PhoneColor;
use App\Models\LaptopModel;
use App\Models\LaptopVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeviceModelController extends Controller
{
    /**
     * Search for phone or laptop models with fuzzy matching
     * Supports queries like: "pixel 10 256 moonstone", "iphone 15 pro 512", "macbook air m3"
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $deviceType = $request->input('type', 'all'); // phone, laptop, or all
        $limit = $request->input('limit', 20);

        $results = [
            'phones' => [],
            'laptops' => [],
        ];

        if ($deviceType === 'phone' || $deviceType === 'all') {
            $results['phones'] = $this->searchPhones($query, $limit);
        }

        if ($deviceType === 'laptop' || $deviceType === 'all') {
            $results['laptops'] = $this->searchLaptops($query, $limit);
        }

        return response()->json($results);
    }

    /**
     * Get all storage variants for a phone model
     */
    public function getPhoneVariants($phoneModelId)
    {
        $variants = PhoneVariant::where('phone_model_id', $phoneModelId)
            ->orderByRaw("CAST(REPLACE(storage, 'GB', '') AS UNSIGNED)")
            ->get();

        return response()->json($variants);
    }

    /**
     * Get all colors for a phone variant
     */
    public function getPhoneColors($variantId)
    {
        $colors = PhoneColor::where('phone_variant_id', $variantId)
            ->orderBy('color')
            ->get();

        return response()->json($colors);
    }

    /**
     * Get all RAM/storage variants for a laptop model
     */
    public function getLaptopVariants($laptopModelId)
    {
        $variants = LaptopVariant::where('laptop_model_id', $laptopModelId)
            ->orderByRaw("CAST(REPLACE(ram, 'GB', '') AS UNSIGNED)")
            ->get();

        return response()->json($variants);
    }

    /**
     * Get full specification details for a phone color
     */
    public function getPhoneSpecification($phoneColorId)
    {
        $phoneColor = PhoneColor::with(['variant.phoneModel'])->find($phoneColorId);

        if (!$phoneColor) {
            return response()->json(['error' => 'Phone specification not found'], 404);
        }

        return response()->json([
            'id' => $phoneColor->id,
            'full_specification' => $phoneColor->full_specification,
            'model' => $phoneColor->variant->phoneModel->display_name,
            'storage' => $phoneColor->variant->storage,
            'color' => $phoneColor->color,
            'brand' => $phoneColor->variant->phoneModel->brand,
            'generation' => $phoneColor->variant->phoneModel->generation,
        ]);
    }

    /**
     * Get full specification details for a laptop variant
     */
    public function getLaptopSpecification($laptopVariantId)
    {
        $laptopVariant = LaptopVariant::with('laptopModel')->find($laptopVariantId);

        if (!$laptopVariant) {
            return response()->json(['error' => 'Laptop specification not found'], 404);
        }

        return response()->json([
            'id' => $laptopVariant->id,
            'full_specification' => $laptopVariant->full_specification,
            'model' => $laptopVariant->laptopModel->display_name,
            'ram' => $laptopVariant->ram,
            'storage' => $laptopVariant->storage,
            'color' => $laptopVariant->color,
            'brand' => $laptopVariant->laptopModel->brand,
            'series' => $laptopVariant->laptopModel->series,
            'processor_type' => $laptopVariant->laptopModel->processor_type,
        ]);
    }

    /**
     * Smart search to find exact phone variant match
     * Example: "pixel 10 256 moonstone" -> exact PhoneColor match
     */
    public function smartSearch(Request $request)
    {
        $query = strtolower($request->input('q', ''));
        $deviceType = $request->input('type', 'phone');

        if ($deviceType === 'phone') {
            $result = $this->findPhoneMatch($query);
            if ($result) {
                return response()->json([
                    'type' => 'phone',
                    'match' => $result,
                ]);
            }
        } elseif ($deviceType === 'laptop') {
            $result = $this->findLaptopMatch($query);
            if ($result) {
                return response()->json([
                    'type' => 'laptop',
                    'match' => $result,
                ]);
            }
        }

        return response()->json(['match' => null], 404);
    }

    // ==================== Private Helper Methods ====================

    private function searchPhones($query, $limit)
    {
        $query = strtolower(trim($query));

        $phones = PhoneModel::where(function ($q) use ($query) {
            $q->whereRaw('LOWER(brand) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(generation) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(model) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(display_name) LIKE ?', ["%{$query}%"]);
        })
        ->with(['variants.colors'])
        ->limit($limit)
        ->get()
        ->map(function ($phone) {
            return [
                'id' => $phone->id,
                'brand' => $phone->brand,
                'generation' => $phone->generation,
                'model' => $phone->model,
                'display_name' => $phone->display_name,
                'release_year' => $phone->release_year,
                'variant_count' => $phone->variants->count(),
                'color_count' => $phone->variants->sum(function ($variant) {
                    return $variant->colors->count();
                }),
            ];
        });

        return $phones;
    }

    private function searchLaptops($query, $limit)
    {
        $query = strtolower(trim($query));

        $laptops = LaptopModel::where(function ($q) use ($query) {
            $q->whereRaw('LOWER(brand) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(series) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(model) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(display_name) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(processor_type) LIKE ?', ["%{$query}%"]);
        })
        ->with('variants')
        ->limit($limit)
        ->get()
        ->map(function ($laptop) {
            return [
                'id' => $laptop->id,
                'brand' => $laptop->brand,
                'series' => $laptop->series,
                'model' => $laptop->model,
                'display_name' => $laptop->display_name,
                'processor_type' => $laptop->processor_type,
                'release_year' => $laptop->release_year,
                'variant_count' => $laptop->variants->count(),
            ];
        });

        return $laptops;
    }

    private function findPhoneMatch($query)
    {
        // Try to extract: brand, model, storage, color from query
        // Example: "pixel 10 256 moonstone" or "iphone 15 pro 512 black"
        
        $phoneColors = PhoneColor::with(['variant.phoneModel'])
            ->get()
            ->filter(function ($phoneColor) use ($query) {
                $fullSpec = strtolower($phoneColor->full_specification);
                $model = strtolower($phoneColor->variant->phoneModel->display_name);
                $storage = strtolower($phoneColor->variant->storage);
                $color = strtolower($phoneColor->color);
                
                // Check if query contains all key components
                $modelMatch = strpos($query, str_replace(' ', '', strtolower($phoneColor->variant->phoneModel->model))) !== false
                    || strpos($query, strtolower($phoneColor->variant->phoneModel->generation)) !== false;
                    
                $storageNum = preg_replace('/[^0-9]/', '', $storage);
                $storageMatch = strpos($query, $storageNum) !== false;
                
                $colorMatch = strpos($query, strtolower($phoneColor->color)) !== false
                    || strpos($query, str_replace(' ', '', strtolower($phoneColor->color))) !== false;
                
                return $modelMatch && $storageMatch && $colorMatch;
            })
            ->first();

        if ($phoneColors) {
            return [
                'phone_color_id' => $phoneColors->id,
                'specification' => $phoneColors->full_specification,
                'model_id' => $phoneColors->variant->phoneModel->id,
                'variant_id' => $phoneColors->variant->id,
            ];
        }

        return null;
    }

    private function findLaptopMatch($query)
    {
        // Try to extract: brand, model, ram, storage from query
        // Example: "macbook air m3 16gb 512" or "dell xps 13 32gb 1tb"
        
        $laptopVariants = LaptopVariant::with('laptopModel')
            ->get()
            ->filter(function ($variant) use ($query) {
                $model = strtolower($variant->laptopModel->display_name);
                $ram = strtolower($variant->ram);
                $storage = strtolower($variant->storage);
                
                // Check if query contains model name
                $modelParts = explode(' ', $model);
                $modelMatch = true;
                foreach ($modelParts as $part) {
                    if (strlen($part) > 2 && strpos($query, strtolower($part)) === false) {
                        $modelMatch = false;
                        break;
                    }
                }
                
                // Check RAM
                $ramNum = preg_replace('/[^0-9]/', '', $ram);
                $ramMatch = strpos($query, $ramNum . 'gb') !== false || strpos($query, $ramNum . ' gb') !== false;
                
                // Check storage
                $storageNum = preg_replace('/[^0-9]/', '', $storage);
                $storageMatch = strpos($query, $storageNum . 'gb') !== false 
                    || strpos($query, $storageNum . 'tb') !== false
                    || strpos($query, $storageNum . ' gb') !== false 
                    || strpos($query, $storageNum . ' tb') !== false;
                
                return $modelMatch && $ramMatch && $storageMatch;
            })
            ->first();

        if ($laptopVariants) {
            return [
                'laptop_variant_id' => $laptopVariants->id,
                'specification' => $laptopVariants->full_specification,
                'model_id' => $laptopVariants->laptopModel->id,
            ];
        }

        return null;
    }
}
