<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Siswa::create([
            'nis' => '000',
            'nama' => 'Administrator',
            'kelas' => 'Admin',
            'role' => 'admin',
            'password' => bcrypt('admin123'),
        ]);

        // Buat Siswa Contoh
        Siswa::create([
            'nis' => '12345',
            'nama' => 'Siswa Contoh',
            'kelas' => 'XII RPL 1',
            'role' => 'siswa',
            'password' => bcrypt('siswa123'),
        ]);
    }
}
