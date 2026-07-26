import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

interface MonthlyStat {
    month: number;
    month_name: string;
    income: number;
    expense: number;
    balance: number;
}

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    transaction_date: string;
    income_heading?: { name: string; category?: { name: string } };
    expense_heading?: { name: string; category?: { name: string } };
    project?: { name: string };
}

interface CategoryTotal {
    name: string;
    total: number;
}

interface PageProps {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    year: number;
    monthlyStats: MonthlyStat[];
    recentTransactions: Transaction[];
    incomeByCategory: CategoryTotal[];
    expenseByCategory: CategoryTotal[];
    monthlySnacks: number;
    monthlyUtility: number;
    monthlyOffice: number;
    monthlyTech: number;
}

function formatCurrency(amount: number): string {
    return amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }) + ' Tk.';
}

function BrandingCard({ settings }: { settings: { logo_path: string | null; favicon_path: string | null } }) {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const logoForm = useForm<{ logo: File | null }>({ logo: null });
    const faviconForm = useForm<{ favicon: File | null }>({ favicon: null });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
            logoForm.setData('logo', file);
        }
    };

    const submitLogo = () => {
        if (!logoForm.data.logo) return;
        logoForm.put(route('settings.logo.update'), {
            onSuccess: () => {
                setLogoPreview(null);
                logoForm.reset();
            },
        });
    };

    const deleteLogo = () => {
        router.delete(route('settings.logo.destroy'), {
            onSuccess: () => setLogoPreview(null),
        });
    };

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFaviconPreview(URL.createObjectURL(file));
            faviconForm.setData('favicon', file);
        }
    };

    const submitFavicon = () => {
        if (!faviconForm.data.favicon) return;
        faviconForm.put(route('settings.favicon.update'), {
            onSuccess: () => {
                setFaviconPreview(null);
                faviconForm.reset();
            },
        });
    };

    const deleteFavicon = () => {
        router.delete(route('settings.favicon.destroy'), {
            onSuccess: () => setFaviconPreview(null),
        });
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                <CardTitle className="text-lg font-bold text-primary-700">Branding</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">Logo</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                                ) : settings.logo_path ? (
                                    <img src={`/storage/${settings.logo_path}`} alt="Logo" className="h-full w-full object-contain" />
                                ) : (
                                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Choose Logo
                                </button>
                                {logoForm.data.logo && (
                                    <button
                                        onClick={submitLogo}
                                        disabled={logoForm.processing}
                                        className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {logoForm.processing ? 'Uploading...' : 'Upload Logo'}
                                    </button>
                                )}
                                {settings.logo_path && !logoForm.data.logo && (
                                    <button
                                        onClick={deleteLogo}
                                        className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                                    >
                                        Remove Logo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Favicon */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">Favicon</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                                {faviconPreview ? (
                                    <img src={faviconPreview} alt="Favicon preview" className="h-full w-full object-contain" />
                                ) : settings.favicon_path ? (
                                    <img src={`/storage/${settings.favicon_path}`} alt="Favicon" className="h-full w-full object-contain" />
                                ) : (
                                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                                <button
                                    onClick={() => faviconInputRef.current?.click()}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Choose Favicon
                                </button>
                                {faviconForm.data.favicon && (
                                    <button
                                        onClick={submitFavicon}
                                        disabled={faviconForm.processing}
                                        className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {faviconForm.processing ? 'Uploading...' : 'Upload Favicon'}
                                    </button>
                                )}
                                {settings.favicon_path && !faviconForm.data.favicon && (
                                    <button
                                        onClick={deleteFavicon}
                                        className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                                    >
                                        Remove Favicon
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const {
        totalIncome,
        totalExpenses,
        balance,
        year,
        monthlyStats,
        recentTransactions,
        incomeByCategory,
        expenseByCategory,
        monthlySnacks,
        monthlyUtility,
        monthlyOffice,
        monthlyTech,
    } = usePage().props as unknown as PageProps;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-primary-700">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Income Card */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white shadow-xl shadow-primary-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5"></div>
                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-white/80">Total Income ({year})</p>
                            <p className="mt-1 text-3xl font-bold">{formatCurrency(totalIncome)}</p>
                        </div>
                    </div>

                    {/* Expense Card */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-xl shadow-red-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/30">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5"></div>
                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-white/80">Total Expenses ({year})</p>
                            <p className="mt-1 text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                        balance >= 0
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-emerald-500/30'
                            : 'bg-gradient-to-br from-red-600 to-red-800 shadow-red-600/20 hover:shadow-red-600/30'
                    }`}>
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5"></div>
                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-white/80">Net Balance ({year})</p>
                            <p className="mt-1 text-3xl font-bold">
                                {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Monthly Overview */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-primary-700">Monthly Overview ({year})</CardTitle>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.get(route('dashboard'), { year: year - 1 }, { preserveState: true })}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
                                >
                                    {year - 1}
                                </button>
                                <span className="rounded-lg bg-primary-500 px-3 py-1 text-sm font-bold text-white shadow-sm">{year}</span>
                                <button
                                    onClick={() => router.get(route('dashboard'), { year: year + 1 }, { preserveState: true })}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
                                >
                                    {year + 1}
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Month</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Income</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Expense</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyStats.map((stat) => (
                                        <tr key={stat.month} className="border-b border-gray-50 transition-colors hover:bg-primary-50/30">
                                            <td className="px-6 py-3 font-medium text-gray-800">{stat.month_name}</td>
                                            <td className="px-6 py-3 text-right font-medium text-primary-600">
                                                {stat.income > 0 ? formatCurrency(stat.income) : <span className="text-gray-300">-</span>}
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium text-red-500">
                                                {stat.expense > 0 ? formatCurrency(stat.expense) : <span className="text-gray-300">-</span>}
                                            </td>
                                            <td className={`px-6 py-3 text-right font-bold ${stat.balance >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                                                {stat.income > 0 || stat.expense > 0 ? formatCurrency(stat.balance) : <span className="text-gray-300">-</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Category Expenses */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">This Month's Expenses ({new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 transition-all hover:shadow-md">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                                    <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-500">Office & Admin</p>
                                <p className="text-xl font-bold text-primary-700">{formatCurrency(monthlyOffice)}</p>
                            </div>
                            <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4 transition-all hover:shadow-md">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-500">Technology</p>
                                <p className="text-xl font-bold text-purple-700">{formatCurrency(monthlyTech)}</p>
                            </div>
                            <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 transition-all hover:shadow-md">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                    <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2v4m0 0a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-500">Food & Entertainment</p>
                                <p className="text-xl font-bold text-orange-700">{formatCurrency(monthlySnacks)}</p>
                            </div>
                            <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 transition-all hover:shadow-md">
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                                    <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-500">Bills & Utilities</p>
                                <p className="text-xl font-bold text-teal-700">{formatCurrency(monthlyUtility)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                            <CardTitle className="text-lg font-bold text-primary-600">Income by Category ({year})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {incomeByCategory.length === 0 ? (
                                <p className="text-gray-500">No income data.</p>
                            ) : (
                                <div className="space-y-3">
                                    {incomeByCategory.map((cat) => {
                                        const percentage = totalIncome > 0 ? (cat.total / totalIncome) * 100 : 0;
                                        return (
                                            <div key={cat.name}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                                    <span className="text-sm font-bold text-primary-600">{formatCurrency(cat.total)}</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
                            <CardTitle className="text-lg font-bold text-red-600">Expenses by Category ({year})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {expenseByCategory.length === 0 ? (
                                <p className="text-gray-500">No expense data.</p>
                            ) : (
                                <div className="space-y-3">
                                    {expenseByCategory.map((cat) => {
                                        const percentage = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
                                        return (
                                            <div key={cat.name}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                                    <span className="text-sm font-bold text-red-500">{formatCurrency(cat.total)}</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentTransactions.length === 0 ? (
                            <p className="p-6 text-gray-500">No transactions yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Project</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="border-b border-gray-50 transition-colors hover:bg-primary-50/30">
                                                <td className="px-6 py-3 text-gray-600">{new Date(tx.transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        tx.type === 'income' ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">{tx.income_heading?.category?.name || tx.expense_heading?.category?.name || '-'}</td>
                                                <td className="px-6 py-3 font-medium text-gray-800">{tx.description}</td>
                                                <td className="px-6 py-3 text-gray-500">{tx.project?.name || '-'}</td>
                                                <td className={`px-6 py-3 text-right font-bold ${tx.type === 'income' ? 'text-primary-600' : 'text-red-500'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
