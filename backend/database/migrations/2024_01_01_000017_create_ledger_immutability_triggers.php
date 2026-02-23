<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Prevent UPDATE on ledger_entries
        DB::unprepared('
            CREATE TRIGGER prevent_ledger_entry_update
            BEFORE UPDATE ON ledger_entries
            FOR EACH ROW
            BEGIN
                SIGNAL SQLSTATE "45000"
                SET MESSAGE_TEXT = "Ledger entries are immutable and cannot be updated.";
            END
        ');

        // Prevent DELETE on ledger_entries
        DB::unprepared('
            CREATE TRIGGER prevent_ledger_entry_delete
            BEFORE DELETE ON ledger_entries
            FOR EACH ROW
            BEGIN
                SIGNAL SQLSTATE "45000"
                SET MESSAGE_TEXT = "Ledger entries are immutable and cannot be deleted.";
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS prevent_ledger_entry_update');
        DB::unprepared('DROP TRIGGER IF EXISTS prevent_ledger_entry_delete');
    }
};
