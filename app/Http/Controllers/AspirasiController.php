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

        // 1. BUAT QUERY DASAR (Mencakup hak akses, bulan, dan kategori)
        $query = Aspirasi::query();

        // -> Filter Hak Akses Role
        if ($user->role === 'siswa') {
            $query->where('username', $user->username);
        } elseif ($user->role !== 'admin') {
            $query->where('tujuan', strtoupper($user->role));
        }

        // -> Filter Periode Bulan (Berlaku untuk Tabel & Statistik)
        if ($request->filled('periode')) {
            $tahun = substr($request->periode, 0, 4);
            $bulan = substr($request->periode, 5, 2);
            $query->whereYear('tanggal_kejadian', $tahun)
                ->whereMonth('tanggal_kejadian', $bulan);
        }

        // -> Filter Kategori (Berlaku untuk Tabel & Statistik)
        if ($request->filled('kategori') && $request->kategori !== 'semua') {
            if ($request->kategori === 'manual') {
                $query->whereNull('id_kategori')->whereNotNull('kategori_manual');
            } else {
                $query->where('id_kategori', $request->kategori);
            }
        }

        // 2. HITUNG KARTU STATISTIK 
        // (Dihitung di sini agar angkanya sesuai dengan bulan/kategori yang dipilih)
        $statusTerakhir = '-';
        if ($user->role === 'siswa') {
            $laporanTerbaru = (clone $query)->latest('created_at')->first();
            if ($laporanTerbaru) {
                $statusTerakhir = $laporanTerbaru->status;
            }
        }

        $stats = [
            'total' => (clone $query)->count(),
            'menunggu' => (clone $query)->where('status', 'Menunggu')->count(),
            'proses' => (clone $query)->where('status', 'Proses')->count(),
            'selesai' => (clone $query)->where('status', 'Selesai')->count(),
            'terakhir' => $statusTerakhir,
        ];

        // 3. LANJUTKAN QUERY UNTUK TABEL (Tambahkan Search & Relasi)
        // Search sengaja ditaruh di bawah agar saat ngetik nama "Budi", Stat Card tidak ikut jadi 0.
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qUser) use ($search) {
                        $qUser->where('nama', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            });
        }

        $aspirasis = $query->with(['user', 'kategori'])
            ->orderBy('tanggal_kejadian', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard', [
            'aspirasis' => $aspirasis,
            'kategoris' => Kategori::all(),
            'stats' => $stats,
            // Pastikan mengirim kembali 'periode' agar input di React tidak kosong setelah direfresh
            'filters' => $request->only(['search', 'kategori', 'periode']),
        ]);
    }
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
            'username' => Auth::user()->username,
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
        // Izinkan semua yang bukan siswa untuk menanggapi (Admin dan Staf)
        if (Auth::user()->role === 'siswa') {
            abort(403, 'Akses Ditolak!');
        }

        $request->validate([
            'status' => 'required|in:Menunggu,Proses,Selesai',
            // Feedback opsional, agar staf bisa sekadar mengubah status jadi "Proses" tanpa harus ngetik balasan
            'feedback' => 'nullable|string',
        ]);

        // Karena kamu memakai Stored Procedure, pastikan pemanggilannya begini:
        DB::statement("CALL update_status_aspirasi(?, ?, ?)", [
            $id,
            $request->status,
            $request->feedback
        ]);

        return redirect()->back()->with('message', 'Tanggapan berhasil dikirim!');
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
            ->where('username', $user->username)
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Tampilkan 10 histori per halaman

        return Inertia::render('Histori/index', [
            'aspirasis' => $aspirasis
        ]);
    }

    public function cetak(Request $request)
    {
        $user = Auth::user();
        $query = Aspirasi::with(['user', 'kategori']);

        // 1. FILTER HAK AKSES ROLE (Wajib ada agar tidak bocor ke divisi lain)
        if ($user->role === 'siswa') {
            abort(403, 'Siswa tidak memiliki akses untuk mencetak laporan.');
        } elseif ($user->role !== 'admin') {
            // Staf hanya bisa mencetak laporan divisinya sendiri
            $query->where('tujuan', strtoupper($user->role));
        }

        // 2. Filter Periode Bulan
        if ($request->filled('periode')) {
            $tahun = substr($request->periode, 0, 4);
            $bulan = substr($request->periode, 5, 2);
            $query->whereYear('tanggal_kejadian', $tahun)
                ->whereMonth('tanggal_kejadian', $bulan);
        }

        // 3. Filter Kategori (Opsional)
        if ($request->filled('kategori') && $request->kategori !== 'semua') {
            if ($request->kategori === 'manual') {
                $query->whereNull('id_kategori')->whereNotNull('kategori_manual');
            } else {
                $query->where('id_kategori', $request->kategori);
            }
        }

        // 4. Urutkan berdasarkan tanggal kejadian agar rapi saat dibaca
        $aspirasis = $query->orderBy('tanggal_kejadian', 'asc')->get();

        // Kita juga kirim data $request agar di tampilan PDF bisa dimunculkan judul 
        // "Laporan Bulan: April 2026"
        return view('cetak-laporan', compact('aspirasis', 'request', 'user'));
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
