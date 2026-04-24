<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\User; 

class TiketBantuan extends Model
{
    protected $guarded = [];
    protected $appends = ['sisa_waktu'];

    public function user()
    {
        // Hubungkan username di tiket ke username di tabel users
        return $this->belongsTo(User::class, 'username', 'username');
    }

    public function getSisaWaktuAttribute()
    {
        if ($this->status === 'terjawab') return 'Teratasi';

        $deadline = Carbon::parse($this->deadline_at);
        $now = Carbon::now();

        if ($now->greaterThan($deadline)) {
            return 'Melewati Batas!';
        }

        $diffHours = $now->diffInHours($deadline);

        // Jika sisa waktu kurang dari 1 jam, tampilkan menit agar lebih presisi
        if ($diffHours < 1) {
            return $now->diffInMinutes($deadline) . " Menit lagi";
        }

        return $diffHours . " Jam lagi";
    }
}
