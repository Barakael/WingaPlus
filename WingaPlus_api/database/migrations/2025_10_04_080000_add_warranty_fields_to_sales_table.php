<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->boolean('has_warranty')->default(false)->after('total_amount');
            $table->dateTime('warranty_start')->nullable()->after('has_warranty');
            $table->dateTime('warranty_end')->nullable()->after('warranty_start');
            $table->string('warranty_status')->nullable()->after('warranty_end');
            $table->json('warranty_details')->nullable()->after('warranty_status');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['has_warranty', 'warranty_start', 'warranty_end', 'warranty_status', 'warranty_details']);
        });
    }
};
