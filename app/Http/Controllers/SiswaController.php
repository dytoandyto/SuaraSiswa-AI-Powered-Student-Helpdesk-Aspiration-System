<?php

namespace App\Http\Controllers;

use App\Imports\SiswaImport;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::where('role', 'siswa');

        // Filter Pencarian (Nama / NIS)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('nis', 'like', "%{$request->search}%");
            });
        }

        // Filter Kategori Kelas
        if ($request->kelas) {
            $query->where('kelas', $request->kelas);
        }

        // Ambil daftar kelas unik untuk dropdown filter
        $kelasList = Siswa::where('role', 'siswa')
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas', 'asc')
            ->pluck('kelas');

        return Inertia::render('Siswa/index', [
            'siswas' => $query->orderBy('nama', 'asc')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'kelas']),
            'kelasList' => $kelasList
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nis' => 'required|unique:siswa,nis|max:20',
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
        ]);

        Siswa::create([
            'nis' => $request->nis,
            'nama' => $request->nama,
            'kelas' => $request->kelas,
            'password' => Hash::make('siswa123'), // Password default
            'role' => 'siswa',
        ]);

        return redirect()->back()->with('message', 'Siswa baru berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nis' => 'required|max:20|unique:siswa,nis,' . $siswa->id,
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
        ]);

        $siswa->update($request->only('nis', 'nama', 'kelas'));

        return redirect()->back()->with('message', 'Data siswa berhasil diperbarui!');
    }

    public function resetPassword($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->update(['password' => Hash::make('siswa123')]);

        return redirect()->back()->with('message', 'Password ' . $siswa->nama . ' telah direset ke default.');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv|max:2048']);
        Excel::import(new SiswaImport, $request->file('file'));
        return redirect()->back()->with('message', 'Data siswa berhasil di-import dari Excel.');
    }

    public function destroy($id)
    {
        Siswa::destroy($id);
        return redirect()->back()->with('message', 'Siswa berhasil dihapus.');
    }
}