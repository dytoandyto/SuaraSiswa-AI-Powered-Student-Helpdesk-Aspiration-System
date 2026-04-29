<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use App\Models\Kategori;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AspirasiController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. BUAT QUERY DASAR
        $query = Aspirasi::query();

        // -> Filter Hak Akses Role
        if ($user->role === 'siswa') {
            $query->where('username', $user->username);
        } elseif ($user->role !== 'admin') {
            $query->where('tujuan', strtoupper($user->role));
        }

        // --- PINDAHKAN PENCARIAN KE SINI (AGAR STATISTIK IKUT TER-FILTER) ---
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

        // -> Logika Cabang Pintar: Filter Rentang Tanggal ATAU Periode Bulan
        if ($request->filled('dari_tanggal') && $request->filled('sampai_tanggal')) {
            $query->whereBetween('tanggal_kejadian', [$request->dari_tanggal, $request->sampai_tanggal]);
        } elseif ($request->filled('periode')) {
            $tahun = substr($request->periode, 0, 4);
            $bulan = substr($request->periode, 5, 2);
            $query->whereYear('tanggal_kejadian', $tahun)
                ->whereMonth('tanggal_kejadian', $bulan);
        }

        // -> Filter Kategori
        if ($request->filled('kategori') && $request->kategori !== 'semua') {
            if ($request->kategori === 'manual') {
                $query->whereNull('id_kategori')->whereNotNull('kategori_manual');
            } else {
                $query->where('id_kategori', $request->kategori);
            }
        }

        // Filter status
        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        // 2. HITUNG KARTU STATISTIK (DILAKUKAN SETELAH SEMUA FILTER DIAPLIKASIKAN)
        // clone $query di sini akan membawa semua filter di atas, termasuk search
        $statusTerakhir = '-';
        if ($user->role === 'siswa') {
            $laporanTerbaru = (clone $query)->latest('created_at')->first();
            if ($laporanTerbaru) {
                $statusTerakhir = $laporanTerbaru->status;
            }
        }

        $rataRating = (clone $query)->whereNotNull('rating')->avg('rating');

        $stats = [
            'total' => (clone $query)->count(),
            'menunggu' => (clone $query)->where('status', 'Menunggu')->count(),
            'proses' => (clone $query)->where('status', 'Proses')->count(),
            'selesai' => (clone $query)->where('status', 'Selesai')->count(),
            'rata-rata-rating' => number_format($rataRating ?: 0, 1),
            'rating_terbaik' => (clone $query)->max('rating') ?? 0,
            'terakhir' => $statusTerakhir,
            'kepuasan' => number_format($rataRating ?: 0, 1),
        ];

        // 3. PAGINASI (HASIL AKHIR)
        $aspirasis = $query->with(['user', 'kategori'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard', [
            'aspirasis' => $aspirasis,
            'kategoris' => Kategori::all(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'kategori', 'periode', 'dari_tanggal', 'sampai_tanggal', 'status']),
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
            'lampiran' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

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
        if (Auth::user()->role === 'siswa') {
            abort(403, 'Akses Ditolak!');
        }

        // 1. Ambil data aspirasi saat ini dari database
        $aspirasi = Aspirasi::findOrFail($id);
        $statusSaatIni = $aspirasi->status;
        $statusBaru = $request->status;

        // 2. LOGIKA PENCEGAHAN (GUARD CLAUSE)

        // A. Jika sudah SELESAI, tidak boleh diubah ke apapun lagi
        if ($statusSaatIni === 'Selesai') {
            return redirect()->back()->with('error', 'Laporan sudah Selesai dan tidak bisa diubah kembali.');
        }

        // B. Jika sudah PROSES, tidak boleh balik ke MENUNGGU
        if ($statusSaatIni === 'Proses' && $statusBaru === 'Menunggu') {
            return redirect()->back()->with('error', 'Laporan sedang diproses, tidak bisa kembali ke Menunggu.');
        }

        // 3. VALIDASI FORM
        $request->validate([
            'status' => 'required|in:Menunggu,Proses,Selesai',
            'feedback' => 'nullable|string',
        ]);

        // 4. EKSEKUSI STORED PROCEDURE
        DB::statement("CALL update_status_aspirasi(?, ?, ?)", [
            $id,
            $statusBaru,
            $request->feedback
        ]);

        return redirect()->back()->with('message', 'Tanggapan berhasil dikirim!');
    }

    public function history()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return redirect()->route('dashboard');
        }

        $aspirasis = Aspirasi::with(['kategori'])
            ->where('username', $user->username)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Histori/index', [
            'aspirasis' => $aspirasis
        ]);
    }

    public function cetak(Request $request)
    {
        $user = Auth::user();
        $query = Aspirasi::with(['user', 'kategori']);

        // 1. FILTER HAK AKSES ROLE
        if ($user->role === 'siswa') {
            abort(403, 'Siswa tidak memiliki akses untuk mencetak laporan.');
        } elseif ($user->role !== 'admin') {
            $query->where('tujuan', strtoupper($user->role));
        }

        // 2. Logika Cabang Pintar Cetak: Filter Rentang Tanggal ATAU Periode Bulan
        if ($request->filled('dari_tanggal') && $request->filled('sampai_tanggal')) {
            $query->whereBetween('tanggal_kejadian', [$request->dari_tanggal, $request->sampai_tanggal]);
        } elseif ($request->filled('periode')) {
            $tahun = substr($request->periode, 0, 4);
            $bulan = substr($request->periode, 5, 2);
            $query->whereYear('tanggal_kejadian', $tahun)
                ->whereMonth('tanggal_kejadian', $bulan);
        }

        // 3. Filter Kategori
        if ($request->filled('kategori') && $request->kategori !== 'semua') {
            if ($request->kategori === 'manual') {
                $query->whereNull('id_kategori')->whereNotNull('kategori_manual');
            } else {
                $query->where('id_kategori', $request->kategori);
            }
        }


        $aspirasis = $query->orderBy('created_at', 'desc')->get();

        return view('cetak-laporan', compact('aspirasis', 'request', 'user'));
    }

    public function beriRating(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Gunakan findOrFail agar kalau error langsung kelihatan
        $aspirasi = Aspirasi::findOrFail($id);

        // Validasi ekstra: Pastikan yang ngisi rating adalah yang bikin laporan
        if ($aspirasi->username !== Auth::user()->username) {
            abort(403, 'Bukan laporan Anda!');
        }

        // Simpan datanya!
        $aspirasi->update([
            'rating' => $request->rating,
        ]);

        return redirect()->back()->with('message', 'Terima kasih! Penilaianmu berhasil dikirim.');
    }
}
