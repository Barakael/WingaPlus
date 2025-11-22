<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warranty;
use App\Models\Sale;
use App\Mail\WarrantySaleFiled;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class WarrantyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_name' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'store_name' => 'required|string',
            'color' => 'required|string',
            'storage' => 'required|string',
            'price' => 'required|numeric',
            'imei_number' => 'required|string',
            'warranty_period' => 'required|integer',
            // Optional salesman_id if front-end later supplies it
            'salesman_id' => 'nullable|exists:users,id',
        ]);

        $result = DB::transaction(function () use ($validated) {
            // 1. Create the warranty record
            $warranty = Warranty::create($validated);

            // 2. Automatically create a corresponding sale
            $saleData = [
                'product_name' => $warranty->phone_name,
                'warranty_id' => $warranty->id,
                'salesman_id' => $validated['salesman_id'] ?? null,
                'customer_name' => $warranty->customer_name,
                'customer_phone' => $warranty->customer_phone,
                'quantity' => 1,
                'unit_price' => $warranty->price,
                'total_amount' => $warranty->price, // quantity * unit_price
                'warranty_months' => $warranty->warranty_period,
                'warranty_end' => $warranty->expiry_date,
                'warranty_details' => [
                    'phone_name' => $warranty->phone_name,
                    'customer_email' => $warranty->customer_email,
                    'customer_name' => $warranty->customer_name,
                    'customer_phone' => $warranty->customer_phone,
                    'color' => $warranty->color,
                    'storage' => $warranty->storage,
                    'imei_number' => $warranty->imei_number,
                    'price' => $warranty->price,
                    'selling_price' => $warranty->price,
                    'cost_price' => 0, // Not available in warranty
                ],
                'sale_date' => now(),
            ];

            $sale = Sale::create($saleData);

            return [$warranty, $sale];
        });

        [$warranty, $sale] = $result;

        // Send email after transaction succeeds
        try {
            $userName = auth()->user() ? auth()->user()->name : 'WingaPro Store';
            Mail::to($warranty->customer_email)->send(new WarrantySaleFiled($sale, $warranty, $userName));
        } catch (\Exception $e) {
            // Log email error but don't fail the warranty creation
            \Log::error('Failed to send warranty email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Warranty filed successfully (sale created)',
            'warranty' => [
                'id' => $warranty->id,
                'phone_name' => $warranty->phone_name,
                'customer_name' => $warranty->customer_name,
                'customer_email' => $warranty->customer_email,
                'customer_phone' => $warranty->customer_phone,
                'store_name' => $warranty->store_name,
                'color' => $warranty->color,
                'storage' => $warranty->storage,
                'price' => $warranty->price,
                'imei_number' => $warranty->imei_number,
                'warranty_period' => $warranty->warranty_period,
                'status' => $warranty->calculated_status,
                'expiry_date' => $warranty->expiry_date->toDateString(),
                'created_at' => $warranty->created_at,
                'updated_at' => $warranty->updated_at,
            ],
            'sale' => $sale,
        ], 201);
    }

    public function index()
    {
        $warranties = Warranty::orderBy('created_at', 'desc')->get();

        $warrantiesWithStatus = $warranties->map(function ($warranty) {
            return [
                'id' => $warranty->id,
                'phone_name' => $warranty->phone_name,
                'customer_name' => $warranty->customer_name,
                'customer_email' => $warranty->customer_email,
                'customer_phone' => $warranty->customer_phone,
                'store_name' => $warranty->store_name,
                'color' => $warranty->color,
                'storage' => $warranty->storage,
                'price' => $warranty->price,
                'imei_number' => $warranty->imei_number,
                'warranty_period' => $warranty->warranty_period,
                'status' => $warranty->calculated_status,
                'expiry_date' => $warranty->expiry_date->toDateString(),
                'created_at' => $warranty->created_at,
                'updated_at' => $warranty->updated_at,
            ];
        });

        return response()->json([
            'warranties' => $warrantiesWithStatus,
            'total' => $warranties->count()
        ]);
    }
}
