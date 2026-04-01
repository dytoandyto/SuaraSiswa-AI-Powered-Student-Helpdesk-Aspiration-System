<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Siswa extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'siswa'; // Paksa pakai tabel tunggal

    protected $fillable = [
        'nis',
        'nama',
        'kelas',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relasi: Satu siswa bisa punya banyak aspirasi
    public function aspirasi()
    {
        return $this->hasMany(Aspirasi::class, 'nis', 'nis');
    }
}
