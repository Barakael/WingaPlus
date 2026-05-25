<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Service;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            'logo' => 'nullable|file|extensions:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $extension = strtolower($logo->getClientOriginalExtension() ?: 'png');
            $filename = (string) Str::uuid() . '.' . $extension;
            $validated['logo_path'] = $logo->storeAs('shop-logos', $filename, 'public');
        }

        $shop = Shop::create($validated);

        // Log activity
        ActivityLog::logActivity(
            auth()->id(),
            'create',
            'Shop',
            $shop->id,
            "Created shop: {$shop->name}",
            ['new' => $shop->toArray()]
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
            "Deleted shop: {$shopName}",
            ['old' => $shop->toArray()]
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
            "Deleted user: {$userName}",
            ['old' => $user->toArray()]
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
        if ($authError = $this->ensureSuperAdmin($request)) {
            return $authError;
        }

        $validated = $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;

        // Sales by shop — join through salesman (users) since sales has no shop_id column.
        $salesByShopQuery = Sale::query()
            ->selectRaw('users.shop_id, COUNT(*) as total_sales, COALESCE(SUM(sales.total_amount), 0) as total_revenue')
            ->join('users', 'sales.salesman_id', '=', 'users.id')
            ->whereNotNull('sales.salesman_id')
            ->whereNotNull('users.shop_id')
            ->groupBy('users.shop_id');
        $this->applySalesDateRange($salesByShopQuery, $dateFrom, $dateTo);
        $salesByShopRaw = $salesByShopQuery->get();

        $salesByShop = $salesByShopRaw->map(function ($row) {
            return [
                'shop_id' => $row->shop_id,
                'total_sales' => (int) $row->total_sales,
                'total_revenue' => (float) $row->total_revenue,
                'shop' => Shop::find($row->shop_id),
            ];
        });

        // Sales by salesman.
        $salesBySalesmanQuery = Sale::query()
            ->select('salesman_id', DB::raw('COUNT(*) as total_sales'), DB::raw('COALESCE(SUM(total_amount), 0) as total_revenue'))
            ->whereNotNull('salesman_id')
            ->groupBy('salesman_id')
            ->with('salesman')
            ->orderBy('total_sales', 'DESC')
            ->limit(10);
        $this->applySalesDateRange($salesBySalesmanQuery, $dateFrom, $dateTo);
        $salesBySalesman = $salesBySalesmanQuery->get()->map(function ($row) {
            return [
                'salesman_id' => $row->salesman_id,
                'total_sales' => (int) $row->total_sales,
                'total_revenue' => (float) $row->total_revenue,
                'salesman' => $row->salesman,
            ];
        });

        $joinedShopsQuery = Shop::query();
        $joinedWingasQuery = User::query()->where('role', 'salesman');
        if ($dateFrom) {
            $joinedShopsQuery->whereDate('created_at', '>=', $dateFrom);
            $joinedWingasQuery->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $joinedShopsQuery->whereDate('created_at', '<=', $dateTo);
            $joinedWingasQuery->whereDate('created_at', '<=', $dateTo);
        }

        // Active shops and wingas = anyone with at least one sale/service in selected period.
        $salesActivity = Sale::query()
            ->join('users', 'sales.salesman_id', '=', 'users.id')
            ->whereNotNull('sales.salesman_id')
            ->whereNotNull('users.shop_id');
        $this->applySalesDateRange($salesActivity, $dateFrom, $dateTo);

        $serviceActivity = Service::query()
            ->join('users', 'services.salesman_id', '=', 'users.id')
            ->whereNotNull('services.salesman_id')
            ->whereNotNull('users.shop_id');
        $this->applyServiceDateRange($serviceActivity, $dateFrom, $dateTo);

        $salesShopActivity = clone $salesActivity;
        $serviceShopActivity = clone $serviceActivity;
        $salesWingaActivity = clone $salesActivity;
        $serviceWingaActivity = clone $serviceActivity;

        $activeShopIds = $salesShopActivity->pluck('users.shop_id')
            ->merge($serviceShopActivity->pluck('users.shop_id'))
            ->unique()
            ->values();
        $activeWingaIds = $salesWingaActivity->pluck('sales.salesman_id')
            ->merge($serviceWingaActivity->pluck('services.salesman_id'))
            ->unique()
            ->values();

        // Recent activity logs.
        $recentActivity = ActivityLog::with('user')
            ->orderBy('created_at', 'DESC')
            ->limit(20)
            ->get();

        return response()->json([
            'period' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summary' => [
                'joined_shops' => $joinedShopsQuery->count(),
                'joined_wingas' => $joinedWingasQuery->count(),
                'active_shops' => $activeShopIds->count(),
                'active_wingas' => $activeWingaIds->count(),
            ],
            'sales_by_shop' => $salesByShop,
            'sales_by_salesman' => $salesBySalesman,
            'recent_activity' => $recentActivity,
        ]);
    }

    /**
     * Get paginated and filterable activity logs.
     */
    public function getLogs(Request $request)
    {
        if ($authError = $this->ensureSuperAdmin($request)) {
            return $authError;
        }

        $validated = $request->validate([
            'action' => 'nullable|string|max:50',
            'model' => 'nullable|string|max:100',
            'user_id' => 'nullable|integer|exists:users,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'q' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = ActivityLog::query()->with('user')->orderByDesc('created_at');

        if (!empty($validated['action'])) {
            $query->where('action', $validated['action']);
        }
        if (!empty($validated['model'])) {
            $query->where('model', $validated['model']);
        }
        if (!empty($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }
        if (!empty($validated['date_from'])) {
            $query->whereDate('created_at', '>=', $validated['date_from']);
        }
        if (!empty($validated['date_to'])) {
            $query->whereDate('created_at', '<=', $validated['date_to']);
        }
        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($inner) use ($q) {
                $inner->where('description', 'like', "%{$q}%")
                    ->orWhere('action', 'like', "%{$q}%")
                    ->orWhere('model', 'like', "%{$q}%");
            });
        }

        $perPage = $validated['per_page'] ?? 20;
        $logs = $query->paginate($perPage);

        return response()->json($logs);
    }

    private function ensureSuperAdmin(Request $request): ?JsonResponse
    {
        if (!$request->user() || $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return null;
    }

    private function applySalesDateRange($query, ?string $dateFrom, ?string $dateTo): void
    {
        if ($dateFrom) {
            $query->whereDate(DB::raw('COALESCE(sales.sale_date, sales.created_at)'), '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate(DB::raw('COALESCE(sales.sale_date, sales.created_at)'), '<=', $dateTo);
        }
    }

    private function applyServiceDateRange($query, ?string $dateFrom, ?string $dateTo): void
    {
        if ($dateFrom) {
            $query->whereDate(DB::raw('COALESCE(services.service_date, services.created_at)'), '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate(DB::raw('COALESCE(services.service_date, services.created_at)'), '<=', $dateTo);
        }
    }
}
