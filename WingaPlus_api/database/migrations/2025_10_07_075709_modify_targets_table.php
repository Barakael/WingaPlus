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
        Schema::table('targets', function (Blueprint $table) {
            // Add name field
            $table->string('name');
            
            // Modify period enum to allow weekly/monthly/yearly
            $table->dropColumn('period');
            $table->enum('period', ['weekly', 'monthly', 'yearly']);
            
            // Modify metric enum to only allow profit/items_sold
            $table->dropColumn('metric');
            $table->enum('metric', ['profit', 'items_sold']);
            
            // Remove unnecessary fields
            $table->dropColumn(['type', 'current_value', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('targets', function (Blueprint $table) {
            // Reverse the changes
            $table->dropColumn('name');
            
            $table->dropColumn('period');
            $table->enum('period', ['monthly', 'quarterly', 'yearly']);
            
            $table->dropColumn('metric');
            $table->enum('metric', ['revenue', 'profit', 'sales_count', 'items_sold']);
            
            // Add back the removed fields
            $table->enum('type', ['monthly', 'quarterly', 'yearly', 'custom']);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
        });
    }
};
