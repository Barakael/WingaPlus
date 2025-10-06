<?php

namespace Tests\Unit;

use App\Services\WarrantyService;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\TestCase;

class WarrantyServiceTest extends TestCase
{
    public function test_calculate_with_months_produces_end_and_active_status()
    {
        $service = new WarrantyService();
        $input = ['warranty_months' => 12, 'warranty_start' => '2025-01-01'];
        $result = $service->calculate($input);

        $this->assertArrayHasKey('warranty_start', $result);
        $this->assertArrayHasKey('warranty_end', $result);
        $this->assertArrayHasKey('warranty_status', $result);

        $this->assertEquals(Carbon::parse('2025-01-01')->toDateString(), $result['warranty_start']->toDateString());
        $this->assertEquals(Carbon::parse('2025-01-01')->addMonths(12)->toDateString(), $result['warranty_end']->toDateString());
        $this->assertContains($result['warranty_status'], ['active', 'expired', 'unknown']);
    }

    public function test_calculate_without_months_returns_unknown_status()
    {
        $service = new WarrantyService();
        $result = $service->calculate([]);

        $this->assertEquals('unknown', $result['warranty_status']);
        $this->assertNotNull($result['warranty_start']);
        $this->assertNull($result['warranty_end']);
    }
}
