<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('advance_sum', 10, 2)->default(0)->after('total_sum');
            $table->decimal('deposit_sum', 10, 2)->default(0)->after('advance_sum');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['advance_sum', 'deposit_sum']);
        });
    }
};
