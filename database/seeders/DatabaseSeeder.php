<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $passwordDefault = Hash::make('password123');

        $users = [
            [
                'username' => 'admin',
                'nama'     => 'Administrator Sistem',
                'kelas'    => null,
                'role'     => 'admin',
                'password' => $passwordDefault,
            ],
            [
                'username' => 'sarpras',
                'nama'     => 'Waka Sarana Prasarana',
                'kelas'    => null,
                'role'     => 'sarpras',
                'password' => $passwordDefault,
            ],
            [
                'username' => 'kesiswaan',
                'nama'     => 'Waka Kesiswaan',
                'kelas'    => null,
                'role'     => 'kesiswaan',
                'password' => $passwordDefault,
            ],
            [
                'username' => 'kurikulum',
                'nama'     => 'Waka Kurikulum',
                'kelas'    => null,
                'role'     => 'kurikulum',
                'password' => $passwordDefault,
            ],
            [
                'username' => 'hubin',
                'nama'     => 'Hubungan Industri (Hubin)',
                'kelas'    => null,
                'role'     => 'hubin',
                'password' => $passwordDefault,
            ],
            [
                'username' => 'sims',
                'nama'     => 'Tim SIMS',
                'kelas'    => null,
                'role'     => 'sims',
                'password' => $passwordDefault,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
