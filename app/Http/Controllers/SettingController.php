<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function branding()
    {
        return Inertia::render('Settings/Branding', [
            'settings' => [
                'logo_path' => Setting::getValue('logo_path'),
                'favicon_path' => Setting::getValue('favicon_path'),
            ],
            'letterhead' => [
                'company_name' => Setting::getValue('letterhead_company_name', config('app.name', 'Income Expense System')),
                'header_text' => Setting::getValue('letterhead_header_text', ''),
                'subheader_text' => Setting::getValue('letterhead_subheader_text', ''),
                'footer_text' => Setting::getValue('letterhead_footer_text', 'This is a computer-generated report. No signature is required.'),
                'show_logo' => Setting::getValue('letterhead_show_logo', '1'),
            ],
        ]);
    }

    public function updateLetterhead(Request $request)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'header_text' => 'nullable|string|max:500',
            'subheader_text' => 'nullable|string|max:500',
            'footer_text' => 'nullable|string|max:500',
            'show_logo' => 'required|in:0,1',
        ]);

        Setting::setValue('letterhead_company_name', $data['company_name']);
        Setting::setValue('letterhead_header_text', $data['header_text']);
        Setting::setValue('letterhead_subheader_text', $data['subheader_text']);
        Setting::setValue('letterhead_footer_text', $data['footer_text']);
        Setting::setValue('letterhead_show_logo', $data['show_logo']);

        return redirect()->route('settings.branding')->with('success', 'Letterhead updated successfully.');
    }

    public function updateLogo(Request $request)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $request->validate([
            'logo' => 'required|file|image|max:2048',
        ]);

        $oldPath = Setting::getValue('logo_path');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('logo')->store('settings', 'public');
        Setting::setValue('logo_path', $path);

        return redirect()->route('settings.branding');
    }

    public function destroyLogo()
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $path = Setting::getValue('logo_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::setValue('logo_path', null);

        return redirect()->route('settings.branding');
    }

    public function updateFavicon(Request $request)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $request->validate([
            'favicon' => 'required|file|max:2048',
        ]);

        $oldPath = Setting::getValue('favicon_path');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('favicon')->store('settings', 'public');
        Setting::setValue('favicon_path', $path);

        return redirect()->route('settings.branding');
    }

    public function destroyFavicon()
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $path = Setting::getValue('favicon_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::setValue('favicon_path', null);

        return redirect()->route('settings.branding');
    }
}
