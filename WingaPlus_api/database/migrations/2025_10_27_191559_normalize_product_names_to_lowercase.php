<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Normalize product_name in sales table to lowercase
        DB::statement("UPDATE sales SET product_name = LOWER(TRIM(product_name)) WHERE product_name IS NOT NULL");
        
        // Normalize device_name in services table to lowercase
        DB::statement("UPDATE services SET device_name = LOWER(TRIM(device_name)) WHERE device_name IS NOT NULL");
        
        // Normalize phone_name in warranties table to lowercase (if it exists)
        if (Schema::hasColumn('warranties', 'phone_name')) {
            DB::statement("UPDATE warranties SET phone_name = LOWER(TRIM(phone_name)) WHERE phone_name IS NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse - lowercase normalization is a data cleanup operation
        // and doesn't need to be reversed
    }
};
