<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function exportPdf(Request $request)
    {
        $period = $request->input('period', 'all');
        $date = $request->input('date', now()->format('Y-m-d'));
        $startDateParam = $request->input('start_date');
        $endDateParam = $request->input('end_date');
        $type = $request->input('type');
        $categoryId = $request->input('category_id');

        $label = 'All Time';
        $startDate = null;
        $endDate = null;
        $periodText = 'All Time';

        if ($period === 'monthly') {
            $carbon = Carbon::parse($date);
            $startDate = $carbon->copy()->startOfMonth();
            $endDate = $carbon->copy()->endOfMonth();
            $label = $carbon->format('F Y');
            $periodText = 'Monthly';
        } elseif ($period === 'half_yearly') {
            $carbon = Carbon::parse($date);
            $semester = $carbon->month <= 6 ? 1 : 2;
            $startMonth = $semester === 1 ? 1 : 7;
            $startDate = $carbon->copy()->month($startMonth)->startOfMonth();
            $endDate = $carbon->copy()->month($startMonth + 5)->endOfMonth();
            $label = 'H' . $semester . ' ' . $carbon->format('Y');
            $periodText = 'Half Yearly';
        } elseif ($period === 'custom' && $startDateParam && $endDateParam) {
            $startDate = Carbon::parse($startDateParam)->startOfDay();
            $endDate = Carbon::parse($endDateParam)->endOfDay();
            $label = $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y');
            $periodText = 'Custom Range';
        } elseif ($period === 'yearly') {
            $carbon = Carbon::parse($date);
            $startDate = $carbon->copy()->startOfYear();
            $endDate = $carbon->copy()->endOfYear();
            $label = $carbon->format('Y');
            $periodText = 'Yearly';
        }

        $query = Transaction::with(['incomeHeading.category', 'expenseHeading.category', 'project']);

        if ($startDate && $endDate) {
            $query->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        if ($type && in_array($type, ['income', 'expense'])) {
            $query->where('type', $type);
        }

        if ($categoryId) {
            $query->where(function ($q) use ($categoryId) {
                $q->whereHas('incomeHeading', function ($q2) use ($categoryId) {
                    $q2->where('category_id', $categoryId);
                })->orWhereHas('expenseHeading', function ($q2) use ($categoryId) {
                    $q2->where('category_id', $categoryId);
                });
            });
        }

        $totalIncome = $query->clone()->where('type', 'income')->sum('amount');
        $totalExpense = $query->clone()->where('type', 'expense')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        $transactions = $query->latest('transaction_date')->get();

        // Prepare transactions for PDF
        $pdfTransactions = $transactions->map(function ($tx) {
            return (object) [
                'transaction_date_formatted' => Carbon::parse($tx->transaction_date)->format('d-M-Y'),
                'type' => $tx->type,
                'heading_name' => $tx->income_heading?->name ?? $tx->expense_heading?->name ?? '-',
                'category_name' => $tx->income_heading?->category?->name ?? $tx->expense_heading?->category?->name ?? '-',
                'description' => $tx->description,
                'project_name' => $tx->project?->name ?? '-',
                'amount' => $tx->amount,
            ];
        });

        // Determine what to show
        $showIncome = !$type || $type === 'income';
        $showExpense = !$type || $type === 'expense';
        $showBalance = !$type;

        // Determine report title
        $reportTitle = 'Income Report';
        if ($type === 'expense') {
            $reportTitle = 'Expense Report';
        } elseif (!$type || $type === 'all') {
            $reportTitle = 'Income & Expense Report';
        }

        $data = [
            'companyName' => Setting::getValue('letterhead_company_name', config('app.name', 'Income Expense System')),
            'headerText' => Setting::getValue('letterhead_header_text', ''),
            'subHeaderText' => Setting::getValue('letterhead_subheader_text', ''),
            'footerText' => Setting::getValue('letterhead_footer_text', 'This is a computer-generated report. No signature is required.'),
            'showLogo' => Setting::getValue('letterhead_show_logo', '1'),
            'logoPath' => Setting::getValue('logo_path'),
            'title' => $reportTitle,
            'periodLabel' => $label . ' | ' . $periodText,
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netBalance' => $netBalance,
            'showIncome' => $showIncome,
            'showExpense' => $showExpense,
            'showBalance' => $showBalance,
            'transactions' => $pdfTransactions,
            'generatedAt' => now()->format('d-M-Y H:i:s'),
        ];

        $pdf = Pdf::loadView('reports.pdf', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('report-' . now()->format('Y-m-d-H-i-s') . '.pdf');
    }

    public function index(Request $request)
    {
        $period = $request->input('period', 'all');
        $date = $request->input('date', now()->format('Y-m-d'));
        $startDateParam = $request->input('start_date');
        $endDateParam = $request->input('end_date');
        $type = $request->input('type');
        $categoryId = $request->input('category_id');
        $perPage = $request->input('per_page', 15);

        if ($perPage === 'all') {
            $perPage = 'all';
        } else {
            $perPage = (int) $perPage ?: 15;
        }

        $label = 'All Time';
        $startDate = null;
        $endDate = null;

        if ($period === 'monthly') {
            $carbon = Carbon::parse($date);
            $startDate = $carbon->copy()->startOfMonth();
            $endDate = $carbon->copy()->endOfMonth();
            $label = $carbon->format('F Y');
        } elseif ($period === 'half_yearly') {
            $carbon = Carbon::parse($date);
            $semester = $carbon->month <= 6 ? 1 : 2;
            $startMonth = $semester === 1 ? 1 : 7;
            $startDate = $carbon->copy()->month($startMonth)->startOfMonth();
            $endDate = $carbon->copy()->month($startMonth + 5)->endOfMonth();
            $label = 'H' . $semester . ' ' . $carbon->format('Y');
        } elseif ($period === 'custom' && $startDateParam && $endDateParam) {
            $startDate = Carbon::parse($startDateParam)->startOfDay();
            $endDate = Carbon::parse($endDateParam)->endOfDay();
            $label = $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y');
        } elseif ($period === 'yearly') {
            $carbon = Carbon::parse($date);
            $startDate = $carbon->copy()->startOfYear();
            $endDate = $carbon->copy()->endOfYear();
            $label = $carbon->format('Y');
        }

        $query = Transaction::with(['incomeHeading.category', 'expenseHeading.category', 'project', 'attachments']);

        if ($startDate && $endDate) {
            $query->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        if ($type && in_array($type, ['income', 'expense'])) {
            $query->where('type', $type);
        }

        if ($categoryId) {
            $query->where(function ($q) use ($categoryId) {
                $q->whereHas('incomeHeading', function ($q2) use ($categoryId) {
                    $q2->where('category_id', $categoryId);
                })->orWhereHas('expenseHeading', function ($q2) use ($categoryId) {
                    $q2->where('category_id', $categoryId);
                });
            });
        }

        $allQuery = clone $query;
        $total = $allQuery->count();

        $totalIncome = $query->clone()->where('type', 'income')->sum('amount');
        $totalExpense = $query->clone()->where('type', 'expense')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        $transactions = $query->latest('transaction_date')->paginate($perPage === 'all' ? $total : $perPage);

        $categoriesQuery = Category::with(['incomeHeadings', 'expenseHeadings']);
        if ($type && in_array($type, ['income', 'expense'])) {
            $categoriesQuery->where('type', $type);
        }
        $categories = $categoriesQuery->orderBy('name')->get();

        return Inertia::render('Reports/Index', [
            'transactions' => $transactions,
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'netBalance' => $netBalance,
                'label' => $label,
                'startDate' => $startDate?->toDateString(),
                'endDate' => $endDate?->toDateString(),
            ],
            'categories' => $categories,
            'period' => $period,
            'date' => $date,
            'startDate' => $startDateParam ?? $startDate?->format('Y-m-d'),
            'endDate' => $endDateParam ?? $endDate?->format('Y-m-d'),
            'type' => $type,
            'categoryId' => $categoryId,
            'perPage' => $perPage === 'all' ? 'all' : (int) $perPage,
            'total' => $total,
        ]);
    }

}
