import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Project {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    transactions_count: number;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ /g, '-');
}

export default function Projects({ projects }: { projects: Project[] }) {
    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    const editData = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (project: Project) => {
        setEditing(project.id);
        editData.setData({
            name: project.name,
            description: project.description || '',
            start_date: project.start_date ? project.start_date.split('T')[0] : '',
            end_date: project.end_date ? project.end_date.split('T')[0] : '',
        });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editData.put(route('projects.update', id), {
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Projects</h2>}
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-full px-6">
                    {/* Add Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Add Project</CardTitle>
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
                                    <div className="sm:col-span-2">
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
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded bg-primary-500 px-6 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        )}
                    </Card>

                    {/* Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Projects ({projects.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left">#</th>
                                            <th className="px-4 py-3 text-left">Name</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                            <th className="px-4 py-3 text-left">Start Date</th>
                                            <th className="px-4 py-3 text-left">End Date</th>
                                            <th className="px-4 py-3 text-center">Transactions</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project, index) => (
                                            <tr key={project.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    {editing === project.id ? (
                                                        <form onSubmit={(e) => handleUpdate(e, project.id)} className="flex gap-2">
                                                            <input type="text" value={editData.data.name} onChange={(e) => editData.setData('name', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" required />
                                                            <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Save</button>
                                                            <button type="button" onClick={() => setEditing(null)} className="rounded bg-gray-300 px-3 py-1 text-xs hover:bg-gray-400">Cancel</button>
                                                        </form>
                                                    ) : (
                                                        project.name
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{editing !== project.id ? (project.description || '-') : null}</td>
                                                <td className="px-4 py-3">{editing !== project.id ? formatDate(project.start_date) : (
                                                    <input type="date" value={editData.data.start_date} onChange={(e) => editData.setData('start_date', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" />
                                                )}</td>
                                                <td className="px-4 py-3">{editing !== project.id ? formatDate(project.end_date) : (
                                                    <input type="date" value={editData.data.end_date} onChange={(e) => editData.setData('end_date', e.target.value)} className="rounded border-gray-300 text-sm shadow-sm" />
                                                )}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">{project.transactions_count}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {editing !== project.id && (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEdit(project)} className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 hover:bg-blue-200">Edit</button>
                                                            <button onClick={() => handleDelete(project.id)} className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200">Delete</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {projects.length === 0 && (
                                            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No projects found.</td></tr>
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
