<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->after('email');
            $table->date('wedding_date')->nullable()->after('date_of_birth');
            $table->string('children_birthdays')->nullable()->after('wedding_date');
            $table->string('profession')->nullable()->after('children_birthdays');
            $table->text('notes')->nullable()->after('profession');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['date_of_birth', 'wedding_date', 'children_birthdays', 'profession', 'notes']);
        });
    }
};
