<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrow_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipments')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->dateTime('borrowed_at');
            $table->dateTime('expected_return_at');
            $table->dateTime('returned_at')->nullable(); 
            $table->text('remarks')->nullable();
            $table->timestamps();

          
            $table->index(
                ['equipment_id', 'student_id', 'borrowed_at', 'expected_return_at', 'returned_at'],
                'borrow_records_lookup_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrow_records');
    }
};
