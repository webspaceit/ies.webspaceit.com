import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface SubMenuItem {
    label: string;
    href: string;
    routeName: string;
}

interface MenuItem {
    label: string;
    href?: string;
    routeName?: string;
    icon: string;
    children?: SubMenuItem[];
}

const defaultMenuItems: MenuItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        routeName: 'dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
        label: 'Income',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        children: [
            { label: 'Income Headings', href: '/income-headings', routeName: 'income-headings.index' },
            { label: 'Transactions', href: '/transactions?type=income', routeName: 'transactions.income' },
            { label: 'Categories', href: '/categories?type=income', routeName: 'categories.income' },
        ],
    },
    {
        label: 'Expenses',
        icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
        children: [
            { label: 'Expense Headings', href: '/expense-headings', routeName: 'expense-headings.index' },
            { label: 'Transactions', href: '/transactions?type=expense', routeName: 'transactions.expense' },
            { label: 'Categories', href: '/categories?type=expense', routeName: 'categories.expense' },
        ],
    },
    {
        label: 'Projects',
        href: '/projects',
        routeName: 'projects.index',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    },
    {
        label: 'Reports',
        href: '/reports',
        routeName: 'reports.index',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
        label: 'Settings',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        children: [
            { label: 'Branding', href: '/settings/branding', routeName: 'settings.branding' },
            { label: 'Users', href: '/users', routeName: 'users.index' },
        ],
    },
];

const OPEN_MENUS_KEY = 'sidebar-open-menus';

function applyMenuOrder(order: Record<string, string[]>): MenuItem[] {
    return defaultMenuItems.map((item) => {
        if (item.children && order[item.label]) {
            const childOrder = order[item.label];
            const sorted = [...item.children].sort(
                (a, b) => childOrder.indexOf(a.routeName) - childOrder.indexOf(b.routeName)
            );
            return { ...item, children: sorted };
        }
        return item;
    });
}

function loadMenuOrderFromServer(serverMenuOrder: string | null): MenuItem[] | null {
    if (!serverMenuOrder) return null;
    try {
        const order = JSON.parse(serverMenuOrder) as Record<string, string[]>;
        return applyMenuOrder(order);
    } catch {
        return null;
    }
}

function saveMenuOrder(items: MenuItem[]) {
    const order: Record<string, string[]> = {};
    items.forEach((item) => {
        if (item.children) {
            order[item.label] = item.children.map((c) => c.routeName);
        }
    });

    const metaTag = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = metaTag?.getAttribute('content') || '';

    fetch('/settings/menu-order', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ menu_order: JSON.stringify(order) }),
    }).catch(() => {});
}

function loadOpenMenus(): Record<string, boolean> | null {
    try {
        const saved = localStorage.getItem(OPEN_MENUS_KEY);
        if (!saved) return null;
        return JSON.parse(saved) as Record<string, boolean>;
    } catch {
        return null;
    }
}

function saveOpenMenus(menus: Record<string, boolean>) {
    localStorage.setItem(OPEN_MENUS_KEY, JSON.stringify(menus));
}

interface DragInfo {
    routeName: string;
    parentLabel: string;
    startY: number;
    currentY: number;
}

export default function Sidebar() {
    const { url } = usePage();
    const user = usePage().props.auth.user as { role?: string; name: string; email: string };
    const settings = (usePage().props as any).settings;
    const isSuperAdmin = user.role === 'super_admin';
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        const items = loadMenuOrderFromServer(settings?.menu_order) || defaultMenuItems;
        if (isSuperAdmin) return items;
        if (isAdmin) {
            return items.map((item) => {
                if (item.label === 'Settings' && item.children) {
                    return { ...item, children: item.children.filter((child) => child.label !== 'Users') };
                }
                return item;
            });
        }
        return items.filter((item) => item.label !== 'Settings');
    });
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const saved = loadOpenMenus();
        if (saved) return saved;
        const initial: Record<string, boolean> = {};
        const items = loadMenuOrderFromServer(settings?.menu_order) || defaultMenuItems;
        items.forEach((item) => {
            if (item.children) {
                const isActive = item.children.some((child) => url.startsWith(child.href));
                initial[item.label] = isActive;
            }
        });
        return initial;
    });

    const dragInfoRef = useRef<DragInfo | null>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [draggingRoute, setDraggingRoute] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => {
            const next = { ...prev, [label]: !prev[label] };
            saveOpenMenus(next);
            return next;
        });
    };

    const isActive = (href: string) => url === href || url.startsWith(href + '/');
    const isParentActive = (item: MenuItem) => {
        if (item.href) return isActive(item.href);
        return item.children?.some((child) => isActive(child.href)) ?? false;
    };

    const getItemCenter = useCallback((routeName: string, parentLabel: string): number | null => {
        const el = itemRefs.current.get(`${parentLabel}:${routeName}`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent, routeName: string, parentLabel: string) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = (e.currentTarget.closest('[data-item]') as HTMLElement)?.getBoundingClientRect();
        const startY = e.clientY;
        const offsetY = rect ? e.clientY - rect.top : 0;

        dragInfoRef.current = { routeName, parentLabel, startY, currentY: startY };
        setDraggingRoute(routeName);
        setDragOffset(offsetY);
    }, []);

    useEffect(() => {
        if (!draggingRoute) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragInfoRef.current) return;
            dragInfoRef.current.currentY = e.clientY;

            const { parentLabel } = dragInfoRef.current;
            const parent = menuItems.find((m) => m.label === parentLabel);
            if (!parent?.children) return;

            let closestIdx: number | null = null;
            let closestDist = Infinity;

            parent.children.forEach((child, idx) => {
                const center = getItemCenter(child.routeName, parentLabel);
                if (center === null) return;
                const dist = Math.abs(e.clientY - center);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = idx;
                }
            });

            setOverIndex(closestIdx);
        };

        const handleMouseUp = () => {
            if (!dragInfoRef.current) return;
            const { routeName: sourceRoute, parentLabel } = dragInfoRef.current;
            const targetIdx = overIndex;

            if (targetIdx !== null && parentLabel) {
                setMenuItems((prev) => {
                    const next = prev.map((item) => {
                        if (item.label !== parentLabel || !item.children) return item;
                        const children = [...item.children];
                        const fromIdx = children.findIndex((c) => c.routeName === sourceRoute);
                        if (fromIdx === -1 || fromIdx === targetIdx) return item;
                        const [moved] = children.splice(fromIdx, 1);
                        children.splice(targetIdx, 0, moved);
                        return { ...item, children };
                    });
                    saveMenuOrder(next);
                    return next;
                });
            }

            dragInfoRef.current = null;
            setDraggingRoute(null);
            setOverIndex(null);
            setDragOffset(0);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingRoute, overIndex, menuItems, getItemCenter]);

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col" style={{ background: 'linear-gradient(180deg, #007C47 0%, #005c35 50%, #003d23 100%)' }}>
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden">
                    {settings?.logo_path ? (
                        <img src={`/storage/${settings.logo_path}`} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div>
                    <span className="text-lg font-bold tracking-wide text-white">{settings?.sidebar_title || 'IES'}</span>
                    <p className="text-[10px] text-white/60 -mt-0.5">{settings?.sidebar_subtitle || 'Income Expense System'}</p>
                </div>
            </div>

            {/* Menu */}
            <nav ref={containerRef} className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {menuItems.map((item) => {
                    const parentActive = isParentActive(item);

                    if (item.children) {
                        const isOpen = openMenus[item.label] ?? false;
                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold tracking-wide transition-all duration-200 ${
                                        parentActive
                                            ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <svg
                                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {isOpen && (
                                    <div className="ml-4 mt-1 space-y-0.5 border-l border-white/20 pl-3">
                                        {item.children.map((child, idx) => {
                                            const isDragging = draggingRoute === child.routeName;
                                            const isOver = overIndex === idx && draggingRoute !== null && !isDragging;

                                            return (
                                                <div
                                                    key={child.routeName}
                                                    data-item
                                                    ref={(el) => {
                                                        if (el) itemRefs.current.set(`${item.label}:${child.routeName}`, el);
                                                    }}
                                                    className={`group relative flex items-center rounded-lg transition-all duration-150 ${
                                                        isDragging ? 'opacity-40' : ''
                                                    } ${isOver ? 'border-t-2 border-white/50' : ''} ${
                                                        isActive(child.href) && !isDragging ? 'bg-white/20' : 'hover:bg-white/10'
                                                    }`}
                                                >
                                                    {isSuperAdmin && (
                                                        <div
                                                            onMouseDown={(e) => handleMouseDown(e, child.routeName, item.label)}
                                                            className="flex shrink-0 items-center justify-center w-5 h-8 cursor-grab active:cursor-grabbing"
                                                        >
                                                            <svg
                                                                className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity text-white/50"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={child.href}
                                                        className={`flex-1 rounded-r-lg px-2 py-2 text-sm transition-colors ${
                                                            isActive(child.href)
                                                                ? 'text-white font-medium'
                                                                : 'text-white/60 hover:text-white'
                                                        }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.routeName}
                            href={item.href!}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold tracking-wide transition-all duration-200 ${
                                parentActive
                                    ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{user.name}</p>
                        <p className="truncate text-xs text-white/50">{user.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
