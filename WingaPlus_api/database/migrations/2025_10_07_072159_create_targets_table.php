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
            $table->foreignId('salesman_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('team_id')->nullable();
            $table->unsignedBigInteger('shop_id')->nullable();
            $table->enum('type', ['monthly', 'quarterly', 'yearly', 'custom']);
            $table->enum('period', ['monthly', 'quarterly', 'yearly']);
            $table->enum('metric', ['revenue', 'profit', 'sales_count', 'items_sold']);
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
