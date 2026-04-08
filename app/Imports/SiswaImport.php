<?php

namespace App\Imports;

use App\Models\Siswa;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow; 

class SiswaImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Pastikan nama kolom di Excel sama dengan yang di dalam kurung []
        // dd($row);
        return new Siswa([
            'nis'      => $row['nis'],
            'nama'     => $row['nama'],
            'kelas'    => $row['kelas'],
            'password' => Hash::make($row['password'] ?? 'siswa123'), // Default password jika kosong
            'role'     => 'siswa',
        ]);
    }
}
