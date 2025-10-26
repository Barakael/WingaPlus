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
            $table->decimal('offers', 10, 2)->nullable()->after('cost_price')->comment('Offers/discounts given to customer');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->decimal('offers', 10, 2)->nullable()->after('final_price')->comment('Offers/discounts given to customer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('offers');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('offers');
        });
    }
};