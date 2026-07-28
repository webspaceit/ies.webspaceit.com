import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { themes, applyTheme, getThemeById, generateCustomTheme } from '@/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { toast } from 'sonner';

export default function ThemeSwitcher() {
    const settings = (usePage().props as any).settings;
    const savedScheme = settings?.color_scheme || 'green';
    const isCustom = savedScheme.startsWith('custom:');

    const [activeTheme, setActiveTheme] = useState(isCustom ? 'custom' : savedScheme);
    const [customColor, setCustomColor] = useState(isCustom ? savedScheme.replace('custom:', '') : '#007C47');

    const save = (value: string) => {
        router.put(route('settings.color-scheme.update'), { color_scheme: value }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['settings'] });
                toast.success('Color scheme updated.');
            },
        });
    };

    const handlePreset = (themeId: string) => {
        setActiveTheme(themeId);
        applyTheme(getThemeById(themeId));
        save(themeId);
    };

    const handleCustomColor = (hex: string) => {
        setCustomColor(hex);
        setActiveTheme('custom');
        const theme = generateCustomTheme(hex);
        applyTheme(theme);
    };

    const handleCustomSave = () => {
        save(`custom:${customColor}`);
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                <CardTitle className="text-lg font-bold text-primary-700">Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
                <p className="text-sm text-gray-500">Choose a color scheme for the entire application.</p>

                {/* Preset themes */}
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handlePreset(theme.id)}
                            className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                                activeTheme === theme.id && !isCustom
                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div
                                className="h-10 w-10 rounded-full shadow-inner transition-all group-hover:scale-110"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.sidebarFrom}, ${theme.sidebarTo})`,
                                    boxShadow: activeTheme === theme.id && !isCustom
                                        ? `0 0 0 3px white, 0 0 0 5px ${theme.sidebarFrom}`
                                        : undefined,
                                }}
                            />
                            <span className={`text-xs font-medium ${
                                activeTheme === theme.id && !isCustom ? 'text-primary-700' : 'text-gray-600'
                            }`}>
                                {theme.name}
                            </span>
                        </button>
                    ))}

                    {/* Custom button */}
                    <button
                        onClick={() => setActiveTheme('custom')}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                            isCustom || activeTheme === 'custom'
                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <div
                            className="h-10 w-10 rounded-full shadow-inner transition-all group-hover:scale-110"
                            style={{
                                background: `conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7, #ef4444)`,
                            }}
                        />
                        <span className={`text-xs font-medium ${
                            isCustom || activeTheme === 'custom' ? 'text-primary-700' : 'text-gray-600'
                        }`}>
                            Custom
                        </span>
                    </button>
                </div>

                {/* Custom color picker */}
                {(isCustom || activeTheme === 'custom') && (
                    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Pick Color</label>
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => handleCustomColor(e.target.value)}
                                className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 p-0.5"
                            />
                            <input
                                type="text"
                                value={customColor}
                                onChange={(e) => {
                                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                                        handleCustomColor(e.target.value);
                                    }
                                    setCustomColor(e.target.value);
                                }}
                                onBlur={() => {
                                    if (/^#[0-9a-fA-F]{6}$/.test(customColor)) {
                                        handleCustomColor(customColor);
                                    }
                                }}
                                className="w-24 rounded-lg border-gray-300 text-sm font-mono shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="#000000"
                            />
                        </div>
                        <div className="flex gap-1.5">
                            {generateCustomTheme(customColor).colors['500'] && (
                                <>
                                    {Object.entries(generateCustomTheme(customColor).colors).map(([shade, hex]) => (
                                        <div
                                            key={shade}
                                            className="h-6 w-6 rounded-full border border-white shadow-sm"
                                            style={{ backgroundColor: hex }}
                                            title={`${shade}: ${hex}`}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleCustomSave}
                            className="ml-auto rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
