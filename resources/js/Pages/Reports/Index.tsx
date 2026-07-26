import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    transaction_date: string;
    date_code: string;
    remarks: string | null;
    income_heading: { id: number; name: string; category: { id: number; name: string } | null } | null;
    expense_heading: { id: number; name: string; category: { id: number; name: string } | null } | null;
    project: { id: number; name: string } | null;
    attachments: { id: number; filename: string; path: string }[];
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Summary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    label: string;
    startDate: string;
    endDate: string;
}

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    income_headings: { id: number; name: string }[];
    expense_headings: { id: number; name: string }[];
}

interface Props {
    transactions: PaginatedTransactions;
    summary: Summary;
    categories: Category[];
    period: string;
    date: string;
    startDate: string;
    endDate: string;
    type: string | null;
    categoryId: string | null;
    perPage: number | string;
    total: number;
    letterhead: {
        company_name: string;
        header_text: string;
        subheader_text: string;
        footer_text: string;
        show_logo: string;
    };
    settings: {
        logo_path: string | null;
    };
}

function formatCurrency(amount: number): string {
    return amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }) + ' Tk.';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ /g, '-');
}

export default function Reports({ transactions, summary, categories, period, date, startDate, endDate, type, categoryId, perPage, total, letterhead, settings }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [selectedDate, setSelectedDate] = useState(date);
    const [customStart, setCustomStart] = useState(startDate);
    const [customEnd, setCustomEnd] = useState(endDate);
    const [selectedType, setSelectedType] = useState<string>(type || 'all');
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');
    const [selectedPerPage, setSelectedPerPage] = useState<number | string>(perPage);

    const buildParams = (overrides: Record<string, string> = {}): Record<string, string> => {
        const params: Record<string, string> = {};
        params.period = overrides.period ?? selectedPeriod;
        if (params.period === 'custom') {
            params.start_date = overrides.start_date ?? customStart;
            params.end_date = overrides.end_date ?? customEnd;
        } else if (params.period !== 'all') {
            params.date = overrides.date ?? selectedDate;
        }
        const t = overrides.type ?? selectedType;
        if (t !== 'all') params.type = t;
        const cat = overrides.category_id ?? selectedCategory;
        if (cat) params.category_id = cat;
        params.per_page = overrides.per_page ?? String(selectedPerPage);
        if (overrides.page) params.page = overrides.page;
        return params;
    };

    const applyFilter = (newPeriod: string, newDate?: string) => {
        setSelectedPeriod(newPeriod);
        if (newDate !== undefined) setSelectedDate(newDate);
        router.get(route('reports.index'), buildParams({ period: newPeriod, ...(newDate !== undefined ? { date: newDate } : {}) }), { preserveState: true });
    };

    const applyCustomRange = () => {
        setSelectedPeriod('custom');
        router.get(route('reports.index'), buildParams({ period: 'custom' }), { preserveState: true });
    };

    const applyTypeFilter = (newType: string) => {
        setSelectedType(newType);
        setSelectedCategory('');
        router.get(route('reports.index'), buildParams({ type: newType, category_id: '' }), { preserveState: true });
    };

    const applyCategoryFilter = (newCategoryId: string) => {
        setSelectedCategory(newCategoryId);
        router.get(route('reports.index'), buildParams({ category_id: newCategoryId }), { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Reports</h2>}
        >
            <Head title="Reports" />
            <style>{`
                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #d1d5db;
                    font-size: 0.875rem;
                }
                .report-table thead {
                    background-color: #007C47;
                }
                .report-table thead th {
                    padding: 10px 12px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.75rem;
                    color: #ffffff;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: 1px solid #006b3d;
                    white-space: nowrap;
                }
                .report-table tbody td {
                    padding: 10px 12px;
                    border: 1px solid #e5e7eb;
                    vertical-align: middle;
                }
                .report-table tbody tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                .report-table tbody tr:hover {
                    background-color: #f0fdf4;
                }
                .report-table tbody tr {
                    transition: background-color 0.15s ease;
                }
                .type-badge-prof {
                    display: inline-block;
                    padding: 2px 10px;
                    border-radius: 9999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .type-badge-prof.income {
                    background-color: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }
                .type-badge-prof.expense {
                    background-color: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                }
                .amount-cell {
                    text-align: right;
                    font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }
                .amount-cell.income { color: #16a34a; }
                .amount-cell.expense { color: #dc2626; }

                @media print {
                    aside, nav, .no-print, header, .sticky { display: none !important; }
                    .print-only { display: block !important; }
                    .pl-64 { padding-left: 0 !important; }
                    body { background: white !important; margin: 0 !important; }
                    .shadow { box-shadow: none !important; }

                    .py-12 { padding: 0 !important; }
                    .px-6 { padding-left: 0 !important; padding-right: 0 !important; }
                    .w-full { width: 100% !important; }

                    .overflow-x-auto { overflow: visible !important; }

                    .report-table {
                        font-size: 7pt;
                        width: 100%;
                    }
                    .report-table thead th {
                        padding: 5px 4px;
                        font-size: 6.5pt;
                    }
                    .report-table tbody td {
                        padding: 4px;
                        font-size: 7pt;
                    }
                    .type-badge-prof {
                        font-size: 6pt;
                        padding: 1px 5px;
                    }

                    .mb-6 { margin-bottom: 10px !important; }
                    .mb-4 { margin-bottom: 6px !important; }
                    .gap-4 { gap: 6px !important; }
                    .gap-2 { gap: 4px !important; }

                    .grid { display: grid !important; }
                    .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }

                    .shadow-sm, .shadow { box-shadow: none !important; }

                    .rounded-lg, .rounded { border-radius: 0 !important; }

                    .bg-gray-50, .bg-white { background-color: white !important; }
                    .bg-gray-100 { background-color: #f3f4f6 !important; }

                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }

                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; }
                    thead { display: table-header-group; }
                }
            `}</style>

            <div className="py-12">
                <div className="w-full px-6">
                    {/* Print Buttons */}
                    <div className="mb-4 flex justify-end gap-2 no-print">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Print
                        </button>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams();
                                if (selectedPeriod !== 'all') {
                                    params.append('period', selectedPeriod);
                                    if (selectedPeriod === 'custom') {
                                        params.append('start_date', customStart);
                                        params.append('end_date', customEnd);
                                    } else {
                                        params.append('date', selectedDate);
                                    }
                                }
                                if (selectedType !== 'all') {
                                    params.append('type', selectedType);
                                }
                                if (selectedCategory) {
                                    params.append('category_id', selectedCategory);
                                }
                                params.append('per_page', 'all');

                                window.location.href = route('reports.export-pdf') + '?' + params.toString();
                            }}
                            className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Download PDF
                        </button>
                    </div>

                    {/* Report Header (visible on print only) */}
                    <div className="hidden print-only mb-4 text-center border-b-2 border-[#007C47] pb-4">
                        {letterhead.show_logo === '1' && settings.logo_path && (
                            <div className="mb-2">
                                <img src={`/storage/${settings.logo_path}`} alt="Logo" className="h-10 w-auto mx-auto" />
                            </div>
                        )}
                        <h1 className="text-xl font-bold text-[#007C47]">
                            {letterhead.company_name}
                        </h1>
                        {letterhead.header_text && (
                            <p className="text-sm text-gray-600 mt-1">{letterhead.header_text}</p>
                        )}
                        <h2 className="text-lg font-semibold mt-1">
                            {selectedType === 'income' ? 'Income' : selectedType === 'expense' ? 'Expense' : 'Income & Expense'} Report
                        </h2>
                        <p className="text-sm text-gray-600">
                            {summary.label} | {selectedPeriod === 'monthly' ? 'Monthly' : selectedPeriod === 'half_yearly' ? 'Half Yearly' : selectedPeriod === 'yearly' ? 'Yearly' : selectedPeriod === 'custom' ? 'Custom Range' : 'All Time'}
                        </p>
                        {letterhead.subheader_text && (
                            <p className="text-xs text-gray-500 mt-1">{letterhead.subheader_text}</p>
                        )}
                    </div>

                    {/* Period Selector */}
                    <Card className="mb-6 no-print">
                        <CardHeader>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    {/* Left: Type + Category Filters */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            value={selectedType}
                                            onChange={(e) => applyTypeFilter(e.target.value)}
                                            className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            <option value="all">All</option>
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                        {selectedType !== 'all' ? (
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => applyCategoryFilter(e.target.value)}
                                                className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">All Categories</span>
                                        )}
                                    </div>

                                    {/* Right: Period Dropdown + Sub-filter */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            value={selectedPeriod}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'custom') {
                                                    setSelectedPeriod('custom');
                                                } else {
                                                    applyFilter(val);
                                                }
                                            }}
                                            className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="half_yearly">Half Year</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="custom">Custom Range</option>
                                        </select>
                                        {selectedPeriod === 'half_yearly' && (
                                            <select
                                                value={selectedDate ? selectedDate.substring(0, 4) : new Date().getFullYear().toString()}
                                                onChange={(e) => applyFilter('half_yearly', e.target.value + '-01-01')}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                <option value="2026">2026</option>
                                                <option value="2025">2025</option>
                                            </select>
                                        )}
                                        {selectedPeriod === 'yearly' && (
                                            <select
                                                value={selectedDate ? selectedDate.substring(0, 4) : new Date().getFullYear().toString()}
                                                onChange={(e) => applyFilter('yearly', e.target.value + '-01-01')}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                <option value="2026">2026</option>
                                                <option value="2025">2025</option>
                                            </select>
                                        )}
                                        {selectedPeriod === 'custom' && (
                                            <>
                                                <input
                                                    type="date"
                                                    value={customStart}
                                                    onChange={(e) => setCustomStart(e.target.value)}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-500">to</span>
                                                <input
                                                    type="date"
                                                    value={customEnd}
                                                    onChange={(e) => setCustomEnd(e.target.value)}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                />
                                                <button
                                                    onClick={applyCustomRange}
                                                    className="rounded bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600"
                                                >
                                                    Apply
                                                </button>
                                            </>
                                        )}
                                        <select
                                            value={selectedPerPage}
                                            onChange={(e) => {
                                                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                                                setSelectedPerPage(val);
                                                router.get(route('reports.index'), buildParams({ per_page: String(val), page: '1' }), { preserveState: true });
                                            }}
                                            className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            {['all', 10, 15, 25, 50, 100].map((n) => (
                                                <option key={n} value={n}>{n === 'all' ? 'All' : `${n} / page`}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                setSelectedPeriod('all');
                                                setSelectedType('all');
                                                setSelectedCategory('');
                                                setSelectedPerPage(15);
                                                router.get(route('reports.index'), { period: 'all', per_page: '15' });
                                            }}
                                            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {(selectedType === 'all' || selectedType === 'income') && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium text-gray-500">Total Income</p>
                                    <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
                                    <p className="mt-1 text-xs text-gray-400">{summary.label}</p>
                                </CardContent>
                            </Card>
                        )}
                        {(selectedType === 'all' || selectedType === 'expense') && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                                    <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</p>
                                    <p className="mt-1 text-xs text-gray-400">{summary.label}</p>
                                </CardContent>
                            </Card>
                        )}
                        {selectedType === 'all' && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium text-gray-500">Net Balance</p>
                                    <p className={`mt-1 text-2xl font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {summary.netBalance >= 0 ? '+' : ''}{formatCurrency(summary.netBalance)}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">{summary.label}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Transaction Table */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                            <CardTitle className="text-base">Transactions ({total})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th>Sl No.</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Heading</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Project</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.data.map((tx, index) => (
                                            <tr key={tx.id}>
                                                <td className="text-center text-gray-500 font-medium">{(transactions.current_page - 1) * transactions.per_page + index + 1}</td>
                                                <td className="whitespace-nowrap text-gray-700">{formatDate(tx.transaction_date)}</td>
                                                <td>
                                                    <span className={`type-badge-prof ${tx.type}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td>{tx.income_heading?.name || tx.expense_heading?.name || '-'}</td>
                                                <td className="text-gray-500">{tx.income_heading?.category?.name || tx.expense_heading?.category?.name || '-'}</td>
                                                <td>{tx.description}</td>
                                                <td className="text-gray-500">{tx.project?.name || '-'}</td>
                                                <td className={`amount-cell ${tx.type}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.data.length === 0 && (
                                            <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 italic">No transactions found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.last_page > 1 && (
                                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-1">
                                    {transactions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${link.active ? 'bg-[#007C47] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                            preserveState
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Print Footer (visible on print only) */}
                    <div className="hidden print-only mt-6 border-t-2 border-[#007C47] pt-3 text-center">
                        <div className="w-12 h-0.5 bg-[#005c35] mx-auto mb-2"></div>
                        <p className="text-xs text-gray-400">Generated on: {new Date().toLocaleString('en-GB')}</p>
                        <p className="text-xs text-gray-500 italic mt-0.5">{letterhead.footer_text}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
