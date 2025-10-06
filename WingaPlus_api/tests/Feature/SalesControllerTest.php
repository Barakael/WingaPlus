<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SalesControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_sale_with_warranty_creates_warranty_fields()
    {
        // Create minimal input with warranty
        $payload = [
            'product_name' => 'Test Phone',
            'quantity' => 1,
            'unit_price' => 100.00,
            'has_warranty' => true,
            'warranty_months' => 6,
            'warranty_details' => ['imei' => '111222333444555'],
        ];

        $response = $this->postJson('/api/sales', $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure(['message', 'data' => ['id', 'product_name', 'has_warranty', 'warranty_start', 'warranty_end', 'warranty_status', 'warranty_details']]);

        $data = $response->json('data');
        $this->assertTrue((bool)$data['has_warranty']);
        $this->assertNotNull($data['warranty_start']);
        $this->assertNotNull($data['warranty_end']);
        $this->assertEquals('6', date_diff(date_create($data['warranty_start']), date_create($data['warranty_end']))->m + (date_diff(date_create($data['warranty_start']), date_create($data['warranty_end']))->y * 12));
    }

    public function test_update_sale_turns_off_warranty_clears_fields()
    {
        $payload = [
            'product_name' => 'Test Phone',
            'quantity' => 1,
            'unit_price' => 100.00,
            'has_warranty' => true,
            'warranty_months' => 6,
            'warranty_details' => ['imei' => '111222333444555'],
        ];

        $create = $this->postJson('/api/sales', $payload);
        $create->assertStatus(201);
        $id = $create->json('data.id');

        // Now update to disable warranty
        $update = $this->putJson("/api/sales/{$id}", ['has_warranty' => false]);
        $update->assertStatus(200);
        $this->assertFalse($update->json('data.has_warranty'));
        $this->assertNull($update->json('data.warranty_start'));
        $this->assertNull($update->json('data.warranty_end'));
        $this->assertNull($update->json('data.warranty_status'));
    }
}
