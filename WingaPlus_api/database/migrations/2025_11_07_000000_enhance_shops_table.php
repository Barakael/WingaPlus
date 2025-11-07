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
        Schema::table('shops', function (Blueprint $table) {
            $table->string('address')->nullable()->after('location');
            $table->string('phone')->nullable()->after('address');
            $table->string('email')->nullable()->after('phone');
            $table->foreignId('owner_id')->nullable()->after('email')->constrained('users')->onDelete('set null');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('owner_id');
            $table->text('description')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn(['address', 'phone', 'email', 'owner_id', 'status', 'description']);
        });
    }
};
