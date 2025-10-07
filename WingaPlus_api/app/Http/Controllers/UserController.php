<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->canManageUsers() && !$user->isShopOwner()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::with(['shop', 'ownedShops']);

        // Filter based on user permissions
        if ($user->isShopOwner()) {
            $shopIds = $user->ownedShops()->pluck('id');
            $query->where(function ($q) use ($shopIds) {
                $q->whereIn('shop_id', $shopIds)
                  ->orWhere('role', 'salesman')
                  ->orWhere('id', $user->id);
            });
        }

        // Apply filters
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        if ($request->has('shop_id') && $request->shop_id) {
            $query->where('shop_id', $request->shop_id);
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->canManageUsers() && !$user->isShopOwner()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['super_admin', 'shop_owner', 'storekeeper', 'salesman'])],
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);

        // Validate role-based permissions
        if (!$this->canCreateUserWithRole($user, $data['role'], $data['shop_id'] ?? null)) {
            return response()->json(['message' => 'You do not have permission to create users with this role'], 403);
        }

        // Validate shop assignment
        if (!$this->canAssignUserToShop($user, $data['role'], $data['shop_id'] ?? null)) {
            return response()->json(['message' => 'Invalid shop assignment for this role'], 422);
        }

        $newUser = User::create($data);

        return response()->json($newUser->load(['shop', 'ownedShops']), 201);
    }

    /**
     * Display the specified user.
     */
    public function show(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->canManageUser($user) && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($user->load(['shop', 'ownedShops', 'sales', 'targets']));
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->canManageUser($user) && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|required|string|min:8',
            'role' => ['sometimes', 'required', Rule::in(['super_admin', 'shop_owner', 'storekeeper', 'salesman'])],
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Validate role-based permissions for updates
        if (isset($data['role']) && !$this->canCreateUserWithRole($currentUser, $data['role'], $data['shop_id'] ?? $user->shop_id)) {
            return response()->json(['message' => 'You do not have permission to assign this role'], 403);
        }

        // Validate shop assignment
        if (isset($data['shop_id']) && !$this->canAssignUserToShop($currentUser, $data['role'] ?? $user->role, $data['shop_id'])) {
            return response()->json(['message' => 'Invalid shop assignment for this role'], 422);
        }

        $user->update($data);

        return response()->json($user->load(['shop', 'ownedShops']));
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->canManageUser($user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent deleting self
        if ($currentUser->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 422);
        }

        // Prevent deleting super admin if not super admin
        if ($user->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return response()->json(['message' => 'Only super admins can delete other super admins'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Check if a user can create users with a specific role.
     */
    private function canCreateUserWithRole(User $user, string $role, ?int $shopId): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isShopOwner()) {
            // Shop owners can create storekeepers and salesmen
            return in_array($role, ['storekeeper', 'salesman']);
        }

        return false;
    }

    /**
     * Change the current authenticated user's password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    /**
     * Update the current authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'email', 'phone']));

        return response()->json($user->fresh());
    }
}
