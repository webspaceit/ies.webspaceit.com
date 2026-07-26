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
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
        
        $table->foreignId('income_heading_id')->nullable()->constrained()->onDelete('set null');
        $table->foreignId('expense_heading_id')->nullable()->constrained()->onDelete('set null');
        
        $table->enum('type', ['income', 'expense']);
        $table->date('transaction_date');
        $table->string('description');
        $table->decimal('amount', 15, 2);
        $table->text('remarks')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
