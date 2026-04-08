<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['ket_kategori' => 'Sarana'],
            ['ket_kategori' => 'Prasarana'],
            ['ket_kategori' => 'Kebersihan'],
            ['ket_kategori' => 'Lain-lain'],
        ];

        foreach ($data as $item) {
            Kategori::create($item);
        }
    }
}
