<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeHeadingController;
use App\Http\Controllers\ExpenseHeadingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'name' => config('app.name', 'Income Expense System'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('income-headings', IncomeHeadingController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('expense-headings', ExpenseHeadingController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('transactions', TransactionController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::delete('attachments/{attachment}', [TransactionController::class, 'destroyAttachment'])->name('attachments.destroy');
    Route::resource('projects', ProjectController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');

    Route::resource('users', UserManagementController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('/users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.role.update');

    Route::get('/settings/branding', [SettingController::class, 'branding'])->name('settings.branding');
    Route::put('/settings/menu-order', [SettingController::class, 'updateMenuOrder'])->name('settings.menu-order.update');
    Route::put('/settings/letterhead', [SettingController::class, 'updateLetterhead'])->name('settings.letterhead.update');
    Route::put('/settings/logo', [SettingController::class, 'updateLogo'])->name('settings.logo.update');
    Route::delete('/settings/logo', [SettingController::class, 'destroyLogo'])->name('settings.logo.destroy');
    Route::put('/settings/favicon', [SettingController::class, 'updateFavicon'])->name('settings.favicon.update');
    Route::delete('/settings/favicon', [SettingController::class, 'destroyFavicon'])->name('settings.favicon.destroy');
    Route::put('/settings/color-scheme', [SettingController::class, 'updateColorScheme'])->name('settings.color-scheme.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
