<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Users/Index', ['users' => $users]);
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => 'required|in:admin,accountant',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('users.index');
    }

    public function update(Request $request, User $user)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'role' => 'required|in:admin,accountant',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return redirect()->route('users.index');
    }
}
