<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'product_id' => 'nullable|string',
            'product_name' => 'nullable|string|max:255',
            'warranty_id' => 'nullable|integer',
            'salesman_id' => 'nullable|integer',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'offers' => 'nullable|numeric|min:0',
            'warranty_months' => 'nullable|integer|min:0',
            'has_warranty' => 'sometimes|boolean',
            'warranty_start' => 'nullable|date',
            'warranty_end' => 'nullable|date|after_or_equal:warranty_start',
            'warranty_details' => 'nullable|array',
            'sale_date' => 'nullable|date',
            'reference_store' => 'nullable|string|max:255',
            'category' => 'nullable|string|in:phones,accessories',
            'phone_name' => 'nullable|string|max:255',
            'imei' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:100',
            'storage' => 'nullable|string|max:50',
        ];
    }
}
