<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'type'];

    public function incomeHeadings(): HasMany
    {
        return $this->hasMany(IncomeHeading::class);
    }

    public function expenseHeadings(): HasMany
    {
        return $this->hasMany(ExpenseHeading::class);
    }
}
