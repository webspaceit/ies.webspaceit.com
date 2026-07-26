<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount(['incomeHeadings', 'expenseHeadings']);

        if ($request->has('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }

        $categories = $query->orderBy('type')->orderBy('name')->get();

        return Inertia::render('Categories/Index', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        Category::create($validated);

        return redirect()->route('categories.index', ['type' => $request->type]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id . ',type,' . $category->type,
            'type' => 'required|in:income,expense',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index', ['type' => $request->type]);
    }

    public function destroy(Category $category)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $type = $category->type;
        $category->delete();

        return redirect()->route('categories.index', ['type' => $type]);
    }
}
