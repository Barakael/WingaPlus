<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the products, optionally filtered by shop_id and search.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Product::query();

        // Determine shop_id: use provided value, user's shop_id, or owned shop
        $shopId = $request->input('shop_id');
        if (!$shopId && $user) {
            if ($user->shop_id) {
                $shopId = $user->shop_id;
            } elseif ($user->role === 'shop_owner') {
                // Find the shop owned by this user
                $ownedShop = \App\Models\Shop::where('owner_id', $user->id)->first();
                $shopId = $ownedShop ? $ownedShop->id : null;
            }
        }

        if ($shopId) {
            $query->where('shop_id', $shopId);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Optional status filter
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        // Basic pagination support
        $perPage = (int) $request->get('per_page', 50);
        if ($perPage > 0) {
            $products = $query->orderByDesc('created_at')->paginate($perPage);
            return response()->json($products);
        }

        $products = $query->orderByDesc('created_at')->get();
        return response()->json(['data' => $products]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Determine shop_id: use provided value, user's shop_id, or owned shop
        $shopId = $request->input('shop_id');
        if (!$shopId && $user) {
            if ($user->shop_id) {
                $shopId = $user->shop_id;
            } elseif ($user->role === 'shop_owner') {
                // Find the shop owned by this user
                $ownedShop = \App\Models\Shop::where('owner_id', $user->id)->first();
                $shopId = $ownedShop ? $ownedShop->id : null;
            }
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:products,sku'],
            'category' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'min_stock_level' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'out_of_stock'])],
            'source' => ['nullable', 'string', 'max:255'],
            'imei' => ['nullable', 'string', 'max:255'],
            'ram' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'storage' => ['nullable', 'string', 'max:255'],
        ]);

        // Add the determined shop_id
        $validated['shop_id'] = $shopId;
        
        // Map frontend field names to database field names
        if (isset($validated['stock_quantity'])) {
            $validated['stock'] = $validated['stock_quantity'];
            unset($validated['stock_quantity']);
        }
        if (isset($validated['min_stock_level'])) {
            $validated['min_stock'] = $validated['min_stock_level'];
            unset($validated['min_stock_level']);
        }

        // Validate shop_id is set
        if (!$validated['shop_id']) {
            return response()->json([
                'message' => 'Unable to determine shop for this user',
            ], 422);
        }

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($product->id)],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'shop_id' => ['nullable', 'integer', 'exists:shops,id'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'out_of_stock'])],
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    /**
     * Bulk create products with individual IMEIs/serial numbers
     * Used for phones and laptops where each unit needs unique tracking
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Determine shop_id
        $shopId = $request->input('shop_id');
        if (!$shopId && $user) {
            if ($user->shop_id) {
                $shopId = $user->shop_id;
            } elseif ($user->role === 'shop_owner') {
                $ownedShop = \App\Models\Shop::where('owner_id', $user->id)->first();
                $shopId = $ownedShop ? $ownedShop->id : null;
            }
        }

        if (!$shopId) {
            return response()->json([
                'message' => 'Unable to determine shop for this user',
            ], 422);
        }

        $validated = $request->validate([
            'device_type' => ['required', Rule::in(['phone', 'laptop'])],
            'phone_color_id' => ['required_if:device_type,phone', 'nullable', 'integer', 'exists:phone_colors,id'],
            'laptop_variant_id' => ['required_if:device_type,laptop', 'nullable', 'integer', 'exists:laptop_variants,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'source' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'units' => ['required', 'array', 'min:1', 'max:50'],
            'units.*.imei' => ['required_if:device_type,phone', 'nullable', 'string', 'max:255', 'unique:products,imei'],
            'units.*.serial_number' => ['required_if:device_type,laptop', 'nullable', 'string', 'max:255', 'unique:products,serial_number'],
        ]);

        $results = [
            'success' => [],
            'failed' => [],
        ];

        foreach ($validated['units'] as $index => $unit) {
            try {
                $productData = [
                    'shop_id' => $shopId,
                    'device_type' => $validated['device_type'],
                    'price' => $validated['price'],
                    'cost_price' => $validated['cost_price'],
                    'source' => $validated['source'] ?? null,
                    'category_id' => $validated['category_id'],
                    'stock' => 1, // Always 1 for IMEI-tracked devices
                    'min_stock' => 1,
                    'status' => 'active',
                ];

                if ($validated['device_type'] === 'phone') {
                    $phoneColor = \App\Models\PhoneColor::with(['variant.phoneModel'])->find($validated['phone_color_id']);
                    $productData['name'] = $phoneColor->full_specification;
                    $productData['phone_color_id'] = $validated['phone_color_id'];
                    $productData['imei'] = $unit['imei'];
                    $productData['color'] = $phoneColor->color;
                    $productData['storage'] = $phoneColor->variant->storage;
                } else {
                    $laptopVariant = \App\Models\LaptopVariant::with('laptopModel')->find($validated['laptop_variant_id']);
                    $productData['name'] = $laptopVariant->full_specification;
                    $productData['laptop_variant_id'] = $validated['laptop_variant_id'];
                    $productData['serial_number'] = $unit['serial_number'];
                    $productData['ram'] = $laptopVariant->ram;
                    $productData['storage'] = $laptopVariant->storage;
                    $productData['color'] = $laptopVariant->color;
                }

                $product = Product::create($productData);
                $results['success'][] = [
                    'index' => $index,
                    'product' => $product,
                    'identifier' => $validated['device_type'] === 'phone' ? $unit['imei'] : $unit['serial_number'],
                ];
            } catch (\Exception $e) {
                $results['failed'][] = [
                    'index' => $index,
                    'identifier' => $validated['device_type'] === 'phone' ? ($unit['imei'] ?? 'N/A') : ($unit['serial_number'] ?? 'N/A'),
                    'error' => $e->getMessage(),
                ];
            }
        }

        $statusCode = empty($results['failed']) ? 201 : 207; // 207 Multi-Status

        return response()->json([
            'message' => count($results['success']) . ' products created successfully, ' . count($results['failed']) . ' failed',
            'results' => $results,
        ], $statusCode);
    }
}

