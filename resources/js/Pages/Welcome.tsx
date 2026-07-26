import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth, name } = usePage().props as { auth: { user: unknown }; name: string };

    if (auth.user) {
        return (
            <>
                <Head title="Welcome" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#007C47] to-[#003d23]">
                    <Link
                        href={route('dashboard')}
                        className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[#007C47] shadow-lg transition hover:bg-green-50"
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
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#007C47] to-[#003d23] p-4">
                <div className="w-full max-w-md rounded-2xl bg-white/95 p-10 shadow-2xl backdrop-blur">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-[#005c35]">
                            {name}
                        </h1>
                        <p className="mt-2 text-[#007C47]">Track Your Income & Expenses</p>
                    </div>
                    <div className="space-y-4">
                        <Link
                            href={route('login')}
                            className="flex w-full items-center justify-center rounded-xl bg-[#007C47] px-6 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-[#005c35] active:scale-[0.98]"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="flex w-full items-center justify-center rounded-xl border-2 border-[#007C47] px-6 py-4 text-lg font-semibold text-[#005c35] shadow-sm transition hover:bg-green-50 active:scale-[0.98]"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
