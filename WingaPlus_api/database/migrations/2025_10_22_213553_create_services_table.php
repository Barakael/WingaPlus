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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('device_name');
            $table->text('issue');
            $table->string('customer_name');
            $table->string('store_name');
            $table->decimal('issue_price', 10, 2);
            $table->decimal('service_price', 10, 2);
            $table->decimal('final_price', 10, 2);
            $table->decimal('cost_price', 10, 2);
            $table->decimal('ganji', 10, 2);
            $table->string('status')->default('completed');
            $table->foreignId('salesman_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
