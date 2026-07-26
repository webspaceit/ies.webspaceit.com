import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    income_headings_count: number;
    expense_headings_count: number;
}

export default function Categories({ categories }: { categories: Category[] }) {
    const { url } = usePage();
    const { auth } = usePage().props as { auth: { user: { role: string } } };
    const isAdmin = auth.user.role === 'admin';
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const filterType = urlParams.get('type') as 'income' | 'expense' | null;

    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: (filterType || 'expense') as 'income' | 'expense',
    });

    const editData = useForm({
        name: '',
        type: 'expense' as 'income' | 'expense',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (category: Category) => {
        setEditing(category.id);
        editData.setData({ name: category.name, type: category.type });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editData.put(route('categories.update', id), {
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    const filteredCategories = filterType
        ? categories.filter((c) => c.type === filterType)
        : categories;

    const incomeCategories = categories.filter((c) => c.type === 'income');
    const expenseCategories = categories.filter((c) => c.type === 'expense');

    const renderTable = (items: Category[], label: string) => (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{label} Categories ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-center">Headings</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((category, index) => (
                                <tr key={category.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {editing === category.id ? (
                                            <form onSubmit={(e) => handleUpdate(e, category.id)} className="flex gap-2">
                                                <input type="text" value={editData.data.name} onChange={(e) => editData.setData('name', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" required />
                                                <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Save</button>
                                                <button type="button" onClick={() => setEditing(null)} className="rounded bg-gray-300 px-3 py-1 text-xs hover:bg-gray-400">Cancel</button>
                                            </form>
                                        ) : (
                                            category.name
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                                            {category.type === 'income' ? category.income_headings_count : category.expense_headings_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {editing !== category.id && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(category)} className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">Edit</button>
                                                {isAdmin && (
                                                    <button onClick={() => handleDelete(category.id)} className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200">Delete</button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No categories found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {filterType ? `${filterType === 'income' ? 'Income' : 'Expense'} Categories` : 'All Categories'}
                </h2>
            }
        >
            <Head title={filterType ? `${filterType === 'income' ? 'Income' : 'Expense'} Categories` : 'Categories'} />

            <div className="py-12">
                <div className="mx-auto max-w-full px-6">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add Category</CardTitle>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="rounded bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600"
                                >
                                    {showForm ? 'Cancel' : '+ Add New'}
                                </button>
                            </div>
                        </CardHeader>
                        {showForm && (
                            <CardContent>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div className="flex-1">
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
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-primary-500 px-6 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </form>
                            </CardContent>
                        )}
                    </Card>

                    {filterType
                        ? renderTable(filteredCategories, filterType === 'income' ? 'Income' : 'Expense')
                        : (
                            <>
                                {renderTable(expenseCategories, 'Expense')}
                                {renderTable(incomeCategories, 'Income')}
                            </>
                        )
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
