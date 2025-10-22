<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Service::with('salesman')->orderByDesc('created_at');

        if ($request->filled('salesman_id')) {
            $query->where('salesman_id', $request->input('salesman_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
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
            'device_name' => 'required|string|max:255',
            'issue' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'store_name' => 'required|string|max:255',
            'issue_price' => 'required|numeric|min:0',
            'service_price' => 'required|numeric|min:0',
            'final_price' => 'required|numeric|min:0',
            'service_date' => 'nullable|date',
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

        // Calculate cost_price and ganji
        $validated['cost_price'] = $validated['issue_price'] + $validated['service_price'];
        $validated['ganji'] = $validated['final_price'] - $validated['cost_price'];
        $validated['service_date'] = $validated['service_date'] ?? now()->toDateString();

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service created successfully',
            'data' => $service,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return response()->json(['data' => $service->load('salesman')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $rules = [
            'device_name' => 'required|string|max:255',
            'issue' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'store_name' => 'required|string|max:255',
            'issue_price' => 'required|numeric|min:0',
            'service_price' => 'required|numeric|min:0',
            'final_price' => 'required|numeric|min:0',
            'service_date' => 'nullable|date',
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

        // Calculate cost_price and ganji
        $validated['cost_price'] = $validated['issue_price'] + $validated['service_price'];
        $validated['ganji'] = $validated['final_price'] - $validated['cost_price'];

        $service->update($validated);

        return response()->json([
            'message' => 'Service updated successfully',
            'data' => $service->load('salesman'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully',
        ]);
    }
}
