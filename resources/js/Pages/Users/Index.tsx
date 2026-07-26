import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'accountant';
    created_at: string;
}

export default function Users({ users }: { users: User[] }) {
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
        editData.setData({ name: user.name, email: user.email, password: '', password_confirmation: '', role: user.role });
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
        return role === 'admin'
            ? <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">Admin</span>
            : <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Accountant</span>;
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
                                            <option value="admin">Admin</option>
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
                                        <tr className="border-b">
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
                                                    {editing === user.id ? (
                                                        <select value={editData.data.role} onChange={(e) => editData.setData('role', e.target.value as 'admin' | 'accountant')} className="rounded border-gray-300 text-sm shadow-sm">
                                                            <option value="accountant">Accountant</option>
                                                            <option value="admin">Admin</option>
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
                                                        <div className="flex justify-end gap-2">
                                                            <button type="submit" onClick={(e) => handleUpdate(e, user.id)} className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Save</button>
                                                            <button type="button" onClick={() => setEditing(null)} className="rounded bg-gray-300 px-3 py-1 text-xs hover:bg-gray-400">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEdit(user)} className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">Edit</button>
                                                            <button onClick={() => handleDelete(user.id)} className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200">Delete</button>
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
