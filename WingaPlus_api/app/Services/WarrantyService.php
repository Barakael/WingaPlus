<?php

namespace App\Services;

use Illuminate\Support\Carbon;

class WarrantyService
{
    /**
     * Calculate warranty start, end and status based on input.
     * Returns array with keys: warranty_start, warranty_end, warranty_status
     * Accepts optional 'warranty_start' (date/string) and 'warranty_months' (int)
     */
    public function calculate(array $input): array
    {
        $months = intval($input['warranty_months'] ?? 0);
        $start = isset($input['warranty_start']) ? Carbon::parse($input['warranty_start']) : Carbon::now();
        $end = $months > 0 ? (clone $start)->addMonths($months) : null;

        $status = $end ? (Carbon::now()->lessThanOrEqualTo($end) ? 'active' : 'expired') : 'unknown';

        return [
            'warranty_start' => $start,
            'warranty_end' => $end,
            'warranty_status' => $status,
        ];
    }

    /**
     * Determine if warranty is currently active for provided sale record
     */
    public function isActive($sale): bool
    {
        if (empty($sale->warranty_start) || empty($sale->warranty_end)) {
            return false;
        }
        return Carbon::now()->between(Carbon::parse($sale->warranty_start), Carbon::parse($sale->warranty_end));
    }
}
