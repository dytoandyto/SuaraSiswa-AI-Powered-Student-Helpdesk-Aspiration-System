<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // 1. $table = 'siswa' DIHAPUS. 
    // Karena nama modelnya User, Laravel otomatis tahu tabelnya adalah 'users'.

    protected $fillable = [
        'username', // Ini pengganti 'nis'
        'nama',
        'kelas',
        'role',     // Jangan lupa tambahkan role agar bisa di-insert
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed', // Fitur keamanan bawaan Laravel 11/12
        ];
    }

    // --- FITUR BAWAAN DARI MODEL SISWA LAMA ---

    protected $appends = ['name'];

    // Ini dipertahankan agar kalau di file React kamu memanggil {auth.user.name}, 
    // datanya tetap muncul dan tidak menyebabkan error.
    public function getNameAttribute()
    {
        return $this->nama;
    }

}