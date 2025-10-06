<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('product_id'); // Placeholder until products table exists / place a phone list api.
            $table->foreignId('salesman_id')->constrained('users')->onDelete('cascade');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->integer('quantity')->default(1); // Default to 1 if not specified
            $table->decimal('unit_price', 15, 2); //zoezi
            $table->decimal('selling_price', 15, 2); //bei ya mwisho
            $table->decimal('expenses', 15, 2)->nullable(); // added for Ganji calculation
            $table->decimal('total_amount', 15, 2);
            $table->integer('warranty_months')->nullable();
            $table->dateTime('sale_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
