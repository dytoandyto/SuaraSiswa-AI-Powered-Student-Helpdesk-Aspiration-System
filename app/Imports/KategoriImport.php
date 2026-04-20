<?php

namespace App\Imports;

use App\Models\Kategori;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class KategoriImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // 1. Tambahkan pengecekan ini:
        // Jika kolom 'kategori' kosong atau hanya berisi spasi, jangan simpan (return null)
        if (!isset($row['kategori']) || empty(trim($row['kategori']))) {
            return null;
        }

        return new Kategori([
            // Pastikan 'kategori' di sini sesuai dengan header di Excel kamu
            'ket_kategori' => $row['kategori'],
        ]);
    }
    public function batchSize(): int
    {
        return 100;
    }

    // Membaca file excel per 100 baris agar RAM laptop/server tidak penuh
    public function chunkSize(): int
    {
        return 100;
    }
}
