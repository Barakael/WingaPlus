<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add device tracking fields
            $table->string('device_type')->nullable()->after('category_id'); // 'phone', 'laptop', null for regular products
            $table->unsignedBigInteger('phone_color_id')->nullable()->after('device_type');
            $table->unsignedBigInteger('laptop_variant_id')->nullable()->after('phone_color_id');
            
            // Make IMEI unique for phones, allow serial numbers for laptops
            $table->string('imei', 255)->nullable()->change();
            $table->string('serial_number')->nullable()->after('imei'); // For laptops
            
            // Enforce stock = 1 for IMEI-tracked devices (will be handled in application logic)
            
            // Add foreign keys
            $table->foreign('phone_color_id')->references('id')->on('phone_colors')->onDelete('set null');
            $table->foreign('laptop_variant_id')->references('id')->on('laptop_variants')->onDelete('set null');
            
            // Add unique constraint for IMEI (phones) and serial_number (laptops)
            $table->unique('imei', 'products_imei_unique');
            $table->unique('serial_number', 'products_serial_number_unique');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['phone_color_id']);
            $table->dropForeign(['laptop_variant_id']);
            $table->dropUnique('products_imei_unique');
            $table->dropUnique('products_serial_number_unique');
            $table->dropColumn(['device_type', 'phone_color_id', 'laptop_variant_id', 'serial_number']);
        });
    }
};
