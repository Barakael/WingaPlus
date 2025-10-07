<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sale::query()->orderByDesc('sale_date');

        if ($request->filled('salesman_id')) {
            $query->where('salesman_id', $request->input('salesman_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->input('date_to'));
        }

        return response()->json([
            'data' => [
                'data' => $query->get(),
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
            'product_id' => 'nullable|string',
            'product_name' => 'nullable|string|max:255',
            'warranty_id' => 'nullable|exists:warranties,id',
            'salesman_id' => 'nullable|exists:users,id', // now nullable in DB
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'reference_store' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'warranty_months' => 'nullable|integer|min:0',
            'sale_date' => 'nullable|date',
        ];

        $validator = \Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        if (empty($validated['product_id']) && empty($validated['product_name'])) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['product' => ['Either product_id or product_name is required']]
            ], 422);
        }

        // salesman_id now optional across the board; if you want to enforce in non-warranty context, re-enable check here

        $validated['total_amount'] = $validated['quantity'] * $validated['unit_price'];
        if (array_key_exists('cost_price', $validated) && $validated['cost_price'] !== null) {
            $validated['ganji'] = ($validated['unit_price'] - $validated['cost_price']) * $validated['quantity'];
        }
        $validated['sale_date'] = $validated['sale_date'] ?? now();

        $sale = Sale::create($validated);

        return response()->json([
            'message' => 'Sale created successfully',
            'data' => $sale,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return response()->json(['data' => $sale]);
    }
}
