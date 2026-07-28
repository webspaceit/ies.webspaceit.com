import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'accountant';
    created_at: string;
}

export default function Users({ users }: { users: User[] }) {
    const { auth } = usePage().props as unknown as { auth: { user: { role: string } } };
    const isSuperAdmin = auth.user.role === 'super_admin';
    const isAdmin = auth.user.role === 'admin' || isSuperAdmin;
    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'accountant' as 'admin' | 'accountant',
    });

    const editData = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'accountant' as 'admin' | 'accountant',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (user: User) => {
        setEditing(user.id);
        editData.setData({ name: user.name, email: user.email, password: '', password_confirmation: '', role: user.role === 'super_admin' ? 'admin' : user.role });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editData.put(route('users.update', id), {
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">Super Admin</span>;
            case 'admin':
                return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">Admin</span>;
            default:
                return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Accountant</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">User Management</h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-full px-6">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add User</CardTitle>
                                {isAdmin && (
                                    <button
                                        onClick={() => setShowForm(!showForm)}
                                        className="rounded bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600"
                                    >
                                        {showForm ? 'Cancel' : '+ Add New'}
                                    </button>
                                )}
                            </div>
                        </CardHeader>
                        {showForm && isAdmin && (
                            <CardContent>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Password *</label>
                                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password *</label>
                                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Role *</label>
                                        <select value={data.role} onChange={(e) => setData('role', e.target.value as 'admin' | 'accountant')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                            <option value="accountant">Accountant</option>
                                            {isSuperAdmin && <option value="admin">Admin</option>}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit" disabled={processing} className="rounded bg-primary-500 px-6 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        )}
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Users ({users.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-primary-500 text-white">
                                            <th className="px-4 py-3 text-left">#</th>
                                            <th className="px-4 py-3 text-left">Name</th>
                                            <th className="px-4 py-3 text-left">Email</th>
                                            <th className="px-4 py-3 text-center">Role</th>
                                            <th className="px-4 py-3 text-left">Created</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    {editing === user.id ? (
                                                        <form onSubmit={(e) => handleUpdate(e, user.id)} className="flex flex-col gap-2">
                                                            <input type="text" value={editData.data.name} onChange={(e) => editData.setData('name', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" required />
                                                        </form>
                                                    ) : (
                                                        user.name
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {editing === user.id ? (
                                                        <input type="email" value={editData.data.email} onChange={(e) => editData.setData('email', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" required />
                                                    ) : (
                                                        user.email
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {editing === user.id && user.role !== 'super_admin' ? (
                                                        <select value={editData.data.role} onChange={(e) => editData.setData('role', e.target.value as 'admin' | 'accountant')} className="rounded border-gray-300 text-sm shadow-sm">
                                                            <option value="accountant">Accountant</option>
                                                            {isSuperAdmin && <option value="admin">Admin</option>}
                                                        </select>
                                                    ) : (
                                                        getRoleBadge(user.role)
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {editing === user.id ? (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="submit"
                                                                onClick={(e) => handleUpdate(e, user.id)}
                                                                title="Save"
                                                                className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-emerald-600"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                                Save
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditing(null)}
                                                                title="Cancel"
                                                                className="inline-flex items-center gap-1 rounded-md bg-gray-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-gray-600"
                                                            >
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {user.role !== 'super_admin' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleEdit(user)}
                                                                        title="Edit"
                                                                        className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600"
                                                                    >
                                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                        </svg>
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(user.id)}
                                                                        title="Delete"
                                                                        className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-600"
                                                                    >
                                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                        </svg>
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No users found.</td></tr>
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
