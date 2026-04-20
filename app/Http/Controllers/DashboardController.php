<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Jika admin
        if ($user->role === 'admin') {
            return Inertia::render('Dashboard', [
                'aspirasis' => Aspirasi::with(['siswa', 'kategori'])
                    ->orderBy('created_at', 'desc')
                    ->get(),
                'kategoris' => Kategori::all(), 
            ]);
        }

        // Jika aiswa
        return Inertia::render('Dashboard', [
            'kategoris' => Kategori::all(),
            'aspirasis' => Aspirasi::with('kategori')
                ->where('username', $user->username)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }
}
