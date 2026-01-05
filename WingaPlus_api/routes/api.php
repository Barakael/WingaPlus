<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WarrantyController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\MyShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenditureController;

Route::get('/user', function (Request $request) {
    $user = $request->user();
    // Load shop relationship for shop owners
    if ($user && $user->role === 'shop_owner') {
        $user->load('ownedShop');
    }
    // Load shop relationship for other users
    if ($user && $user->shop_id) {
        $user->load('shop');
    }
    return $user;
})->middleware('auth:sanctum');

// Sanctum authentication routes
Route::post('/login', function (Request $request) {
    try {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $user = auth()->user();
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Login failed: ' . $e->getMessage()], 500);
    }
});

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out successfully']);
})->middleware('auth:sanctum');

Route::post('/register', function (Request $request) {
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            // role removed from public signup; accept account_type instead
            'account_type' => 'nullable|string|in:winga,shop_owner',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            // Map account_type to role; default non-specified to salesman
            'role' => $request->account_type === 'shop_owner' ? 'shop_owner' : 'salesman',
            'status' => 'active',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'needs_shop_setup' => $user->role === 'shop_owner' && $user->ownedShops()->count() === 0,
        ], 201);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Registration failed: ' . $e->getMessage()], 500);
    }
});

// Password reset routes
Route::post('/password/forgot', [PasswordResetController::class, 'requestReset']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

Route::get('/warranties', [WarrantyController::class, 'index']);
Route::post('/warranties', [WarrantyController::class, 'store']);
Route::get('/sales', [SalesController::class, 'index']);
Route::post('/sales', [SalesController::class, 'store']);
Route::get('/sales/{sale}', [SalesController::class, 'show']);
Route::put('/sales/{sale}', [SalesController::class, 'update']);
Route::patch('/sales/{sale}', [SalesController::class, 'update']);
Route::delete('/sales/{sale}', [SalesController::class, 'destroy']);

// Service routes
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::put('/services/{service}', [ServiceController::class, 'update']);
Route::patch('/services/{service}', [ServiceController::class, 'update']);
Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

// Expenditure routes
Route::get('/expenditures', [ExpenditureController::class, 'index']);
Route::post('/expenditures', [ExpenditureController::class, 'store']);
Route::get('/expenditures/{expenditure}', [ExpenditureController::class, 'show']);
Route::put('/expenditures/{expenditure}', [ExpenditureController::class, 'update']);
Route::patch('/expenditures/{expenditure}', [ExpenditureController::class, 'update']);
Route::delete('/expenditures/{expenditure}', [ExpenditureController::class, 'destroy']);

// Target routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('targets', TargetController::class);
});

// User management routes (protected by auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::put('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::post('/users/invite-storekeeper', [UserController::class, 'inviteStorekeeper']);
    // Authenticated shop owner shop setup & retrieval
    Route::get('/my/shop', [MyShopController::class, 'show']);
    Route::post('/my/shop', [MyShopController::class, 'store']);
    // Products & Categories
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
});

// Storekeeper setup password route (public - uses token)
Route::post('/storekeeper/setup-password', [UserController::class, 'setupPassword']);

// Super Admin routes (protected by auth)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Dashboard stats
    Route::get('/dashboard/stats', [SuperAdminController::class, 'getDashboardStats']);
    
    // Shops management
    Route::get('/shops', [SuperAdminController::class, 'getShops']);
    Route::post('/shops', [SuperAdminController::class, 'createShop']);
    Route::put('/shops/{id}', [SuperAdminController::class, 'updateShop']);
    Route::delete('/shops/{id}', [SuperAdminController::class, 'deleteShop']);
    
    // Users management
    Route::get('/users', [SuperAdminController::class, 'getUsers']);
    Route::put('/users/{id}', [SuperAdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [SuperAdminController::class, 'deleteUser']);
    Route::post('/users/{id}/reset-password', [SuperAdminController::class, 'resetUserPassword']);
    
    // Reports
    Route::get('/reports', [SuperAdminController::class, 'getReports']);
});