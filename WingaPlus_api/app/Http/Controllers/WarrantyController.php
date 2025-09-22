<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warranty;
use App\Mail\WarrantyFiled;
use Illuminate\Support\Facades\Mail;

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
        ]);

        $warranty = Warranty::create($validated);

        // Send email
        Mail::to($warranty->customer_email)->send(new WarrantyFiled($warranty));

        return response()->json([
            'message' => 'Warranty filed successfully',
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
            ]
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
