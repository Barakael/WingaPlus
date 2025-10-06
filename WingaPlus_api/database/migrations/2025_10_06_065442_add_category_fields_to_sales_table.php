<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('reference_store')->nullable()->after('sale_date');
            $table->enum('category', ['phones', 'accessories'])->nullable()->after('reference_store');
            $table->string('phone_name')->nullable()->after('category');
            $table->string('imei', 50)->nullable()->after('phone_name');
            $table->string('color', 100)->nullable()->after('imei');
            $table->string('storage', 50)->nullable()->after('color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['reference_store', 'category', 'phone_name', 'imei', 'color', 'storage']);
        });
    }
};
