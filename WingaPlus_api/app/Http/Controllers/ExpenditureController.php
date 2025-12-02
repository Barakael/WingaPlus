<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use Illuminate\Http\Request;

class ExpenditureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Expenditure::with('salesman')->orderByDesc('expenditure_date');

        if ($request->filled('salesman_id')) {
            $query->where('salesman_id', $request->input('salesman_id'));
        }

        // Filter by shop via related salesman
        if ($request->filled('shop_id')) {
            $shopId = $request->input('shop_id');
            $query->whereHas('salesman', function ($q) use ($shopId) {
                $q->where('shop_id', $shopId);
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('expenditure_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('expenditure_date', '<=', $request->input('date_to'));
        }

        $data = $query->get();
        return response()->json([
            'data' => [
                'data' => $data,
                'total' => $data->count(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'expenditure_date' => 'nullable|date',
            'salesman_id' => 'required|exists:users,id',
        ];

        $validator = \Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        $validated['expenditure_date'] = $validated['expenditure_date'] ?? now()->toDateTimeString();

        $expenditure = Expenditure::create($validated);

        return response()->json([
            'message' => 'Expenditure created successfully',
            'data' => $expenditure->load('salesman'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expenditure $expenditure)
    {
        return response()->json(['data' => $expenditure->load('salesman')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expenditure $expenditure)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'expenditure_date' => 'nullable|date',
            'salesman_id' => 'required|exists:users,id',
        ];

        $validator = \Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        $expenditure->update($validated);

        return response()->json([
            'message' => 'Expenditure updated successfully',
            'data' => $expenditure->load('salesman'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expenditure $expenditure)
    {
        $expenditure->delete();

        return response()->json([
            'message' => 'Expenditure deleted successfully',
        ]);
    }
}

