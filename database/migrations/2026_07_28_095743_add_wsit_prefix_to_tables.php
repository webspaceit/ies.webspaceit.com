<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'attachments',
            'cache',
            'cache_locks',
            'categories',
            'expense_headings',
            'failed_jobs',
            'income_headings',
            'job_batches',
            'jobs',
            'migrations',
            'password_reset_tokens',
            'projects',
            'sessions',
            'settings',
            'transactions',
            'users',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasTable('wsit_' . $table)) {
                DB::statement("RENAME TABLE `{$table}` TO `wsit_{$table}`");
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'attachments',
            'cache',
            'cache_locks',
            'categories',
            'expense_headings',
            'failed_jobs',
            'income_headings',
            'job_batches',
            'jobs',
            'migrations',
            'password_reset_tokens',
            'projects',
            'sessions',
            'settings',
            'transactions',
            'users',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable('wsit_' . $table)) {
                DB::statement("RENAME TABLE `wsit_{$table}` TO `{$table}`");
            }
        }
    }
};
