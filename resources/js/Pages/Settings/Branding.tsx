import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

interface Props {
    settings: {
        logo_path: string | null;
        favicon_path: string | null;
        sidebar_title: string;
        sidebar_subtitle: string;
    };
    letterhead: {
        company_name: string;
        header_text: string;

        footer_text: string;
        show_logo: string;
    };
}

export default function Branding() {
    const { settings, letterhead } = usePage().props as unknown as Props;

    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const logoForm = useForm<{ logo: File | null }>({ logo: null });
    const faviconForm = useForm<{ favicon: File | null }>({ favicon: null });
    const sidebarForm = useForm({
        sidebar_title: settings.sidebar_title,
        sidebar_subtitle: settings.sidebar_subtitle,
    });
    const letterheadForm = useForm({
        company_name: letterhead.company_name,
        header_text: letterhead.header_text,

        footer_text: letterhead.footer_text,
        show_logo: letterhead.show_logo,
    });

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
                toast.success('Logo uploaded successfully.');
            },
        });
    };

    const deleteLogo = () => {
        router.delete(route('settings.logo.destroy'), {
            onSuccess: () => {
                setLogoPreview(null);
                toast.success('Logo removed.');
            },
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
                toast.success('Favicon uploaded successfully.');
            },
        });
    };

    const deleteFavicon = () => {
        router.delete(route('settings.favicon.destroy'), {
            onSuccess: () => {
                setFaviconPreview(null);
                toast.success('Favicon removed.');
            },
        });
    };

    const submitLetterhead = () => {
        letterheadForm.put(route('settings.letterhead.update'), {
            onSuccess: () => toast.success('Letterhead updated successfully.'),
        });
    };

    const submitSidebar = () => {
        sidebarForm.put(route('settings.letterhead.update'), {
            onSuccess: () => toast.success('Sidebar branding updated successfully.'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-primary-700">
                    Settings — Branding
                </h2>
            }
        >
            <Head title="Branding" />

            <div className="max-w-2xl space-y-6">
                {/* Color Scheme */}
                <ThemeSwitcher />

                {/* Logo */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">Logo</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            <div className="flex shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden p-2" style={{ minHeight: '80px', minWidth: '80px' }}>
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="max-h-32 max-w-full object-contain" />
                                ) : settings.logo_path ? (
                                    <img src={`/storage/${settings.logo_path}`} alt="Logo" className="max-h-32 max-w-full object-contain" />
                                ) : (
                                    <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-sm text-gray-500">Upload your company or system logo. Recommended size: 200×200px. Max 2MB.</p>
                                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Choose Image
                                    </button>
                                    {logoForm.data.logo && (
                                        <button
                                            onClick={submitLogo}
                                            disabled={logoForm.processing}
                                            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            {logoForm.processing ? 'Uploading...' : 'Save'}
                                        </button>
                                    )}
                                    {settings.logo_path && !logoForm.data.logo && (
                                        <button
                                            onClick={deleteLogo}
                                            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Favicon */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">Favicon</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            <div className="flex shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden p-2" style={{ minHeight: '80px', minWidth: '80px' }}>
                                {faviconPreview ? (
                                    <img src={faviconPreview} alt="Favicon preview" className="max-h-32 max-w-full object-contain" />
                                ) : settings.favicon_path ? (
                                    <img src={`/storage/${settings.favicon_path}`} alt="Favicon" className="max-h-32 max-w-full object-contain" />
                                ) : (
                                    <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-sm text-gray-500">Upload a favicon for the browser tab. Recommended size: 32×32px or 16×16px. Max 512KB.</p>
                                <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => faviconInputRef.current?.click()}
                                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Choose Image
                                    </button>
                                    {faviconForm.data.favicon && (
                                        <button
                                            onClick={submitFavicon}
                                            disabled={faviconForm.processing}
                                            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            {faviconForm.processing ? 'Uploading...' : 'Save'}
                                        </button>
                                    )}
                                    {settings.favicon_path && !faviconForm.data.favicon && (
                                        <button
                                            onClick={deleteFavicon}
                                            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Text */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">Sidebar Branding</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-gray-500">Customize the text displayed next to the logo in the sidebar.</p>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Sidebar Title</label>
                            <input
                                type="text"
                                value={sidebarForm.data.sidebar_title}
                                onChange={(e) => sidebarForm.setData('sidebar_title', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="e.g. IES"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Sidebar Subtitle</label>
                            <input
                                type="text"
                                value={sidebarForm.data.sidebar_subtitle}
                                onChange={(e) => sidebarForm.setData('sidebar_subtitle', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="e.g. Income Expense System"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={submitSidebar}
                                disabled={sidebarForm.processing}
                                className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                            >
                                {sidebarForm.processing ? 'Saving...' : 'Save Sidebar'}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Letterhead */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                        <CardTitle className="text-lg font-bold text-primary-700">Letterhead (Reports & PDF)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-gray-500">Configure the letterhead that appears on printed reports and PDF exports.</p>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Company Name *</label>
                            <input
                                type="text"
                                value={letterheadForm.data.company_name}
                                onChange={(e) => letterheadForm.setData('company_name', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Company name shown on reports"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Header Text</label>
                            <input
                                type="text"
                                value={letterheadForm.data.header_text}
                                onChange={(e) => letterheadForm.setData('header_text', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="e.g. email, phone, address"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Footer Text</label>
                            <input
                                type="text"
                                value={letterheadForm.data.footer_text}
                                onChange={(e) => letterheadForm.setData('footer_text', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Footer disclaimer text"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Show Logo in Letterhead</label>
                            <button
                                type="button"
                                onClick={() => letterheadForm.setData('show_logo', letterheadForm.data.show_logo === '1' ? '0' : '1')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${letterheadForm.data.show_logo === '1' ? 'bg-primary-500' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${letterheadForm.data.show_logo === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-sm text-gray-500">{letterheadForm.data.show_logo === '1' ? 'Yes' : 'No'}</span>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={submitLetterhead}
                                disabled={letterheadForm.processing}
                                className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
                            >
                                {letterheadForm.processing ? 'Saving...' : 'Save Letterhead'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
