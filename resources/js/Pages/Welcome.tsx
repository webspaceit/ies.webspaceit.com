import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth, name, settings } = usePage().props as unknown as { auth: { user: unknown }; name: string; settings: { logo_path?: string | null; sidebar_title?: string; sidebar_subtitle?: string } };
    const title = settings?.sidebar_title || 'IES';
    const subtitle = settings?.sidebar_subtitle || 'Income Expense System';

    const gradientBg = { background: `linear-gradient(135deg, var(--sidebar-from), var(--sidebar-to))` };

    if (auth.user) {
        return (
            <>
                <Head title="Welcome" />
                <div className="flex min-h-screen items-center justify-center" style={gradientBg}>
                    <Link
                        href={route('dashboard')}
                        className="rounded-lg bg-white px-8 py-4 text-lg font-semibold shadow-lg transition hover:bg-gray-50"
                        style={{ color: 'var(--sidebar-from)' }}
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen items-center justify-center p-4" style={gradientBg}>
                <div className="w-full max-w-md rounded-2xl bg-white/95 p-10 shadow-2xl backdrop-blur">
                    <div className="mb-8 text-center">
                        {settings?.logo_path && (
                            <img src={`/storage/${settings.logo_path}`} alt="Logo" className="mx-auto mb-4 h-16 w-16 object-contain" />
                        )}
                        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--sidebar-via)' }}>
                            {title}
                        </h1>
                        <p className="mt-2" style={{ color: 'var(--sidebar-from)' }}>{subtitle}</p>
                    </div>
                    <div className="space-y-4">
                        <Link
                            href={route('login')}
                            className="flex w-full items-center justify-center rounded-xl px-6 py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98]"
                            style={{ background: 'var(--sidebar-from)' }}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
