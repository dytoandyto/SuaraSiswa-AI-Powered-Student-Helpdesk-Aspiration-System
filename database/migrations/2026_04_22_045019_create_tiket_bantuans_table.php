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
        Schema::create('tiket_bantuans', function (Blueprint $table) {
            $table->id();
            $table->string('username'); // Relasi NIS
            $table->text('pertanyaan_siswa');
            $table->text('jawaban_admin')->nullable();
            $table->enum('status', ['pending', 'terjawab'])->default('pending');
            $table->timestamp('deadline_at'); // Untuk fitur anti-terlantar (SLA 24 jam)
            $table->timestamps();

            $table->foreign('username')->references('username')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket_bantuans');
    }
};
