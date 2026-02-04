<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Map old statuses to new ones for existing orders
        DB::table('orders')->where('status', 'pending')->update(['status' => 'inregistrata']);
        DB::table('orders')->where('status', 'in_production')->update(['status' => 'in_lucru']);
        DB::table('orders')->where('status', 'delivering')->update(['status' => 'preluata_sofer']);
        DB::table('orders')->where('status', 'completed')->update(['status' => 'livrata']);

        // Change default for new orders (MySQL/MariaDB)
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status VARCHAR(255) NOT NULL DEFAULT 'inregistrata'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status VARCHAR(255) NOT NULL DEFAULT 'pending'");
        }
    }
};
