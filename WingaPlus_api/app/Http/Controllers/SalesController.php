<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Mail\WarrantySaleFiled;
use App\Models\Sale;
use App\Services\WarrantyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SalesController extends BaseController
{
    protected WarrantyService $warrantyService;

    public function __construct(WarrantyService $warrantyService)
    {
        $this->warrantyService = $warrantyService;
    }
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

        return $this->sendResponse(
            ['data' => $query->get(), 'total' => $query->count()],
            'Sales retrieved successfully'
        );
    }

    public function store(SaleRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['product_id'] ?? null) && empty($validated['product_name'] ?? null)) {
            return $this->sendError('Validation failed', ['product' => ['Either product_id or product_name is required']], 422);
        }

        // Set salesman_id from request or default to 1 for mock auth
        if (empty($validated['salesman_id'])) {
            $validated['salesman_id'] = 1; // Mock user ID
        }

    // compute totals and ganji
    $quantity = $validated['quantity'] ?? 1;
    $sellingPrice = $validated['selling_price'] ?? 0;
    $validated['total_amount'] = $quantity * $sellingPrice;
    // ensure selling_price exists (DB migration defines it as non-nullable)
    $validated['selling_price'] = $validated['selling_price'] ?? $validated['unit_price'] ?? 0;
    // ensure required product_id exists (fallback to product_name or a manual placeholder)
    $validated['product_id'] = $validated['product_id'] ?? ($validated['product_name'] ?? 'manual');
        if (array_key_exists('cost_price', $validated) && $validated['cost_price'] !== null) {
            $validated['ganji'] = (($validated['selling_price'] - $validated['cost_price']) * ($validated['quantity'] ?? 1));
        }
        $validated['sale_date'] = $validated['sale_date'] ?? now();

        DB::beginTransaction();
        try {
            $hasWarranty = (bool)($validated['has_warranty'] ?? false);
            if ($hasWarranty) {
                $calc = $this->warrantyService->calculate($validated);
                $validated = array_merge($validated, $calc);
                $validated['warranty_details'] = $validated['warranty_details'] ?? [];
                $validated['has_warranty'] = true;
            } else {
                $validated['has_warranty'] = false;
            }

            $sale = Sale::create($validated);

            DB::commit();

            // Send warranty email if sale has warranty
            if ($hasWarranty && !empty($validated['warranty_details']['customer_email'] ?? null)) {
                try {
                    Mail::to($validated['warranty_details']['customer_email'])->send(new WarrantySaleFiled($sale));
                } catch (\Exception $e) {
                    // Log email error but don't fail the sale
                    \Log::error('Failed to send warranty email: ' . $e->getMessage());
                }
            }

            return $this->sendResponse($sale, 'Sale created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create sale', ['error' => $e->getMessage()], 500);
        }
    }

    public function show(Sale $sale)
    {
    return $this->sendResponse($sale, 'Sale retrieved successfully');
    }

    public function update(SaleRequest $request, Sale $sale)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // recompute totals if price/quantity changed
            if (array_key_exists('quantity', $validated) || array_key_exists('selling_price', $validated)) {
                $quantity = $validated['quantity'] ?? $sale->quantity;
                $sellingPrice = $validated['selling_price'] ?? $sale->selling_price;
                $validated['total_amount'] = $quantity * $sellingPrice;
            }

            if (array_key_exists('cost_price', $validated)) {
                $cost = $validated['cost_price'] ?? $sale->cost_price;
                $sellingPrice = $validated['selling_price'] ?? $sale->selling_price;
                $quantity = $validated['quantity'] ?? $sale->quantity;
                $validated['ganji'] = ($sellingPrice - $cost) * $quantity;
            }

            // Warranty sync
            $hasWarranty = array_key_exists('has_warranty', $validated) ? (bool)$validated['has_warranty'] : $sale->has_warranty;
            if ($hasWarranty) {
                $calc = $this->warrantyService->calculate(array_merge($sale->toArray(), $validated));
                $validated = array_merge($validated, $calc);
                $validated['warranty_details'] = $validated['warranty_details'] ?? $sale->warranty_details ?? [];
                $validated['has_warranty'] = true;
            } else {
                // clear warranty fields if turning off
                $validated['has_warranty'] = false;
                $validated['warranty_start'] = null;
                $validated['warranty_end'] = null;
                $validated['warranty_status'] = null;
                $validated['warranty_details'] = null;
            }

            $sale->update($validated);

            DB::commit();

            return $this->sendResponse($sale, 'Sale updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to update sale', ['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Sale $sale)
    {
        DB::beginTransaction();
        try {
            $sale->delete();
            DB::commit();
            return $this->sendResponse([], 'Sale deleted');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to delete sale', ['error' => $e->getMessage()], 500);
        }
    }
}
