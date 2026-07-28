import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { applyTheme, getThemeById, generateCustomTheme } from './themes';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function resolveTheme(scheme: string) {
    if (scheme.startsWith('custom:')) {
        return generateCustomTheme(scheme.replace('custom:', ''));
    }
    return getThemeById(scheme);
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const initialProps = props as any;
        const themeId = initialProps?.settings?.color_scheme || 'green';
        applyTheme(resolveTheme(themeId));

        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster position="top-center" richColors />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
