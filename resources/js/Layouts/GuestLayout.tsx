import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const settings = (usePage().props as any).settings;

    return (
        <div
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{ background: `linear-gradient(135deg, var(--sidebar-from), var(--sidebar-to))` }}
        >
            <div className="flex flex-col items-center">
                <Link href="/" className="flex items-center justify-center">
                    {settings?.logo_path ? (
                        <img
                            src={`/storage/${settings.logo_path}`}
                            alt="Logo"
                            className="h-20 w-20 object-contain"
                        />
                    ) : (
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    )}
                </Link>
                {(settings?.sidebar_title || settings?.sidebar_subtitle) && (
                    <div className="mt-3 text-center">
                        <h1 className="text-xl font-bold" style={{ color: 'var(--sidebar-via)' }}>{settings?.sidebar_title || 'IES'}</h1>
                        <p className="text-sm text-white/80">{settings?.sidebar_subtitle || 'Income Expense System'}</p>
                    </div>
                )}
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
