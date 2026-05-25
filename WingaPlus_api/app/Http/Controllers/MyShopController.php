<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            'logo' => 'nullable|file|extensions:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $extension = strtolower($logo->getClientOriginalExtension() ?: 'png');
            $filename = (string) Str::uuid() . '.' . $extension;
            $validated['logo_path'] = $logo->storeAs('shop-logos', $filename, 'public');
        }

        $validated['owner_id'] = $user->id;
        $validated['status'] = 'active';

        $shop = Shop::create($validated);

        return response()->json([
            'message' => 'Shop created successfully',
            'data' => $shop,
        ], 201);
    }

    /**
     * Update the authenticated shop owner's shop details.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'shop_owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $shop = Shop::where('owner_id', $user->id)->first();
        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|file|extensions:jpg,jpeg,png,webp|max:4096',
            'remove_logo' => 'nullable|boolean',
        ]);

        if (($validated['remove_logo'] ?? false) && $shop->logo_path) {
            Storage::disk('public')->delete($shop->logo_path);
            $validated['logo_path'] = null;
        }

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            if ($shop->logo_path) {
                Storage::disk('public')->delete($shop->logo_path);
            }
            $extension = strtolower($logo->getClientOriginalExtension() ?: 'png');
            $filename = (string) Str::uuid() . '.' . $extension;
            $validated['logo_path'] = $logo->storeAs('shop-logos', $filename, 'public');
        }

        unset($validated['logo'], $validated['remove_logo']);
        $shop->update($validated);

        return response()->json([
            'message' => 'Shop updated successfully',
            'data' => $shop->fresh(),
        ]);
    }
}
