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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // Ganti 'nis' jadi 'username' agar fleksibel untuk semua orang
            $table->string('username', 20)->unique();
            $table->string('nama', 100);
            $table->string('kelas')->nullable(); // Boleh kosong (nullable) karena Sarpras/Admin tidak punya kelas

            // Tambahkan semua role baru di sini
            $table->enum('role', [
                'admin',
                'siswa',
                'sarpras',
                'hubin',
                'sims',
                'kesiswaan',
                'kurikulum'
            ])->default('siswa');

            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
