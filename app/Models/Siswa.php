<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // WAJIB INI
use Illuminate\Notifications\Notifiable;

class Siswa extends Authenticatable
{
    use Notifiable;
    protected $table = 'siswa';
    protected $fillable = ['nis', 'nama', 'kelas', 'password'];
    protected $appends = ['name'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getNameAttribute()
    {
        return $this->nama;
    }
    public function getAuthPassword()
    {
        return $this->password;
    }
}
