<?php

namespace App\Http\Controllers;

use App\Models\Target;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Target::query();

        // Filter by salesman if provided
        if ($request->filled('salesman_id')) {
            $query->where('salesman_id', $request->input('salesman_id'));
        }

        // Filter by type if provided
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by date range if provided
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        return response()->json([
            'data' => [
                'data' => $query->with(['salesman', 'shop'])->orderBy('created_at', 'desc')->get(),
                'total' => $query->count(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'salesman_id' => 'required|exists:users,id',
            'team_id' => 'nullable|exists:teams,id',
            'shop_id' => 'nullable|exists:shops,id',
            'name' => 'required|string|max:255',
            'period' => 'required|in:weekly,monthly,yearly',
            'metric' => 'required|in:profit,items_sold',
            'target_value' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,completed,failed,cancelled',
            'bonus_amount' => 'nullable|numeric|min:0',
        ];

        $validator = \Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $validated['current_value'] = $validated['current_value'] ?? 0;
        $validated['status'] = $validated['status'] ?? 'active';

        $target = Target::create($validated);

        return response()->json([
            'message' => 'Target created successfully',
            'data' => $target->load(['salesman', 'shop']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Target $target)
    {
        return response()->json(['data' => $target->load(['salesman', 'shop'])]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Target $target)
    {
        $rules = [
            'salesman_id' => 'sometimes|exists:users,id',
            'team_id' => 'nullable|exists:teams,id',
            'shop_id' => 'nullable|exists:shops,id',
            'name' => 'sometimes|string|max:255',
            'period' => 'sometimes|in:weekly,monthly,yearly',
            'metric' => 'sometimes|in:profit,items_sold',
            'target_value' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,completed,failed,cancelled',
            'bonus_amount' => 'sometimes|numeric|min:0',
        ];

        $validator = \Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $target->update($validated);

        return response()->json([
            'message' => 'Target updated successfully',
            'data' => $target->load(['salesman', 'shop']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Target $target)
    {
        $target->delete();

        return response()->json([
            'message' => 'Target deleted successfully',
        ]);
    }
}
