export interface Theme {
    id: string;
    name: string;
    colors: Record<string, string>;
    sidebarFrom: string;
    sidebarVia: string;
    sidebarTo: string;
}

export const themes: Theme[] = [
    {
        id: 'green',
        name: 'Emerald',
        colors: {
            '50': '#e6f5ed', '100': '#b3e0cc', '200': '#80ccaa', '300': '#4db789',
            '400': '#26a771', '500': '#007C47', '600': '#006e40', '700': '#005c35',
            '800': '#004b2b', '900': '#002d1a',
        },
        sidebarFrom: '#007C47', sidebarVia: '#005c35', sidebarTo: '#003d23',
    },
    {
        id: 'blue',
        name: 'Ocean',
        colors: {
            '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
            '400': '#60a5fa', '500': '#2563eb', '600': '#1d4ed8', '700': '#1e40af',
            '800': '#1e3a8a', '900': '#172554',
        },
        sidebarFrom: '#2563eb', sidebarVia: '#1e40af', sidebarTo: '#172554',
    },
    {
        id: 'purple',
        name: 'Violet',
        colors: {
            '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
            '400': '#c084fc', '500': '#9333ea', '600': '#7e22ce', '700': '#6b21a8',
            '800': '#581c87', '900': '#3b0764',
        },
        sidebarFrom: '#9333ea', sidebarVia: '#6b21a8', sidebarTo: '#3b0764',
    },
    {
        id: 'red',
        name: 'Ruby',
        colors: {
            '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5',
            '400': '#f87171', '500': '#dc2626', '600': '#b91c1c', '700': '#991b1b',
            '800': '#7f1d1d', '900': '#450a0a',
        },
        sidebarFrom: '#dc2626', sidebarVia: '#991b1b', sidebarTo: '#450a0a',
    },
    {
        id: 'orange',
        name: 'Amber',
        colors: {
            '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d',
            '400': '#fbbf24', '500': '#d97706', '600': '#b45309', '700': '#92400e',
            '800': '#78350f', '900': '#451a03',
        },
        sidebarFrom: '#d97706', sidebarVia: '#92400e', sidebarTo: '#451a03',
    },
    {
        id: 'teal',
        name: 'Teal',
        colors: {
            '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4',
            '400': '#2dd4bf', '500': '#0d9488', '600': '#0f766e', '700': '#115e59',
            '800': '#134e4a', '900': '#042f2e',
        },
        sidebarFrom: '#0d9488', sidebarVia: '#115e59', sidebarTo: '#042f2e',
    },
    {
        id: 'slate',
        name: 'Slate',
        colors: {
            '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
            '400': '#94a3b8', '500': '#475569', '600': '#334155', '700': '#1e293b',
            '800': '#0f172a', '900': '#020617',
        },
        sidebarFrom: '#475569', sidebarVia: '#1e293b', sidebarTo: '#020617',
    },
    {
        id: 'pink',
        name: 'Rose',
        colors: {
            '50': '#fff1f2', '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af',
            '400': '#fb7185', '500': '#e11d48', '600': '#be123c', '700': '#9f1239',
            '800': '#881337', '900': '#4c0519',
        },
        sidebarFrom: '#e11d48', sidebarVia: '#9f1239', sidebarTo: '#4c0519',
    },
];

export function getThemeById(id: string): Theme {
    return themes.find((t) => t.id === id) || themes[0];
}

export function generateCustomTheme(hex: string): Theme {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const lighten = (factor: number) => {
        const lr = Math.round(r + (255 - r) * factor);
        const lg = Math.round(g + (255 - g) * factor);
        const lb = Math.round(b + (255 - b) * factor);
        return rgbToHex(lr, lg, lb);
    };

    const darken = (factor: number) => {
        const dr = Math.round(r * (1 - factor));
        const dg = Math.round(g * (1 - factor));
        const db = Math.round(b * (1 - factor));
        return rgbToHex(dr, dg, db);
    };

    const colors: Record<string, string> = {
        '50': lighten(0.90),
        '100': lighten(0.75),
        '200': lighten(0.60),
        '300': lighten(0.40),
        '400': lighten(0.20),
        '500': hex,
        '600': darken(0.10),
        '700': darken(0.25),
        '800': darken(0.40),
        '900': darken(0.60),
    };

    return {
        id: 'custom',
        name: 'Custom',
        colors,
        sidebarFrom: hex,
        sidebarVia: darken(0.25),
        sidebarTo: darken(0.50),
    };
}

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([shade, value]) => {
        const rgb = hexToRgb(value);
        root.style.setProperty(`--color-primary-${shade}`, rgb);
    });
    root.style.setProperty('--sidebar-from', theme.sidebarFrom);
    root.style.setProperty('--sidebar-via', theme.sidebarVia);
    root.style.setProperty('--sidebar-to', theme.sidebarTo);
}

function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
}

function rgbToHex(r: number, g: number, b: number): string {
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    return '#' + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}
