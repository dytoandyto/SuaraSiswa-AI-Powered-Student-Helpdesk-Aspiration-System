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
            // id_kategori dibuat nullable karena user bisa pilih input manual
            $table->unsignedBigInteger('id_kategori')->nullable()->change();
            $table->string('kategori_manual')->nullable()->after('id_kategori');
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
