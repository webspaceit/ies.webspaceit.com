<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $year = (int) $request->input('year', now()->year);

        $totalIncome = Transaction::whereYear('transaction_date', $year)->where('type', 'income')->sum('amount');
        $totalExpenses = Transaction::whereYear('transaction_date', $year)->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpenses;

        $monthlyStats = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthIncome = Transaction::whereYear('transaction_date', $year)
                ->whereMonth('transaction_date', $m)
                ->where('type', 'income')
                ->sum('amount');
            $monthExpense = Transaction::whereYear('transaction_date', $year)
                ->whereMonth('transaction_date', $m)
                ->where('type', 'expense')
                ->sum('amount');
            $monthlyStats[] = [
                'month' => $m,
                'month_name' => now()->startOfYear()->addMonths($m - 1)->format('F'),
                'income' => (float) $monthIncome,
                'expense' => (float) $monthExpense,
                'balance' => (float) $monthIncome - (float) $monthExpense,
            ];
        }

        $recentTransactions = Transaction::with(['incomeHeading.category', 'expenseHeading.category', 'project'])
            ->latest('transaction_date')
            ->limit(10)
            ->get();

        $incomeByCategory = Transaction::where('transactions.type', 'income')
            ->whereYear('transaction_date', $year)
            ->join('income_headings', 'transactions.income_heading_id', '=', 'income_headings.id')
            ->join('categories', 'income_headings.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, SUM(transactions.amount) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $expenseByCategory = Transaction::where('transactions.type', 'expense')
            ->whereYear('transaction_date', $year)
            ->join('expense_headings', 'transactions.expense_heading_id', '=', 'expense_headings.id')
            ->join('categories', 'expense_headings.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, SUM(transactions.amount) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $thisMonth = now()->month;

        $monthlySnacks = Transaction::where('transactions.type', 'expense')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $thisMonth)
            ->join('expense_headings', 'transactions.expense_heading_id', '=', 'expense_headings.id')
            ->join('categories', 'expense_headings.category_id', '=', 'categories.id')
            ->where('categories.name', 'Food & Entertainment')
            ->sum('transactions.amount');

        $monthlyUtility = Transaction::where('transactions.type', 'expense')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $thisMonth)
            ->join('expense_headings', 'transactions.expense_heading_id', '=', 'expense_headings.id')
            ->join('categories', 'expense_headings.category_id', '=', 'categories.id')
            ->where('categories.name', 'Bills & Utilities')
            ->sum('transactions.amount');

        $monthlyOffice = Transaction::where('transactions.type', 'expense')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $thisMonth)
            ->join('expense_headings', 'transactions.expense_heading_id', '=', 'expense_headings.id')
            ->join('categories', 'expense_headings.category_id', '=', 'categories.id')
            ->where('categories.name', 'Office & Administration')
            ->sum('transactions.amount');

        $monthlyTech = Transaction::where('transactions.type', 'expense')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $thisMonth)
            ->join('expense_headings', 'transactions.expense_heading_id', '=', 'expense_headings.id')
            ->join('categories', 'expense_headings.category_id', '=', 'categories.id')
            ->where('categories.name', 'Technology & Software')
            ->sum('transactions.amount');

        $users = null;
        if (auth()->user()->isAdmin()) {
            $users = User::select('id', 'name', 'email', 'role', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Dashboard', [
            'totalIncome' => (float) $totalIncome,
            'totalExpenses' => (float) $totalExpenses,
            'balance' => (float) $balance,
            'year' => $year,
            'monthlyStats' => $monthlyStats,
            'recentTransactions' => $recentTransactions,
            'incomeByCategory' => $incomeByCategory,
            'expenseByCategory' => $expenseByCategory,
            'monthlySnacks' => (float) $monthlySnacks,
            'monthlyUtility' => (float) $monthlyUtility,
            'monthlyOffice' => (float) $monthlyOffice,
            'monthlyTech' => (float) $monthlyTech,
            'users' => $users,
        ]);
    }
}
