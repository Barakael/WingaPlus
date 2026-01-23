<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phone_models', function (Blueprint $table) {
            $table->id();
            $table->string('brand'); // Apple, Samsung, Google
            $table->string('generation'); // iPhone 15, S24, Pixel 9
            $table->string('model'); // 15 Pro Max, S24 Ultra, 9 Pro XL
            $table->string('display_name'); // iPhone 15 Pro Max, Galaxy S24 Ultra
            $table->year('release_year')->nullable();
            $table->timestamps();
            
            $table->index(['brand', 'generation']);
        });

        Schema::create('phone_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phone_model_id')->constrained()->onDelete('cascade');
            $table->string('storage'); // 64GB, 128GB, 256GB, 512GB, 1TB, 2TB
            $table->timestamps();
            
            $table->unique(['phone_model_id', 'storage']);
        });

        Schema::create('phone_colors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phone_variant_id')->constrained()->onDelete('cascade');
            $table->string('color'); // Space Gray, Midnight, etc.
            $table->timestamps();
            
            $table->unique(['phone_variant_id', 'color']);
            $table->index('phone_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phone_colors');
        Schema::dropIfExists('phone_variants');
        Schema::dropIfExists('phone_models');
    }
};
