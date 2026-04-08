<?php

namespace App\Http\Controllers;

use App\Imports\KategoriImport;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class KategoriController extends Controller
{
    public function index()
    {
        return Inertia::render('Kategori/index', [
            'kategoris' => Kategori::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ket_kategori' => 'required|unique:kategori,ket_kategori|max:255',
        ]);

        Kategori::create($request->all());

        return redirect()->back()->with('message', 'Kategori baru berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Kategori::destroy($id);
        return redirect()->back()->with('message', 'Kategori berhasil dihapus!');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        Excel::import(new KategoriImport, $request->file('file'));

        return redirect()->back()->with('message', 'Daftar kategori berhasil di-import!');
    }
}
