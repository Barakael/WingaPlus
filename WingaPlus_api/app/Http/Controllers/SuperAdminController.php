<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Sale;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        // Check if user is super_admin
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $totalShops = Shop::count();
        $totalSalesmen = User::where('role', 'salesman')->count();
        $totalStorekeepers = User::where('role', 'storekeeper')->count();
        $totalUsers = User::count();
        
        // Top performing products by sales count
        $topProducts = Sale::select('product_name', DB::raw('COUNT(*) as sales_count'), DB::raw('SUM(quantity) as total_quantity'))
            ->whereNotNull('product_name')
            ->groupBy('product_name')
            ->orderBy('sales_count', 'DESC')
            ->limit(5)
            ->get();

        // Recent shops
        $recentShops = Shop::with('owner')
            ->orderBy('created_at', 'DESC')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_shops' => $totalShops,
                'total_salesmen' => $totalSalesmen,
                'total_storekeepers' => $totalStorekeepers,
                'total_users' => $totalUsers,
            ],
            'top_products' => $topProducts,
            'recent_shops' => $recentShops,
        ]);
    }

    /**
     * Get all shops
     */
    public function getShops(Request $request)
    {
        $query = Shop::with('owner');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $shops = $query->orderBy('created_at', 'DESC')->get();

        return response()->json(['data' => $shops]);
    }

    /**
     * Create a new shop
     */
    public function createShop(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'owner_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:active,inactive,suspended',
            'description' => 'nullable|string',
        ]);

        $shop = Shop::create($validated);

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'create',
            'Shop',
            $shop->id,
            "Created shop: {$shop->name}"
        );

        return response()->json([
            'message' => 'Shop created successfully',
            'data' => $shop->load('owner')
        ], 201);
    }

    /**
     * Update a shop
     */
    public function updateShop(Request $request, $id)
    {
        $shop = Shop::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'owner_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:active,inactive,suspended',
            'description' => 'nullable|string',
        ]);

        $oldData = $shop->toArray();
        $shop->update($validated);

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'update',
            'Shop',
            $shop->id,
            "Updated shop: {$shop->name}",
            ['old' => $oldData, 'new' => $shop->fresh()->toArray()]
        );

        return response()->json([
            'message' => 'Shop updated successfully',
            'data' => $shop->load('owner')
        ]);
    }

    /**
     * Delete a shop
     */
    public function deleteShop($id)
    {
        $shop = Shop::findOrFail($id);
        $shopName = $shop->name;
        
        $shop->delete();

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'delete',
            'Shop',
            $id,
            "Deleted shop: {$shopName}"
        );

        return response()->json([
            'message' => 'Shop deleted successfully'
        ]);
    }

    /**
     * Get all users
     */
    public function getUsers(Request $request)
    {
        $query = User::with('shop');

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by shop
        if ($request->has('shop_id')) {
            $query->where('shop_id', $request->shop_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'DESC')->get();

        return response()->json(['data' => $users]);
    }

    /**
     * Update user
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:50',
            'role' => 'sometimes|in:super_admin,shop_owner,salesman,storekeeper',
            'status' => 'sometimes|in:active,inactive',
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        $oldData = $user->toArray();
        $user->update($validated);

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'update',
            'User',
            $user->id,
            "Updated user: {$user->name}",
            ['old' => $oldData, 'new' => $user->fresh()->toArray()]
        );

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user->load('shop')
        ]);
    }

    /**
     * Reset a user's password as super admin.
     *
     * This allows a privileged admin to set a new password for a user who has
     * forgotten theirs, without requiring the current password.
     */
    public function resetUserPassword(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        // Optionally, you could log this in ActivityLog later

        return response()->json([
            'message' => 'Password reset successfully',
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        $userName = $user->name;
        $user->delete();

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'delete',
            'User',
            $id,
            "Deleted user: {$userName}"
        );

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get system reports
     */
    public function getReports(Request $request)
    {
        // Sales by shop
        $salesByShop = Sale::select('shop_id', DB::raw('COUNT(*) as total_sales'), DB::raw('SUM(total_amount) as total_revenue'))
            ->groupBy('shop_id')
            ->with('shop')
            ->get();

        // Sales by salesman
        $salesBySalesman = Sale::select('salesman_id', DB::raw('COUNT(*) as total_sales'), DB::raw('SUM(total_amount) as total_revenue'))
            ->whereNotNull('salesman_id')
            ->groupBy('salesman_id')
            ->with('salesman')
            ->orderBy('total_sales', 'DESC')
            ->limit(10)
            ->get();

        // Recent activity logs
        $recentActivity = ActivityLog::with('user')
            ->orderBy('created_at', 'DESC')
            ->limit(20)
            ->get();

        return response()->json([
            'sales_by_shop' => $salesByShop,
            'sales_by_salesman' => $salesBySalesman,
            'recent_activity' => $recentActivity,
        ]);
    }
}
