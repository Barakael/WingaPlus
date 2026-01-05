<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add category-specific fields to products table
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('category');
            $table->string('source')->nullable()->after('description');
            $table->string('imei')->nullable()->after('source');
            $table->string('ram')->nullable()->after('imei');
            $table->string('color')->nullable()->after('ram');
            $table->string('storage')->nullable()->after('color');
            
            // Add foreign key for category_id
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });

        // Seed default categories for all shops
        $shops = DB::table('shops')->get();
        $defaultCategories = ['Phones', 'Laptops', 'Accessories'];
        
        foreach ($shops as $shop) {
            foreach ($defaultCategories as $categoryName) {
                DB::table('categories')->insert([
                    'name' => $categoryName,
                    'description' => "Default {$categoryName} category",
                    'shop_id' => $shop->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'source', 'imei', 'ram', 'color', 'storage']);
        });

        // Remove default categories
        DB::table('categories')->whereIn('name', ['Phones', 'Laptops', 'Accessories'])->delete();
    }
};
