<?php

namespace Database\Seeders;

use App\Models\ExpenseHeading;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ExpenseHeadingSeeder extends Seeder
{
    public function run(): void
    {
        ExpenseHeading::query()->delete();

        $headings = [
            'Office & Administration' => [
                'Office Rent',
                'Office Stationery Bill',
                'Blueprint & Printing Costs',
                'Salaries & Wages',
            ],
            'Technology & Software' => [
                'Computer Servicing',
                'PC Servicing',
                'Software & Technology',
                'Software Purchase',
                'Google Drive Purchase',
                'Software & Website Bill',
                'Internet Bill',
            ],
            'Business Operations' => [
                'Contractor Payment',
                'Supplier Payment',
                'Service Bill',
                'Consulting Bill',
                'Marketing & Business Development',
            ],
            'Bills & Utilities' => [
                'Insurance Bill',
                'Utility Bill',
                'Mobile Phone Bills',
                'Travel Bill',
            ],
            'Food & Entertainment' => [
                'Daily Bazaar for Official Meals',
                'Iftar Purchase',
                'Entertainment',
                'Donation',
            ],
            'Tax & VAT' => [
                'Tax & VAT Payment',
            ],
            'Other' => [
                'Others',
            ],
        ];

        foreach ($headings as $categoryName => $names) {
            $category = Category::where('name', $categoryName)->where('type', 'expense')->first();
            foreach ($names as $name) {
                ExpenseHeading::create([
                    'name' => $name,
                    'category_id' => $category?->id,
                ]);
            }
        }
    }
}
