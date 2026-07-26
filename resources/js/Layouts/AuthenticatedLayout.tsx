import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main content area */}
            <div className="pl-64">
                {/* Top bar */}
                <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none lg:hidden"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={showingNavigationDropdown ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 transition duration-150 ease-in-out hover:border-primary-300 hover:text-primary-700 focus:outline-none"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            {user.name}
                                            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 capitalize">{(user as any).role}</span>
                                            <svg
                                                className="-me-0.5 ms-1 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile navigation dropdown */}
                    {showingNavigationDropdown && (
                        <div className="border-t border-gray-200 lg:hidden">
                            <div className="space-y-1 px-4 pb-3 pt-2">
                                <Link
                                    href={route('dashboard')}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Page header */}
                {header && (
                    <header className="border-b border-gray-200 bg-white">
                        <div className="w-full px-6 py-4">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
