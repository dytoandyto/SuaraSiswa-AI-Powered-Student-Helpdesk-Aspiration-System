<?php

namespace App\Imports;

use App\Models\Kategori;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts; // WAJIB ADA
use Maatwebsite\Excel\Concerns\WithChunkReading; // WAJIB ADA

// Pasang interface-nya di sini agar sistem tahu file ini mau diproses massal
class KategoriImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Jika kolom 'kategori' kosong atau hanya berisi spasi, lewati baris ini
        if (!isset($row['kategori']) || empty(trim($row['kategori']))) {
            return null;
        }

        return new Kategori([
            'ket_kategori' => $row['kategori'],
        ]);
    }
    public function batchSize(): int
    {
        return 500; 
    }

    public function chunkSize(): int
    {
        return 500;
    }
}