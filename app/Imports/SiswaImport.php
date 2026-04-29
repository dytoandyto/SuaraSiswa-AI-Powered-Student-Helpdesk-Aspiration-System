<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

// Tambahkan implement WithBatchInserts dan WithChunkReading
class SiswaImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    private $defaultPassword;

    public function __construct()
    {
        // Kita enkripsi passwordnya CUKUP 1 KALI SAJA di sini pas awal jalan, 
        $this->defaultPassword = Hash::make('siswa123');
    }

    public function model(array $row)
    {
        if (!isset($row['nis']) || !isset($row['nama'])) {
            return null;
        }

        return new User([
            'username' => trim($row['nis']),
            'nama'     => trim($row['nama']),
            'kelas'    => trim($row['kelas']),
            'password' => $this->defaultPassword,
            'role'     => 'siswa',
        ]);
    }

    // MEMBUAT SISTEM BORONGAN (BATCH)
    // Alih-alih insert 1 per 1, Laravel akan kumpulkan 100 data dulu, 
    // lalu tembak ke database sekaligus (1 kali query per 100 data).
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
