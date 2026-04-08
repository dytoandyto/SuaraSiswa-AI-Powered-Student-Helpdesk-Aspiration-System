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
        Schema::table('aspirasi', function (Blueprint $table) {
            $table->string('judul')->after('id_aspirasi');
            $table->string('tujuan')->after('lokasi'); // Contoh: Ke Sarpras, Ke Kesiswaan
            $table->date('tanggal_kejadian')->after('tujuan');
            $table->string('lampiran')->nullable()->after('ket'); // Untuk simpan nama file
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aspirasi', function (Blueprint $table) {
            //
        });
    }
};
