<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aspirasi extends Model
{
    use HasFactory;

    protected $table = 'aspirasi';
    protected $primaryKey = 'id_aspirasi';

    protected $fillable = [
        'judul',
        'nis',
        'id_kategori',
        'kategori_manual',
        'lokasi',
        'tujuan',
        'tanggal_kejadian',
        'ket',
        'lampiran',
        'status',
        'feedback',
    ];

    // Relasi balik ke Siswa
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'nis', 'nis');
    }

    // Relasi balik ke Kategori
    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }
}
