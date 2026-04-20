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
        Schema::create('aspirasi', function (Blueprint $table) {
            $table->id('id_aspirasi');
            $table->string('judul');

            // PASTIKAN DUA BARIS INI MENGGUNAKAN 'username' BUKAN 'nis'
            $table->string('username', 20);
            $table->foreign('username')->references('username')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('id_kategori')->nullable();
            $table->foreign('id_kategori')->references('id_kategori')->on('kategori')->onDelete('cascade');
            $table->string('kategori_manual')->nullable();

            $table->string('lokasi');
            $table->string('tujuan');
            $table->date('tanggal_kejadian');
            $table->text('ket');
            $table->string('lampiran')->nullable();
            $table->enum('status', ['Menunggu', 'Proses', 'Selesai'])->default('Menunggu');
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aspirasi');
    }
};
