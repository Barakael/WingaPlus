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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salesman_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['target_met', 'streak', 'milestone', 'performance']);
            $table->string('title');
            $table->text('description');
            $table->string('badge_icon');
            $table->integer('points')->default(0);
            $table->timestamp('unlocked_at');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
