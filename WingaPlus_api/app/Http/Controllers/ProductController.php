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
}
