<?php

namespace App\Http\Controllers;

use App\Models\IncomeHeading;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeHeadingController extends Controller
{
    public function index()
    {
        $headings = IncomeHeading::with('category')->withCount('transactions')->latest()->get();
        $categories = Category::where('type', 'income')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('IncomeHeadings/Index', [
            'headings' => $headings,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:income_headings,name',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        IncomeHeading::create($validated);

        return redirect()->route('income-headings.index');
    }

    public function update(Request $request, IncomeHeading $incomeHeading)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:income_headings,name,' . $incomeHeading->id,
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $incomeHeading->update($validated);

        return redirect()->route('income-headings.index');
    }

    public function destroy(IncomeHeading $incomeHeading)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $incomeHeading->delete();

        return redirect()->route('income-headings.index');
    }
}
