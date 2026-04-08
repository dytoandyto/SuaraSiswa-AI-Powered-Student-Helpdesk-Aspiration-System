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
        $query = Aspirasi::with(['siswa', 'kategori']);

        if ($user->role === 'admin') {
            // Filter Admin
            $stats = [
                'total' => Aspirasi::count(),
                'menunggu' => Aspirasi::where('status', 'Menunggu')->count(),
                'proses' => Aspirasi::where('status', 'Proses')->count(),
                'selesai' => Aspirasi::where('status', 'Selesai')->count(),
            ];

            if ($request->filled('tanggal')) $query->whereDate('created_at', $request->tanggal);
            if ($request->filled('bulan')) $query->whereMonth('created_at', $request->bulan);
            if ($request->filled('kategori')) $query->where('id_kategori', $request->kategori);
            if ($request->filled('search')) {
                $query->whereHas('siswa', function ($q) use ($request) {
                    $q->where('nama', 'like', '%' . $request->search . '%')
                        ->orWhere('nis', $request->search);
                });
            }
            // Admin: Gunakan paginate
            $aspirasis = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        } else {
            // Siswa: WAJIB gunakan paginate juga agar formatnya sama ({ data: [...] })
            $aspirasis = $query->where('nis', $user->nis)
                ->orderBy('created_at', 'desc')
                ->paginate(5) // Siswa lihat 5 per halaman
                ->withQueryString();
            $stats = [
                'total' => Aspirasi::where('nis', $user->nis)->count(),
                'terakhir' => Aspirasi::where('nis', $user->nis)->latest()->first()?->status ?? '-',
            ];
        }
        return Inertia::render('Dashboard', [
            'kategoris' => Kategori::all(),
            'aspirasis' => $aspirasis, // Sekarang ini selalu berupa Object Pagination
            'stats' => $stats,
            'filters' => $request->only(['tanggal', 'bulan', 'kategori', 'search'])
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
}
