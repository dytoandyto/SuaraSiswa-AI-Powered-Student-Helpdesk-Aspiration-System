<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            // NIS (Sesuai soal int 10, tapi biasanya string lebih aman untuk angka unik)
            $table->string('nis', 10)->unique();
            $table->string('nama', 100);
            $table->string('kelas');
            $table->enum('role', ['admin', 'siswa'])->default('siswa'); // Penentu hak akses
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
