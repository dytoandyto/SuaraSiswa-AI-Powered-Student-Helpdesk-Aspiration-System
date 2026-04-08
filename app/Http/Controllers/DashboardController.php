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

        // Jika dia Admin
        if ($user->role === 'admin') {
            return Inertia::render('Dashboard', [
                'aspirasis' => Aspirasi::with(['siswa', 'kategori'])
                    ->orderBy('created_at', 'desc')
                    ->get(),
                'kategoris' => Kategori::all(), // Tetap kirim kategori jika admin ingin edit
            ]);
        }

        // Jika dia Siswa
        return Inertia::render('Dashboard', [
            'kategoris' => Kategori::all(),
            'aspirasis' => Aspirasi::with('kategori')
                ->where('nis', $user->nis)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }
}
