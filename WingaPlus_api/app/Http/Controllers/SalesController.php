<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Mail\WarrantySaleFiled;
use App\Models\Sale;
use App\Models\User;
use App\Services\WarrantyCardRenderer;
use App\Services\WarrantyService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
        $query = Sale::query()->with('salesman')->orderByDesc('sale_date');

        if ($request->filled('salesman_id')) {
            $query->where('salesman_id', $request->input('salesman_id'));
        }

        // Filter by shop_id via salesman relationship
        if ($request->filled('shop_id')) {
            $shopId = $request->input('shop_id');
            $query->whereHas('salesman', function ($q) use ($shopId) {
                $q->where('shop_id', $shopId);
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->input('date_to'));
        }

        $data = $query->get();
        return $this->sendResponse(
            ['data' => $data, 'total' => $data->count()],
            'Sales retrieved successfully'
        );
    }

    public function store(SaleRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['product_id'] ?? null) && empty($validated['product_name'] ?? null)) {
            return $this->sendError('Validation failed', ['product' => ['Either product_id or product_name is required']], 422);
        }

        // Normalize product_name to lowercase to avoid duplicates
        if (!empty($validated['product_name'])) {
            $validated['product_name'] = strtolower(trim($validated['product_name']));
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
        // Always calculate ganji when cost_price is provided
        if (array_key_exists('cost_price', $validated)) {
            $costPrice = $validated['cost_price'] ?? 0;
            $sellingPrice = $validated['selling_price'] ?? 0;
            $quantity = $validated['quantity'] ?? 1;
            $offers = $validated['offers'] ?? 0;
            
            $baseProfit = ($sellingPrice - $costPrice) * $quantity;
            $validated['ganji'] = $baseProfit - $offers; // Subtract offers from profit
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

            $emailSent = false;
            $emailError = null;

            // Send warranty email if sale has warranty
            if ($hasWarranty && !empty($validated['warranty_details']['customer_email'] ?? null)) {
                try {
                    // Create a mock warranty object from sale data for email template
                    $mockWarranty = (object) [
                        'phone_name' => $validated['phone_name'] ?? $validated['product_name'] ?? '',
                        'customer_name' => $validated['customer_name'] ?? '',
                        'customer_email' => $validated['warranty_details']['customer_email'] ?? '',
                        'customer_phone' => $validated['customer_phone'] ?? '',
                        'color' => $validated['color'] ?? '',
                        'storage' => $validated['storage'] ?? '',
                        'imei_number' => $validated['imei'] ?? $validated['serial_number'] ?? $validated['warranty_details']['imei_number'] ?? '',
                        'price' => $validated['selling_price'] ?? $validated['unit_price'] ?? 0,
                    ];
                    
                    $issuerUser = auth()->user();
                    $userName = $issuerUser ? $issuerUser->name : 'WingaPro Store';
                    Mail::to($validated['warranty_details']['customer_email'])->send(
                        new WarrantySaleFiled($sale, $mockWarranty, $userName, $issuerUser)
                    );
                    $emailSent = true;
                } catch (\Exception $e) {
                    // Log email error but don't fail the sale
                    $emailError = $e->getMessage();
                    \Log::error('Failed to send warranty email: ' . $e->getMessage());
                }
            } elseif (!$hasWarranty) {
                // No warranty email expected for non-warranty sales.
                $emailSent = true;
            }

            // Surface email delivery state to frontend without changing payload shape.
            $sale->setAttribute('email_sent', $emailSent);
            if ($emailError) {
                $sale->setAttribute('email_error', $emailError);
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

    public function previewWarrantyCard(Request $request, Sale $sale)
    {
        $authError = $this->ensureShopOwner($request);
        if ($authError) {
            return $authError;
        }

        if (!$sale->has_warranty) {
            return $this->sendError('This sale does not have a warranty card', [], 422);
        }

        $payload = $this->buildWarrantyCardPayload($sale);
        $binary = app(WarrantyCardRenderer::class)->renderBinary($payload);

        return response($binary, 200)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    }

    public function regenerateWarrantyCard(Request $request, Sale $sale)
    {
        $authError = $this->ensureShopOwner($request);
        if ($authError) {
            return $authError;
        }

        if (!$sale->has_warranty) {
            return $this->sendError('This sale does not have a warranty card', [], 422);
        }

        // Render once to validate current template+data, but do not send email.
        $payload = $this->buildWarrantyCardPayload($sale);
        app(WarrantyCardRenderer::class)->renderBinary($payload);

        return $this->sendResponse([
            'sale_id' => $sale->id,
            'preview_url' => url("/api/sales/{$sale->id}/warranty-card/preview").'?t='.now()->timestamp,
            'regenerated_at' => now()->toIso8601String(),
        ], 'Warranty card regenerated for preview');
    }

    public function update(SaleRequest $request, Sale $sale)
    {
        $validated = $request->validated();

        // Normalize product_name to lowercase to avoid duplicates
        if (!empty($validated['product_name'])) {
            $validated['product_name'] = strtolower(trim($validated['product_name']));
        }

        DB::beginTransaction();
        try {
            // recompute totals if price/quantity changed
            if (array_key_exists('quantity', $validated) || array_key_exists('selling_price', $validated)) {
                $quantity = $validated['quantity'] ?? $sale->quantity;
                $sellingPrice = $validated['selling_price'] ?? $sale->selling_price;
                $validated['total_amount'] = $quantity * $sellingPrice;
            }

            // Always recalculate ganji when any relevant field is updated
            if (array_key_exists('cost_price', $validated) || array_key_exists('selling_price', $validated) || 
                array_key_exists('quantity', $validated) || array_key_exists('offers', $validated)) {
                
                $cost = $validated['cost_price'] ?? $sale->cost_price ?? 0;
                $sellingPrice = $validated['selling_price'] ?? $sale->selling_price ?? 0;
                $quantity = $validated['quantity'] ?? $sale->quantity ?? 1;
                $offers = $validated['offers'] ?? $sale->offers ?? 0;
                
                $baseProfit = ($sellingPrice - $cost) * $quantity;
                $validated['ganji'] = $baseProfit - $offers; // Subtract offers from profit
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

    private function ensureShopOwner(Request $request): ?\Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return $this->sendError('Unauthenticated', [], 401);
        }

        if ($user->role !== 'shop_owner') {
            return $this->sendError('Only shop owners can use warranty debug tools', [], 403);
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    private function buildWarrantyCardPayload(Sale $sale): array
    {
        $details = is_array($sale->warranty_details) ? $sale->warranty_details : [];
        $issuerUser = $sale->salesman_id ? User::with(['shop', 'ownedShop'])->find($sale->salesman_id) : null;
        $issuerShop = null;

        if ($issuerUser) {
            if ($issuerUser->role === 'shop_owner') {
                $issuerShop = $issuerUser->ownedShop()->first();
            } elseif ($issuerUser->shop_id) {
                $issuerShop = $issuerUser->shop()->first();
            }
        }

        $logoPath = null;
        if ($issuerUser) {
            if ($issuerUser->role === 'salesman') {
                $logoPath = $issuerUser->logo_path ?: $issuerShop?->logo_path;
            } elseif ($issuerUser->role === 'shop_owner') {
                $logoPath = $issuerShop?->logo_path ?: $issuerUser->logo_path;
            } else {
                $logoPath = $issuerShop?->logo_path ?: $issuerUser->logo_path;
            }
        } elseif ($issuerShop) {
            $logoPath = $issuerShop->logo_path;
        }

        $pieces = array_filter([
            $details['storage'] ?? $sale->storage ?? null,
            $details['color'] ?? $sale->color ?? null,
            $details['ram'] ?? $sale->ram ?? null,
        ]);

        return [
            'business_name' => $issuerShop?->name ?: ($issuerUser?->store_name ?: ($issuerUser?->name ?: 'WingaPro')),
            'business_phone' => $issuerShop?->phone ?: ($issuerUser?->phone ?: ($sale->customer_phone ?: '')),
            'business_email' => $issuerShop?->effective_email ?: ($issuerUser?->email ?: null),
            'logo_path' => $logoPath,
            'customer_name' => $sale->customer_name,
            'product_name' => $details['phone_name'] ?? $details['laptop_name'] ?? $sale->product_name ?? 'N/A',
            'purchase_date' => optional($sale->created_at)->format('M d, Y') ?: now()->format('M d, Y'),
            'warranty_period' => ($sale->warranty_months ?? null) ? ($sale->warranty_months.' months') : 'N/A',
            'warranty_expires' => $sale->warranty_end ? \Illuminate\Support\Carbon::parse($sale->warranty_end)->format('M d, Y') : 'N/A',
            'imei_serial' => $details['imei_number'] ?? $sale->imei ?? $sale->serial_number ?? $details['serial_number'] ?? 'N/A',
            'specification' => $pieces ? implode(' | ', $pieces) : 'N/A',
        ];
    }
}
