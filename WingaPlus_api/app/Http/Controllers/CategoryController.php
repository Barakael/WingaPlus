<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Category::query();

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
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->orderBy('name')->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Determine shop_id: use provided value, user's shop_id, or owned shop
        $shopId = $request->input('shop_id');
        if (!$shopId) {
            if ($user->shop_id) {
                $shopId = $user->shop_id;
            } elseif ($user->role === 'shop_owner') {
                // Find the shop owned by this user
                $ownedShop = \App\Models\Shop::where('owner_id', $user->id)->first();
                $shopId = $ownedShop ? $ownedShop->id : null;
            }
        }

        $validator = Validator::make(array_merge($request->all(), ['shop_id' => $shopId]), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'shop_id' => 'required|exists:shops,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create($validator->validated());

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => $category]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category->update($validator->validated());

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing products'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
