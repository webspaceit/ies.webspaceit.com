<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Transaction $transaction) {
            if (empty($transaction->date_code)) {
                $transaction->date_code = self::generateDateCode(
                    $transaction->transaction_date ?? now()->toDateString()
                );
            }
        });
    }

    protected $fillable = [
        'project_id',
        'income_heading_id',
        'expense_heading_id',
        'type',
        'transaction_date',
        'date_code',
        'description',
        'amount',
        'remarks',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function incomeHeading(): BelongsTo
    {
        return $this->belongsTo(IncomeHeading::class);
    }

    public function expenseHeading(): BelongsTo
    {
        return $this->belongsTo(ExpenseHeading::class);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public static function generateDateCode(string $transactionDate): string
    {
        $date = \Carbon\Carbon::parse($transactionDate);
        $prefix = 'DC-' . $date->format('dmy') . '-';

        $lastCode = static::where('date_code', 'like', $prefix . '%')
            ->orderBy('date_code', 'desc')
            ->value('date_code');

        if ($lastCode) {
            $sequence = (int) substr($lastCode, -3) + 1;
        } else {
            $sequence = 1;
        }

        return $prefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
