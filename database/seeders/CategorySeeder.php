<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::query()->delete();

        $expenseCategories = [
            'Office & Administration',
            'Technology & Software',
            'Business Operations',
            'Bills & Utilities',
            'Food & Entertainment',
            'Tax & VAT',
            'Other',
        ];

        $incomeCategories = [
            'Operating Income',
            'Non-Operating Income',
            'Other Income',
        ];

        foreach ($expenseCategories as $name) {
            Category::create(['name' => $name, 'type' => 'expense']);
        }

        foreach ($incomeCategories as $name) {
            Category::create(['name' => $name, 'type' => 'income']);
        }
    }
}
