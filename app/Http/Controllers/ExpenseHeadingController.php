<?php

namespace App\Http\Controllers;

use App\Models\ExpenseHeading;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseHeadingController extends Controller
{
    public function index()
    {
        $headings = ExpenseHeading::with('category')->withCount('transactions')->latest()->get();
        $categories = Category::where('type', 'expense')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('ExpenseHeadings/Index', [
            'headings' => $headings,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:expense_headings,name',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        ExpenseHeading::create($validated);

        return redirect()->route('expense-headings.index');
    }

    public function update(Request $request, ExpenseHeading $expenseHeading)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:expense_headings,name,' . $expenseHeading->id,
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $expenseHeading->update($validated);

        return redirect()->route('expense-headings.index');
    }

    public function destroy(ExpenseHeading $expenseHeading)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $expenseHeading->delete();

        return redirect()->route('expense-headings.index');
    }
}
