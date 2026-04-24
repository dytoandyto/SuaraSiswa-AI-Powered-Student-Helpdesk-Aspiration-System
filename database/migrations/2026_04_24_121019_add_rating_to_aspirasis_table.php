<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('aspirasi', function (Blueprint $table) {
            if (!Schema::hasColumn('aspirasi', 'rating')) {
                $table->integer('rating')->nullable();
            }
            if (!Schema::hasColumn('aspirasi', 'ulasan_siswa')) {
                $table->text('ulasan_siswa')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('aspirasi', function (Blueprint $table) {
            $table->dropColumn('rating');
            $table->dropColumn('ulasan_siswa');
        });
    }
};