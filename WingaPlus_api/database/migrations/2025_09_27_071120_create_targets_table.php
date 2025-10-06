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
        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salesman_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('team_id')->nullable(); // For future team functionality
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['individual', 'team']);
            $table->enum('period', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
            $table->enum('metric', ['revenue', 'sales_count', 'products_sold', 'commission']);
            $table->decimal('target_value', 15, 2);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'completed', 'failed', 'cancelled'])->default('active');
            $table->decimal('bonus_amount', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
