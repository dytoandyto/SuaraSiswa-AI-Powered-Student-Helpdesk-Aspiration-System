<?php

namespace App\Http\Controllers;

use App\Imports\SiswaImport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'siswa');

        // Filter Pencarian (Nama / username)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('username', 'like', "%{$request->search}%");
            });
        }

        // Filter Kategori Kelas
        if ($request->kelas) {
            $query->where('kelas', $request->kelas);
        }

        // Ambil daftar kelas unik untuk dropdown filter
        $kelasList = User::where('role', 'siswa')
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
            'username' => 'required|unique:siswa,username|max:20',
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
        ]);

        User::create([
            'username' => $request->username,
            'nama' => $request->nama,
            'kelas' => $request->kelas,
            'password' => Hash::make('siswa123'), // Password default
            'role' => 'siswa',
        ]);

        return redirect()->back()->with('message', 'Siswa baru berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $siswa = User::findOrFail($id);

        $request->validate([
            'username' => 'required|max:20|unique:siswa,username,' . $siswa->id,
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
        ]);

        $siswa->update($request->only('username', 'nama', 'kelas'));

        return redirect()->back()->with('message', 'Data siswa berhasil diperbarui!');
    }

    public function resetPassword($id)
    {
        $siswa = User::findOrFail($id);
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
        User::destroy($id);
        return redirect()->back()->with('message', 'Siswa berhasil dihapus.');
    }
}