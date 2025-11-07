<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class MyShopController extends Controller
{
    /**
     * Show the shop for the authenticated shop owner (if exists)
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'shop_owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $shop = Shop::where('owner_id', $user->id)->first();
        return response()->json(['data' => $shop]);
    }

    /**
     * Create a shop for the authenticated shop owner (only if none exists)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'shop_owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Ensure user has no shop yet
        $existing = Shop::where('owner_id', $user->id)->first();
        if ($existing) {
            return response()->json(['message' => 'Shop already exists'], 409);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['owner_id'] = $user->id;
        $validated['status'] = 'active';

        $shop = Shop::create($validated);

        return response()->json([
            'message' => 'Shop created successfully',
            'data' => $shop,
        ], 201);
    }
}
