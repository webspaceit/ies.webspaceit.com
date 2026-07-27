import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Category { id: number; name: string }

interface Heading {
    id: number;
    name: string;
    category_id: number | null;
    category: Category | null;
    transactions_count: number;
}

interface Props {
    headings: Heading[];
    categories: Category[];
}

export default function ExpenseHeadings({ headings, categories }: Props) {
    const { auth } = usePage().props as unknown as { auth: { user: { role: string } } };
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';
    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category_id: '',
    });

    const editData = useForm({
        name: '',
        category_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('expense-headings.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (heading: Heading) => {
        setEditing(heading.id);
        editData.setData({ name: heading.name, category_id: heading.category_id?.toString() || '' });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editData.put(route('expense-headings.update', id), {
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this heading?')) {
            router.delete(route('expense-headings.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Expense Headings</h2>}
        >
            <Head title="Expense Headings" />

            <div className="py-12">
                <div className="mx-auto max-w-full px-6">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add Expense Heading</CardTitle>
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
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        >
                                            <option value="">None</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
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

                    <Card>
                        <CardHeader>
                            <CardTitle>All Expense Headings ({headings.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left">#</th>
                                            <th className="px-4 py-3 text-left">Name</th>
                                            <th className="px-4 py-3 text-left">Category</th>
                                            <th className="px-4 py-3 text-center">Transactions</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {headings.map((heading, index) => (
                                            <tr key={heading.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    {editing === heading.id ? (
                                                        <form onSubmit={(e) => handleUpdate(e, heading.id)} className="flex gap-2">
                                                            <input type="text" value={editData.data.name} onChange={(e) => editData.setData('name', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" required />
                                                            <select value={editData.data.category_id} onChange={(e) => editData.setData('category_id', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm">
                                                                <option value="">None</option>
                                                                {categories.map((c) => (
                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                ))}
                                                            </select>
                                                            <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Save</button>
                                                            <button type="button" onClick={() => setEditing(null)} className="rounded bg-gray-300 px-3 py-1 text-xs hover:bg-gray-400">Cancel</button>
                                                        </form>
                                                    ) : (
                                                        heading.name
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{editing !== heading.id ? (heading.category?.name || '-') : null}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">{heading.transactions_count}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {editing !== heading.id && (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEdit(heading)} className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">Edit</button>
                                                            {isAdmin && (
                                                                <button onClick={() => handleDelete(heading.id)} className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200">Delete</button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {headings.length === 0 && (
                                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No expense headings found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
