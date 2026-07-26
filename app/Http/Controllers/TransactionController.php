<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\IncomeHeading;
use App\Models\ExpenseHeading;
use App\Models\Project;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['incomeHeading', 'expenseHeading', 'project', 'attachments']);

        if ($request->has('type') && in_array($request->type, ['income', 'expense'])) {
            $query->where('type', $request->type);
        }

        $perPage = (int) $request->input('per_page', 15);
        $transactions = $query->latest('transaction_date')->paginate($perPage)->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'per_page']),
            'incomeHeadings' => IncomeHeading::with('category')->orderBy('name')->get(['id', 'name', 'category_id']),
            'expenseHeadings' => ExpenseHeading::with('category')->orderBy('name')->get(['id', 'name', 'category_id']),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'income_heading_id' => 'required_if:type,income|nullable|exists:income_headings,id',
            'expense_heading_id' => 'required_if:type,expense|nullable|exists:expense_headings,id',
            'project_id' => 'nullable|exists:projects,id',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $validated['date_code'] = Transaction::generateDateCode($validated['transaction_date']);

        $transaction = Transaction::create($validated);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');
            
            Attachment::create([
                'transaction_id' => $transaction->id,
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'description' => $request->input('attachment_description'),
            ]);
        }

        return redirect()->route('transactions.index');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'income_heading_id' => 'required_if:type,income|nullable|exists:income_headings,id',
            'expense_heading_id' => 'required_if:type,expense|nullable|exists:expense_headings,id',
            'project_id' => 'nullable|exists:projects,id',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $transaction->update($validated);

        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($transaction->attachments()->exists()) {
                $oldAttachment = $transaction->attachments()->first();
                Storage::disk('public')->delete($oldAttachment->path);
                $oldAttachment->delete();
            }

            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');
            
            Attachment::create([
                'transaction_id' => $transaction->id,
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'description' => $request->input('attachment_description'),
            ]);
        }

        return redirect()->route('transactions.index');
    }

    public function destroy(Transaction $transaction)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $transaction->delete();

        return redirect()->route('transactions.index');
    }

    public function destroyAttachment(Attachment $attachment)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        Storage::disk('public')->delete($attachment->path);
        $attachment->delete();

        return back();
    }
}
