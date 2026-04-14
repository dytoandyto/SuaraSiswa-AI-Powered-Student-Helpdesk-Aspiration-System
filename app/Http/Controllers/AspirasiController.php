<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan ini untuk Stored Procedure
use Inertia\Inertia;

class AspirasiController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // --- QUERY UNTUK TABEL (DENGAN FILTER & PAGINATION) ---
        $queryTable = Aspirasi::with(['siswa', 'kategori']);

        // 1. Filter Role (Siswa hanya melihat laporannya sendiri)
        if ($user->role === 'siswa') {
            $queryTable->where('nis', $user->nis);
        }

        // 2. Filter Periode Waktu (Dari - Sampai)
        if ($request->filled('dari_tanggal') && $request->filled('sampai_tanggal')) {
            $queryTable->whereBetween('tanggal_kejadian', [$request->dari_tanggal, $request->sampai_tanggal]);
        }

        // 3. Filter Kategori
        if ($request->filled('kategori') && $request->kategori !== 'semua') {
            if ($request->kategori === 'manual') {
                $queryTable->whereNull('id_kategori')->whereNotNull('kategori_manual');
            } else {
                $queryTable->where('id_kategori', $request->kategori);
            }
        }

        // 4. Filter Pencarian Teks
        if ($request->filled('search')) {
            $search = $request->search;
            $queryTable->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%")
                    ->orWhere('ket', 'like', "%{$search}%")
                    ->orWhereHas('siswa', function ($qSiswa) use ($search) {
                        $qSiswa->where('nama', 'like', "%{$search}%")
                            ->orWhere('nis', 'like', "%{$search}%");
                    });
            });
        }

        $aspirasis = $queryTable->orderBy('created_at', 'desc')->paginate(10)->withQueryString();


        // --- QUERY UNTUK STATISTIK (MURNI, TANPA PAGINATION & FILTER PENCARIAN) ---
        // Jika kamu ingin angkanya TETAP menghitung "Total Keseluruhan" meskipun Admin sedang mencari kata kunci tertentu:
        $queryStats = Aspirasi::query();

        if ($user->role === 'siswa') {
            // Siswa tetap hanya menghitung statistik dari laporannya sendiri
            $queryStats->where('nis', $user->nis);
        }

        // Ambil status terbaru untuk siswa (tanpa error jika kosong)
        $statusTerakhir = '-';
        if ($user->role === 'siswa') {
            $laporanTerbaru = (clone $queryStats)->latest('created_at')->first();
            if ($laporanTerbaru) {
                $statusTerakhir = $laporanTerbaru->status;
            }
        }

        $stats = [
            'total' => (clone $queryStats)->count(),
            'menunggu' => (clone $queryStats)->where('status', 'Menunggu')->count(),
            'proses' => (clone $queryStats)->where('status', 'Proses')->count(),
            'selesai' => (clone $queryStats)->where('status', 'Selesai')->count(),
            'terakhir' => $statusTerakhir,
        ];

        return Inertia::render('Dashboard', [
            'aspirasis' => $aspirasis,
            'kategoris' => Kategori::all(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'kategori', 'dari_tanggal', 'sampai_tanggal']),
        ]);
    }

    // Method store dan update tetap sama...
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|max:255',
            'id_kategori' => 'required',
            'lokasi' => 'required',
            'tujuan' => 'required',
            'tanggal_kejadian' => 'required|date',
            'ket' => 'required',
            'lampiran' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048', // Max 2MB
        ]);

        $path = null;
        if ($request->hasFile('lampiran')) {
            $path = $request->file('lampiran')->store('aspirasi_files', 'public');
        }
        $id_kategori = $request->id_kategori === 'manual' ? null : $request->id_kategori;
        $kategori_manual = $request->id_kategori === 'manual' ? $request->kategori_manual : null;

        $path = null;
        if ($request->hasFile('lampiran')) {
            $path = $request->file('lampiran')->store('aspirasi_files', 'public');
        }

        Aspirasi::create([
            'judul' => $request->judul,
            'nis' => Auth::user()->nis,
            'id_kategori' => $id_kategori,
            'kategori_manual' => $kategori_manual,
            'lokasi' => $request->lokasi,
            'tujuan' => $request->tujuan,
            'tanggal_kejadian' => $request->tanggal_kejadian,
            'ket' => $request->ket,
            'lampiran' => $path,
            'status' => 'Menunggu',
        ]);

        return redirect()->back()->with('message', 'Aspirasi berhasil dikirim dengan lampiran!');
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Anda bukan admin!');
        }
        $request->validate([
            'status' => 'required|in:Menunggu,Proses,Selesai',
            'feedback' => 'required',
        ]);

        DB::statement("CALL update_status_aspirasi(?, ?, ?)", [
            $id,
            $request->status,
            $request->feedback
        ]);

        return redirect()->back()->with('message', 'Tanggapan berhasil dikirim!');
    }
    public function destroy($id)
    {
        $aspirasi = Aspirasi::findOrFail($id);

        // Keamanan: Siswa cuma bisa hapus punya sendiri & yang belum diproses
        if ($aspirasi->nis == Auth::user()->nis && $aspirasi->status == 'Menunggu') {
            $aspirasi->delete();
            return redirect()->back()->with('message', 'Laporan berhasil dibatalkan.');
        }

        return redirect()->back()->with('message', 'Tidak bisa menghapus laporan yang sudah diproses.');
    }
    // Method history untuk menampilkan histori aspirasi siswa
    public function history()
    {
        $user = Auth::user();

        // Pastikan hanya siswa yang punya histori
        if ($user->role === 'admin') {
            return redirect()->route('dashboard');
        }

        $aspirasis = Aspirasi::with(['kategori'])
            ->where('nis', $user->nis)
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Tampilkan 10 histori per halaman

        return Inertia::render('Histori/index', [
            'aspirasis' => $aspirasis
        ]);
    }

    public function cetak(Request $request)
    {
        $query = Aspirasi::with(['siswa', 'kategori']);

        // 1. Filter "Cuma Beberapa" (Berdasarkan Pilihan Checkbox)
        if ($request->ids) {
            $ids = explode(',', $request->ids);
            $query->whereIn('id_aspirasi', $ids);
        }

        // 2. Filter Periode Waktu (Dari - Sampai)
        if ($request->dari_tanggal && $request->sampai_tanggal) {
            $query->whereBetween('tanggal_kejadian', [$request->dari_tanggal, $request->sampai_tanggal]);
        }

        // 3. Filter Kategori Tertentu
        if ($request->kategori && $request->kategori !== 'semua') {
            $query->where('id_kategori', $request->kategori);
        }

        $aspirasis = $query->orderBy('created_at', 'desc')->get();

        return view('cetak-laporan', compact('aspirasis'));
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        // Hapus semua aspirasi yang ID-nya dikirim dari checkbox React
        \App\Models\Aspirasi::whereIn('id_aspirasi', $request->ids)->delete();

        return redirect()->back()->with('message', count($request->ids) . ' laporan berhasil dihapus secara massal.');
    }
}
