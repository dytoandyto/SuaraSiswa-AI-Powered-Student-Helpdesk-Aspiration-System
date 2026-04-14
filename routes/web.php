<?php

use App\Http\Controllers\AspirasiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Jika sudah login, langsung lempar ke dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    // Jika belum, tampilkan halaman welcome
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // Halaman Dashboard Utama (Otomatis deteksi Admin/Siswa)
    Route::get('/dashboard', [AspirasiController::class, 'index'])->name('dashboard');

    // Action untuk Siswa
    Route::post('/aspirasi', [AspirasiController::class, 'store'])->name('aspirasi.store');

    // Action untuk Admin (Gunakan PATCH atau PUT)
    Route::patch('/aspirasi/{id}', [AspirasiController::class, 'update'])->name('aspirasi.update');

    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
    Route::post('/kategori/import', [KategoriController::class, 'import'])->name('kategori.import');

    Route::get('/histori', [AspirasiController::class, 'history'])->name('aspirasi.history');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::post('/siswa/import', [SiswaController::class, 'import'])->name('siswa.import');
    Route::patch('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::post('/siswa/{id}/reset-password', [SiswaController::class, 'resetPassword'])->name('siswa.reset');
    Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

    Route::get('/aspirasi/cetak', [AspirasiController::class, 'cetak'])->name('aspirasi.cetak');

    Route::post('/aspirasi/bulk-delete', [AspirasiController::class, 'bulkDelete'])->name('aspirasi.bulk_delete');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
