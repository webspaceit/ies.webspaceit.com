<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\IncomeHeading;
use Illuminate\Database\Seeder;

class IncomeHeadingSeeder extends Seeder
{
    public function run(): void
    {
        IncomeHeading::query()->delete();

        $operatingCategory = Category::where('name', 'Operating Income')->where('type', 'income')->first();
        $nonOperatingCategory = Category::where('name', 'Non-Operating Income')->where('type', 'income')->first();
        $otherCategory = Category::where('name', 'Other Income')->where('type', 'income')->first();

        $headings = [
            ['name' => 'Salary', 'category_id' => $operatingCategory?->id],
            ['name' => 'Freelance', 'category_id' => $operatingCategory?->id],
            ['name' => 'Investment Return', 'category_id' => $nonOperatingCategory?->id],
            ['name' => 'Consulting', 'category_id' => $operatingCategory?->id],
            ['name' => 'Sales', 'category_id' => $otherCategory?->id],
        ];

        foreach ($headings as $heading) {
            IncomeHeading::create($heading);
        }
    }
}
