<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => [
                'logo_path' => Setting::getValue('logo_path'),
                'favicon_path' => Setting::getValue('favicon_path'),
                'sidebar_title' => Setting::getValue('sidebar_title', 'IES'),
                'sidebar_subtitle' => Setting::getValue('sidebar_subtitle', 'Income Expense System'),
            ],
            'letterhead' => [
                'company_name' => Setting::getValue('letterhead_company_name', config('app.name', 'Income Expense System')),
                'header_text' => Setting::getValue('letterhead_header_text', ''),
                'subheader_text' => Setting::getValue('letterhead_subheader_text', ''),
                'footer_text' => Setting::getValue('letterhead_footer_text', 'This is a computer-generated report. No signature is required.'),
                'show_logo' => Setting::getValue('letterhead_show_logo', '1'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
