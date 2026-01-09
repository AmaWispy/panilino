<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            
            // Event Details
            $table->string('event_type');
            $table->integer('invited_count')->nullable();
            $table->date('event_date');
            
            // Delivery
            $table->string('delivery_address');
            $table->string('delivery_time');
            $table->decimal('delivery_price', 10, 2)->default(0);
            $table->timestamp('production_end_time')->nullable();
            
            // Cake Specs
            $table->string('cake_shape');
            $table->integer('cake_levels');
            $table->decimal('product_mass', 10, 2);
            $table->decimal('price_per_kg', 10, 2);
            
            // Content
            $table->string('filling');
            $table->json('add_ons_fruits')->nullable();
            $table->json('add_ons_decor')->nullable();
            $table->text('description_in_box')->nullable();
            $table->string('inscription')->nullable();
            
            // Stand
            $table->integer('stand_layers')->default(0);
            $table->decimal('stand_fee', 10, 2)->default(0);
            
            // Status & Totals
            $table->decimal('total_sum', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
