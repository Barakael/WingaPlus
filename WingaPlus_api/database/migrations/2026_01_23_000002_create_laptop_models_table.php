<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laptop_models', function (Blueprint $table) {
            $table->id();
            $table->string('brand'); // Apple, Dell, HP, Lenovo, Asus, Acer
            $table->string('series'); // MacBook Pro, XPS, ThinkPad
            $table->string('model'); // MacBook Pro 16", XPS 13, ThinkPad X1 Carbon
            $table->string('display_name'); // MacBook Pro 16" M3 (2023)
            $table->string('processor_type')->nullable(); // M1, M2, M3, Intel i5/i7/i9, AMD Ryzen
            $table->year('release_year')->nullable();
            $table->timestamps();
            
            $table->index(['brand', 'series']);
        });

        Schema::create('laptop_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laptop_model_id')->constrained()->onDelete('cascade');
            $table->string('ram'); // 8GB, 16GB, 32GB, 64GB
            $table->string('storage'); // 256GB SSD, 512GB SSD, 1TB SSD, 2TB SSD
            $table->string('color')->nullable(); // Space Gray, Silver, Black, etc.
            $table->timestamps();
            
            $table->index('laptop_model_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laptop_variants');
        Schema::dropIfExists('laptop_models');
    }
};
