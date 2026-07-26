<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Project::insert([
            ['name' => 'E-Commerce Website', 'description' => 'Full-stack e-commerce platform for a local business', 'start_date' => '2026-01-15', 'end_date' => '2026-04-30', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mobile App UI', 'description' => 'React Native app design for a healthcare startup', 'start_date' => '2026-03-01', 'end_date' => '2026-06-30', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Portfolio Website', 'description' => 'Personal portfolio site refresh', 'start_date' => '2026-05-10', 'end_date' => '2026-06-15', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $transactions = [
            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-01-05', 'description' => 'Monthly Salary', 'amount' => 45000],
            ['income_heading_id' => 2, 'project_id' => 1, 'type' => 'income', 'transaction_date' => '2026-01-20', 'description' => 'E-Commerce Milestone 1', 'amount' => 20000],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-01-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-01-10', 'description' => 'Monthly Groceries', 'amount' => 5500],
            ['expense_heading_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-01-15', 'description' => 'Electricity Bill', 'amount' => 2200],
            ['expense_heading_id' => 5, 'type' => 'expense', 'transaction_date' => '2026-01-20', 'description' => 'Tea & Snacks', 'amount' => 800],
            ['expense_heading_id' => 6, 'type' => 'expense', 'transaction_date' => '2026-01-18', 'description' => 'Broadband Bill', 'amount' => 1500],
            ['expense_heading_id' => 7, 'project_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-01-22', 'description' => 'Domain & Hosting', 'amount' => 3500],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-02-05', 'description' => 'Monthly Salary', 'amount' => 45000],
            ['income_heading_id' => 2, 'project_id' => 1, 'type' => 'income', 'transaction_date' => '2026-02-12', 'description' => 'E-Commerce Milestone 2', 'amount' => 25000],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-02-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-02-08', 'description' => 'Monthly Groceries', 'amount' => 5000],
            ['expense_heading_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-02-15', 'description' => 'Electricity Bill', 'amount' => 1900],
            ['expense_heading_id' => 4, 'type' => 'expense', 'transaction_date' => '2026-02-18', 'description' => 'Bus Pass', 'amount' => 1500],
            ['expense_heading_id' => 7, 'project_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-02-20', 'description' => 'VS Code Extension License', 'amount' => 2000],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-03-05', 'description' => 'Monthly Salary', 'amount' => 45000],
            ['income_heading_id' => 3, 'type' => 'income', 'transaction_date' => '2026-03-20', 'description' => 'Stock Dividend', 'amount' => 3500],
            ['income_heading_id' => 2, 'project_id' => 2, 'type' => 'income', 'transaction_date' => '2026-03-25', 'description' => 'Mobile App Design Deposit', 'amount' => 18000],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-03-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-03-07', 'description' => 'Monthly Groceries', 'amount' => 6200],
            ['expense_heading_id' => 5, 'type' => 'expense', 'transaction_date' => '2026-03-12', 'description' => 'Office Snacks', 'amount' => 1200],
            ['expense_heading_id' => 6, 'type' => 'expense', 'transaction_date' => '2026-03-15', 'description' => 'Broadband Bill', 'amount' => 1500],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-03-18', 'description' => 'Printer Paper & Ink', 'amount' => 900],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-04-05', 'description' => 'Monthly Salary', 'amount' => 47000],
            ['income_heading_id' => 4, 'type' => 'income', 'transaction_date' => '2026-04-10', 'description' => 'IT Consulting - Client A', 'amount' => 8000],
            ['income_heading_id' => 2, 'project_id' => 1, 'type' => 'income', 'transaction_date' => '2026-04-28', 'description' => 'E-Commerce Final Payment', 'amount' => 15000],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-04-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-04-09', 'description' => 'Monthly Groceries', 'amount' => 5800],
            ['expense_heading_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-04-16', 'description' => 'Electricity Bill', 'amount' => 2800],
            ['expense_heading_id' => 5, 'type' => 'expense', 'transaction_date' => '2026-04-22', 'description' => 'Tea & Snacks', 'amount' => 950],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-05-05', 'description' => 'Monthly Salary', 'amount' => 47000],
            ['income_heading_id' => 2, 'project_id' => 2, 'type' => 'income', 'transaction_date' => '2026-05-15', 'description' => 'Mobile App Design Final', 'amount' => 22000],
            ['income_heading_id' => 5, 'type' => 'income', 'transaction_date' => '2026-05-20', 'description' => 'Template Sales', 'amount' => 4500],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-05-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-05-08', 'description' => 'Monthly Groceries', 'amount' => 5300],
            ['expense_heading_id' => 4, 'type' => 'expense', 'transaction_date' => '2026-05-12', 'description' => 'Fuel', 'amount' => 2000],
            ['expense_heading_id' => 7, 'project_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-05-15', 'description' => 'Figma Subscription', 'amount' => 1800],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-06-05', 'description' => 'Monthly Salary', 'amount' => 47000],
            ['income_heading_id' => 2, 'project_id' => 3, 'type' => 'income', 'transaction_date' => '2026-06-12', 'description' => 'Portfolio Website Payment', 'amount' => 10000],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-06-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-06-06', 'description' => 'Monthly Groceries', 'amount' => 6000],
            ['expense_heading_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-06-14', 'description' => 'Electricity Bill', 'amount' => 3200],
            ['expense_heading_id' => 6, 'type' => 'expense', 'transaction_date' => '2026-06-15', 'description' => 'Broadband Bill', 'amount' => 1500],
            ['expense_heading_id' => 5, 'type' => 'expense', 'transaction_date' => '2026-06-25', 'description' => 'Team Lunch Snacks', 'amount' => 1800],

            ['income_heading_id' => 1, 'type' => 'income', 'transaction_date' => '2026-07-05', 'description' => 'Monthly Salary', 'amount' => 47000],
            ['income_heading_id' => 4, 'type' => 'income', 'transaction_date' => '2026-07-10', 'description' => 'System Design Consulting', 'amount' => 12000],
            ['income_heading_id' => 5, 'type' => 'income', 'transaction_date' => '2026-07-18', 'description' => 'UI Kit Sales', 'amount' => 6500],
            ['expense_heading_id' => 1, 'type' => 'expense', 'transaction_date' => '2026-07-01', 'description' => 'House Rent', 'amount' => 12000],
            ['expense_heading_id' => 2, 'type' => 'expense', 'transaction_date' => '2026-07-08', 'description' => 'Monthly Groceries', 'amount' => 5700],
            ['expense_heading_id' => 4, 'type' => 'expense', 'transaction_date' => '2026-07-12', 'description' => 'Auto Rickshaw Fare', 'amount' => 800],
            ['expense_heading_id' => 7, 'type' => 'expense', 'transaction_date' => '2026-07-15', 'description' => 'GitHub Copilot', 'amount' => 1400],
            ['expense_heading_id' => 3, 'type' => 'expense', 'transaction_date' => '2026-07-20', 'description' => 'Electricity Bill', 'amount' => 2600],

            // Technology & Software (headings 8-11)
            ['expense_heading_id' => 8, 'type' => 'expense', 'transaction_date' => '2026-01-25', 'description' => 'Adobe Creative Suite License', 'amount' => 4500],
            ['expense_heading_id' => 9, 'type' => 'expense', 'transaction_date' => '2026-03-10', 'description' => 'Google Drive 2TB Plan', 'amount' => 1200],
            ['expense_heading_id' => 10, 'type' => 'expense', 'transaction_date' => '2026-05-22', 'description' => 'Hosting Renewal - AWS', 'amount' => 8500],
            ['expense_heading_id' => 11, 'type' => 'expense', 'transaction_date' => '2026-07-01', 'description' => 'Fiber Internet Monthly', 'amount' => 2200],

            // Business Operations (headings 12-16)
            ['expense_heading_id' => 12, 'type' => 'expense', 'transaction_date' => '2026-02-15', 'description' => 'Freelance Developer Payment', 'amount' => 15000],
            ['expense_heading_id' => 13, 'type' => 'expense', 'transaction_date' => '2026-04-10', 'description' => 'Raw Materials Supplier', 'amount' => 22000],
            ['expense_heading_id' => 14, 'type' => 'expense', 'transaction_date' => '2026-06-05', 'description' => 'Cloud Server Service Bill', 'amount' => 6500],
            ['expense_heading_id' => 15, 'type' => 'expense', 'transaction_date' => '2026-03-28', 'description' => 'Legal Consulting Fee', 'amount' => 5000],
            ['expense_heading_id' => 16, 'type' => 'expense', 'transaction_date' => '2026-05-10', 'description' => 'Google Ads Campaign', 'amount' => 8000],

            // Bills & Utilities (headings 17-20)
            ['expense_heading_id' => 17, 'type' => 'expense', 'transaction_date' => '2026-01-30', 'description' => 'Business Insurance Premium', 'amount' => 9500],
            ['expense_heading_id' => 18, 'type' => 'expense', 'transaction_date' => '2026-04-20', 'description' => 'Water Bill Q2', 'amount' => 1800],
            ['expense_heading_id' => 19, 'type' => 'expense', 'transaction_date' => '2026-06-28', 'description' => 'Grameenphone Postpaid', 'amount' => 1600],
            ['expense_heading_id' => 20, 'type' => 'expense', 'transaction_date' => '2026-02-25', 'description' => 'Client Visit Travel', 'amount' => 7200],

            // Food & Entertainment (headings 21-24)
            ['expense_heading_id' => 21, 'type' => 'expense', 'transaction_date' => '2026-03-05', 'description' => 'Team Lunch Order', 'amount' => 3500],
            ['expense_heading_id' => 22, 'type' => 'expense', 'transaction_date' => '2026-04-01', 'description' => 'Iftar Items for Team', 'amount' => 4200],
            ['expense_heading_id' => 23, 'type' => 'expense', 'transaction_date' => '2026-05-28', 'description' => 'Movie Tickets - Team Outing', 'amount' => 2400],
            ['expense_heading_id' => 24, 'type' => 'expense', 'transaction_date' => '2026-06-15', 'description' => 'Charity Donation - Eid', 'amount' => 5000],

            // Tax & VAT (heading 25)
            ['expense_heading_id' => 25, 'type' => 'expense', 'transaction_date' => '2026-07-10', 'description' => 'VAT Payment Q2', 'amount' => 18000],

            // Other (heading 26)
            ['expense_heading_id' => 26, 'type' => 'expense', 'transaction_date' => '2026-07-22', 'description' => 'Miscellaneous Office Expense', 'amount' => 3200],
        ];

        foreach ($transactions as $tx) {
            Transaction::create($tx);
        }
    }
}
