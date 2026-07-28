import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState, useEffect, useRef } from 'react';

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    transaction_date: string;
    date_code: string;
    remarks: string | null;
    income_heading: { id: number; name: string } | null;
    expense_heading: { id: number; name: string } | null;
    project: { id: number; name: string } | null;
    attachments: Attachment[];
}

interface Attachment {
    id: number;
    filename: string;
    path: string;
    mime_type: string | null;
    size: number | null;
    description: string | null;
}

interface PaginatedData {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Heading { id: number; name: string; category?: { name: string } | string | null }
interface Project { id: number; name: string }

interface Props {
    transactions: PaginatedData;
    filters: { type?: string; per_page?: string; search?: string };
    incomeHeadings?: Heading[];
    expenseHeadings?: Heading[];
    projects?: Project[];
}

function formatCurrency(amount: number): string {
    return amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }) + ' Tk.';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ /g, '-');
}

export default function Transactions({ transactions, filters, incomeHeadings = [], expenseHeadings = [], projects = [] }: Props) {
    const { auth } = usePage().props as unknown as { auth: { user: { role: string } } };
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const { data, setData, post, put, processing, errors, reset } = useForm({
        type: 'income',
        income_heading_id: '',
        expense_heading_id: '',
        project_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        remarks: '',
        attachment: null as File | null,
        attachment_description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            put(route('transactions.update', editingTransaction.id), {
                onSuccess: () => {
                    reset();
                    setEditingTransaction(null);
                    setShowForm(false);
                },
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                },
            });
        }
    };

    const handleEdit = (tx: Transaction) => {
        setEditingTransaction(tx);
        setShowForm(true);
        setData({
            type: tx.type,
            income_heading_id: tx.income_heading?.id?.toString() ?? '',
            expense_heading_id: tx.expense_heading?.id?.toString() ?? '',
            project_id: tx.project?.id?.toString() ?? '',
            transaction_date: tx.transaction_date.split('T')[0],
            description: tx.description,
            amount: tx.amount.toString(),
            remarks: tx.remarks ?? '',
            attachment: null,
            attachment_description: tx.attachments?.[0]?.description ?? '',
        });
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
        setShowForm(false);
        reset();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('transactions.destroy', id));
        }
    };

    const handleDeleteAttachment = (attachmentId: number) => {
        if (confirm('Are you sure you want to delete this attachment?')) {
            router.delete(route('attachments.destroy', attachmentId), {
                onSuccess: () => {
                    if (editingTransaction) {
                        setEditingTransaction({
                            ...editingTransaction,
                            attachments: [],
                        });
                    }
                },
            });
        }
    };

    const filterByType = (type: string | null) => {
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (filters.per_page) params.per_page = filters.per_page;
        if (search) params.search = search;
        router.get(route('transactions.index'), params, { preserveState: true });
    };

    const filterByPerPage = (perPage: string) => {
        const params: Record<string, string> = { per_page: perPage };
        if (filters.type) params.type = filters.type;
        if (search) params.search = search;
        router.get(route('transactions.index'), params, { preserveState: true });
    };

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (filters.type) params.type = filters.type;
            if (filters.per_page) params.per_page = filters.per_page;
            router.get(route('transactions.index'), params, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
    }, [search]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="py-12">
                <div className={`mx-auto px-6 max-w-full`}>
                    {/* Filter Tabs + Add */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => filterByType(null)}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${!filters.type ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => filterByType('income')}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filters.type === 'income' ? 'bg-primary-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Income
                                    </button>
                                    <button
                                        onClick={() => filterByType('expense')}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filters.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Expense
                                    </button>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full max-w-md rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={filters.per_page || '15'}
                                        onChange={(e) => filterByPerPage(e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    >
                                        <option value="10">10 / page</option>
                                        <option value="15">15 / page</option>
                                        <option value="25">25 / page</option>
                                        <option value="50">50 / page</option>
                                        <option value="100">100 / page</option>
                                    </select>
                                    <button
                                    onClick={() => {
                                        if (showForm) {
                                            handleCancelEdit();
                                        } else {
                                            setShowForm(true);
                                        }
                                    }}
                                    className="rounded bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600"
                                >
                                    {showForm ? 'Cancel' : '+ New Transaction'}
                                </button>
                                </div>
                            </div>
                        </CardHeader>
                        {showForm && (
                            <CardContent>
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h3>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Type *</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as 'income' | 'expense')}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>

                                    {data.type === 'income' ? (
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Income Heading *</label>
                                            <select
                                                value={data.income_heading_id}
                                                onChange={(e) => setData('income_heading_id', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="">Select...</option>
                                                {Array.from(
                                                    incomeHeadings.reduce((map, h) => {
                                                        const cat = typeof h.category === 'object' ? h.category?.name || 'Other' : h.category || 'Other';
                                                        if (!map.has(cat)) map.set(cat, []);
                                                        map.get(cat)!.push(h);
                                                        return map;
                                                    }, new Map<string, typeof incomeHeadings>())
                                                ).map(([category, items]) => (
                                                    <optgroup key={category} label={category}>
                                                        {items.map((h) => (
                                                            <option key={h.id} value={h.id}>{h.name}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            {errors.income_heading_id && <p className="mt-1 text-sm text-red-600">{errors.income_heading_id}</p>}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Expense Heading *</label>
                                            <select
                                                value={data.expense_heading_id}
                                                onChange={(e) => setData('expense_heading_id', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="">Select...</option>
                                                {Array.from(
                                                    expenseHeadings.reduce((map, h) => {
                                                        const cat = typeof h.category === 'object' ? h.category?.name || 'Other' : h.category || 'Other';
                                                        if (!map.has(cat)) map.set(cat, []);
                                                        map.get(cat)!.push(h);
                                                        return map;
                                                    }, new Map<string, typeof expenseHeadings>())
                                                ).map(([category, items]) => (
                                                    <optgroup key={category} label={category}>
                                                        {items.map((h) => (
                                                            <option key={h.id} value={h.id}>{h.name}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            {errors.expense_heading_id && <p className="mt-1 text-sm text-red-600">{errors.expense_heading_id}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Project</label>
                                        <select
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            <option value="">None</option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Date *</label>
                                        <input
                                            type="date"
                                            value={data.transaction_date}
                                            onChange={(e) => setData('transaction_date', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
                                        <input
                                            type="text"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Amount *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
                                        <textarea
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Attachment (Receipt)</label>
                                        {editingTransaction && editingTransaction.attachments && editingTransaction.attachments.length > 0 && (
                                            <div className="mb-2 flex items-center gap-2">
                                                <a
                                                    href={`/storage/${editingTransaction.attachments[0].path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 underline hover:text-blue-800"
                                                >
                                                    {editingTransaction.attachments[0].filename}
                                                </a>
                                                {editingTransaction.attachments[0].description && (
                                                    <span className="text-xs text-gray-500">({editingTransaction.attachments[0].description})</span>
                                                )}
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAttachment(editingTransaction.attachments[0].id)}
                                                        className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('attachment', file);
                                                }
                                            }}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            accept="image/*,.pdf"
                                        />
                                        {data.attachment && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                Selected: {data.attachment.name} ({(data.attachment.size / 1024).toFixed(2)} KB)
                                            </p>
                                        )}
                                        {errors.attachment && <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>}
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Attachment Description</label>
                                        <input
                                            type="text"
                                            value={data.attachment_description}
                                            onChange={(e) => setData('attachment_description', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            placeholder="e.g. Receipt #123, Invoice copy"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded bg-primary-500 px-6 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                                        >
                                            {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        )}
                    </Card>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History ({transactions.total})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-primary-500 text-white">
                                            <th className="px-4 py-3 text-left">Sl.</th>
                                            <th className="px-4 py-3 text-left">Date</th>
                                            <th className="px-4 py-3 text-left">Type</th>
                                            <th className="px-4 py-3 text-left">Category</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                            <th className="px-4 py-3 text-left">Project</th>
                                            <th className="px-4 py-3 text-right">Amount</th>
                                            <th className="px-4 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.data.map((tx, index) => (
                                            <tr key={tx.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500">{(transactions.current_page - 1) * transactions.per_page + index + 1}</td>
                                                <td className="px-4 py-3">{formatDate(tx.transaction_date)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded px-2 py-1 text-xs font-medium ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{tx.income_heading?.name || tx.expense_heading?.name || '-'}</td>
                                                <td className="px-4 py-3">{tx.description}</td>
                                                <td className="px-4 py-3 text-gray-500">{tx.project?.name || '-'}</td>
                                                <td className={`px-4 py-3 text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {tx.attachments && tx.attachments.length > 0 && (
                                                            <button
                                                                onClick={() => setPreviewAttachment(tx.attachments[0])}
                                                                title="View Attachment"
                                                                className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-600"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                View
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEdit(tx)}
                                                            title="Edit"
                                                            className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600"
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => handleDelete(tx.id)}
                                                                title="Delete"
                                                                className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-600"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.data.length === 0 && (
                                            <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No transactions found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-1">
                                    {transactions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`rounded px-3 py-1 text-sm ${link.active
                                                ? 'bg-primary-500 text-white'
                                                : link.url
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                }`}
                                            preserveState
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Attachment Preview Modal */}
            {previewAttachment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPreviewAttachment(null)}>
                    <div
                        className="relative mx-4 flex w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
                        style={{ height: '80vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">{previewAttachment.filename}</h3>
                                {previewAttachment.description && (
                                    <p className="text-xs text-gray-500">{previewAttachment.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setPreviewAttachment(null)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-2">
                            <iframe
                                src={`/storage/${previewAttachment.path}`}
                                className="h-full w-full rounded border-0"
                                title={previewAttachment.filename}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
