<?php

use App\Http\Controllers\AspirasiController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AspirasiController::class, 'index'])->name('dashboard');

    // Kelola Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    // siswa
    Route::middleware(['role:siswa'])->group(function () {
        Route::post('/aspirasi', [AspirasiController::class, 'store'])->name('aspirasi.store');
        Route::get('/histori', [AspirasiController::class, 'history'])->name('aspirasi.history');
        Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])->name('chatbot.history');
        Route::post('/chatbot/lapor', [ChatbotController::class, 'laporAspirasi'])->name('chatbot.lapor'); // Flow A
        Route::post('/chatbot/send', [ChatbotController::class, 'handleChat'])->name('chatbot.send'); // Flow B
        Route::get('/chatbot/status', [ChatbotController::class, 'cekStatus'])->name('chatbot.status'); // status tiket
        Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])->name('chatbot.history'); // riwayat tanya jawab chatbot
        Route::get('/chat-bantuan', function () {
            return Inertia::render('Siswa/ChatBantuan');
        })->name('chat.bantuan');

        Route::get('/chatbot/faqs', [ChatbotController::class, 'getFaqs'])->name('chatbot.faqs');
        Route::post('/chatbot/tiket', [ChatbotController::class, 'buatTiket'])->name('chatbot.tiket');

        Route::patch('/aspirasi/{id}/rating', [AspirasiController::class, 'beriRating'])->name('aspirasi.rating');
    });

    // admin & staf
    Route::middleware(['role:admin,sarpras,sims,kesiswaan,kurikulum,hubin'])->group(function () {
        Route::patch('/aspirasi/{id}', [AspirasiController::class, 'update'])->name('aspirasi.update');
        Route::get('/aspirasi/cetak', [AspirasiController::class, 'cetak'])->name('aspirasi.cetak');
    });

    // admin
    Route::middleware(['role:admin'])->group(function () {
        // Kelola Kategori
        Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
        Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
        Route::delete('/kategori/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
        Route::post('/kategori/import', [KategoriController::class, 'import'])->name('kategori.import');

        // Kelola Pengguna / Siswa
        Route::get('/siswa', [SiswaController::class, 'index'])->name('siswa.index');
        Route::post('/siswa/import', [SiswaController::class, 'import'])->name('siswa.import');
        Route::patch('/siswa/{id}/reset-password', [SiswaController::class, 'resetPassword'])->name('siswa.resetPassword');
        Route::patch('/siswa/{id}', [SiswaController::class, 'update'])->name('siswa.update');
        Route::delete('/siswa/{id}', [SiswaController::class, 'destroy'])->name('siswa.destroy');

        Route::get('/admin/chatbot', [ChatbotController::class, 'indexTiket'])->name('admin.chatbot.index');
        Route::post('/admin/chatbot/faq', [ChatbotController::class, 'storeFaq'])->name('admin.faq.store');
        Route::patch('/admin/chatbot/faq/{id}', [ChatbotController::class, 'updateFaq'])->name('admin.faq.update');
        Route::delete('/admin/chatbot/faq/{id}', [ChatbotController::class, 'destroyFaq'])->name('admin.faq.destroy');
        Route::post('/admin/chatbot/faq/import', [ChatbotController::class, 'importFaqCsv'])->name('admin.faq.importFaqCsv');
        Route::patch('/admin/chatbot/tiket/{id}', [ChatbotController::class, 'jawabTiket'])->name('admin.tiket.jawab');
    });

    Route::get('/cek-gemini', function () {
        $apiKey = env('GEMINI_API_KEY');

        // Tembak API Google khusus untuk melihat daftar model yang diizinkan
        $response = Http::withoutVerifying()
            ->get('https://generativelanguage.googleapis.com/v1beta/models?key=' . $apiKey);

        return response()->json($response->json());
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
