<?php

namespace App\Http\Controllers;

use App\Models\Aspirasi;
use App\Models\FaqChatbot;
use App\Models\TiketBantuan;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    // ===============================================
    // DASHBOARD ADMIN & FAQ MANAGEMENT
    // ===============================================
    public function indexTiket()
    {
        $tikets = TiketBantuan::with('user')
            ->orderBy('status', 'asc')
            ->orderBy('deadline_at', 'asc')
            ->get();

        return Inertia::render('Admin/Chatbot/index', [
            'tikets' => $tikets,
            'faqs' => FaqChatbot::all()
        ]);
    }

    public function storeFaq(Request $request)
    {
        $request->validate([
            'keyword' => 'required|string',
            'pertanyaan' => 'required|string',
            'isi_jawaban' => 'required|string',
        ]);

        FaqChatbot::create([
            'keyword' => strtolower($request->keyword),
            'pertanyaan' => $request->pertanyaan,
            'jawaban' => $request->isi_jawaban,
            'kategori' => $request->kategori ?? 'umum',
        ]);

        return redirect()->back()->with('message', 'Template jawaban bot berhasil ditambahkan!');
    }

    public function updateFaq(Request $request, $id)
    {
        $request->validate([
            'keyword' => 'required|string',
            'pertanyaan' => 'required|string',
            'jawaban' => 'required|string',
        ]);

        $faq = FaqChatbot::findOrFail($id);
        $faq->update([
            'keyword' => strtolower($request->keyword),
            'pertanyaan' => $request->pertanyaan,
            'jawaban' => $request->jawaban,
        ]);

        return redirect()->back()->with('message', 'Template FAQ berhasil diperbarui!');
    }

    public function destroyFaq($id)
    {
        FaqChatbot::destroy($id);
        return redirect()->back()->with('message', 'Template FAQ berhasil dihapus!');
    }

    public function importFaqCsv(Request $request)
    {
        $request->validate(['file_csv' => 'required|mimes:csv,txt']);
        $file = $request->file('file_csv');
        $fileHandle = fopen($file->getPathname(), 'r');
        fgetcsv($fileHandle); // Lewati header

        while (($row = fgetcsv($fileHandle)) !== false) {
            if (count($row) >= 3) {
                FaqChatbot::create([
                    'keyword' => strtolower($row[0]),
                    'pertanyaan' => $row[1],
                    'jawaban' => $row[2],
                    'kategori' => 'umum'
                ]);
            }
        }
        fclose($fileHandle);
        return redirect()->back()->with('message', 'Ratusan FAQ berhasil di-import dari CSV!');
    }

    // ===============================================
    // TARIK DATA FAQ UNTUK MENU KLIK DI WIDGET
    // ===============================================
    public function getFaqs()
    {
        // Mengambil FAQ dan mengelompokkannya berdasarkan 'kategori'
        $faqs = FaqChatbot::all()->groupBy('kategori');
        return response()->json($faqs);
    }

    // ===============================================
    // ENGINE CHATBOT (ANTI-SPAM TIKET)
    // ===============================================
    public function handleChat(Request $request)
    {
        $request->validate(['pesan' => 'required|string|max:500']);
        $pesanSiswa = strtolower($request->pesan);

        // LANGKAH 1: CARI DI DATABASE MANUAL DULU (Paling Cepat & Aman)
        // Jika ada siswa yang nge-klik pertanyaan dari menu, pasti langsung ketemu di sini.
        $dbMatch = FaqChatbot::where('keyword', 'LIKE', "%{$pesanSiswa}%")
            ->orWhere('pertanyaan', 'LIKE', "%{$pesanSiswa}%")
            ->first();

        if ($dbMatch) {
            return response()->json([
                'status' => 'success',
                'sender' => 'bot',
                'reply' => $dbMatch->jawaban
            ]);
        }

        // LANGKAH 2: JIKA TIDAK KETEMU DI DB, COBA PAKAI AI GEMINI
        try {
            $faqs = FaqChatbot::all();
            $faqContext = "DATA SEKOLAH:\n";
            foreach ($faqs as $faq) {
                $faqContext .= "- {$faq->pertanyaan} Jawab: {$faq->jawaban}\n";
            }

            // 2. SYSTEM PROMPT (Versi Ultimate - Paham Aplikasi)
            $systemPrompt = "
            [KONTEKS & PERAN]
            Kamu adalah 'Asisten SuaraSiswa', sebuah AI Helpdesk resmi milik SMK Taruna Bhakti.
            Gaya bahasamu: Asik, ramah, dan sopan layaknya kakak kelas OSIS yang peduli adik kelasnya (gunakan kata sapaan 'kamu', 'aku', 'kak').

            [PANDUAN APLIKASI SUARASISWA (WAJIB TAHU!)]
            Jika siswa bertanya tentang fitur atau cara pakai aplikasi ini, gunakan panduan berikut:
            1. Buat Laporan / Komplain: Jika siswa ingin melapor fasilitas rusak (AC mati, kran patah, wifi error) atau masalah lain, arahkan mereka untuk pergi ke halaman 'Dashboard', lalu pilih tab '📝 Mode Form'.
            2. Cek Status Laporan: Jika siswa bertanya 'laporanku udah diproses belum?', arahkan mereka untuk mengeklik menu 'Histori' di sidebar kiri, atau melihat bagian 'Riwayat Terbaru' di sisi kanan Dashboard.
            3. Fungsi Obrolan Ini: Beritahu bahwa chat/widget ini khusus untuk tanya-jawab informasi cepat (seputar jadwal, seragam, PKL, dll).

            [DATA SEKOLAH (FAQ)]
            {$faqContext}

            [ATURAN MUTLAK - DILARANG DILANGGAR]
            1. JIKA siswa mengeluh/curhat fasilitas rusak di chat ini, JANGAN suruh lapor ke guru/TU manual. Arahkan mereka untuk klik tombol Lapor di Dashboard (Sesuai Panduan Aplikasi No. 1).
            2. JIKA bertanya hal di luar sekolah atau aplikasi (seperti rumus matematika, coding, cuaca, politik), tolak dengan halus karena itu bukan tugasmu.
            3. Jawab HANYA berdasarkan Panduan Aplikasi dan Data Sekolah di atas. Jika benar-benar tidak ada infonya, katakan dengan jujur bahwa kamu belum tahu.

            Pertanyaan dari siswa: " . $pesanSiswa;
            // Pastikan kita membaca API Key dengan benar
            $apiKey = env('GEMINI_API_KEY');

            // JIKA API KEY KOSONG (Laravel gagal baca .env)
            if (!$apiKey) {
                throw new \Exception("Gawat! Laravel tidak bisa membaca GEMINI_API_KEY dari file .env kamu.");
            }
            $response = Http::timeout(15)->withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey, [
                'contents' => [['role' => 'user', 'parts' => [['text' => $systemPrompt]]]]
            ]);

            // Jika sukses (Status 200 OK)
            if ($response->successful()) {
                $botReply = $response->json('candidates.0.content.parts.0.text');
                if ($botReply) {
                    return response()->json(['status' => 'success', 'sender' => 'bot', 'reply' => $botReply]);
                }
                throw new \Exception("Google membalas sukses, tapi isinya kosong! Detail: " . $response->body());
            }

            // JIKA DITOLAK GOOGLE (Status 400, 403, 500)
            throw new \Exception("DITOLAK GOOGLE (Status " . $response->status() . "): " . $response->body());
        } catch (\Exception $e) {
            // Catat error aslinya secara diam-diam di log laravel
            Log::error('CHATBOT FAIL: ' . $e->getMessage());

            // Tampilkan pesan anggun ke siswa + Tombol Bikin Tiket
            return response()->json([
                'status' => 'ask_ticket',
                'sender' => 'bot',
                'reply' => "Maaf Kak, server pusat SuaraSiswa kebetulan lagi padat banget nih. Apakah kamu ingin pesannya aku teruskan aja ke Admin Tata Usaha biar dijawab manual?"
            ]);
        }
    }

    // Fungsi Baru Khusus Membuat Tiket (Jika siswa setuju)
    public function buatTiket(Request $request)
    {
        $request->validate(['pesan' => 'required|string']);

        $tiket = TiketBantuan::create([
            'username' => Auth::user()->username,
            'pertanyaan_siswa' => $request->pesan,
            'status' => 'pending',
            'deadline_at' => Carbon::now()->addDay(),
        ]);

        return response()->json([
            'status' => 'success',
            'reply' => "Sip! Pertanyaanmu sudah diteruskan ke Admin (Tiket #{$tiket->id}). Mohon tunggu balasannya di riwayat obrolan ini maksimal 1x24 jam ya."
        ]);
    }

    // ===============================================
    // FLOW LAINNYA
    // ===============================================

    public function laporAspirasi(Request $request)
    {
        // 1. Tambahkan 'tujuan' di validasi
        $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string',
            'tujuan' => 'required|string', // <-- BARU
            'lokasi' => 'required|string',
            'ket' => 'required|string',
            'lampiran' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('lampiran')) {
            $path = $request->file('lampiran')->store('aspirasi_files', 'public');
        }

        $aspirasi = Aspirasi::create([
            'username' => Auth::user()->username,
            'judul' => $request->judul,
            'lokasi' => $request->lokasi,
            'id_kategori' => null,
            'kategori_manual' => $request->kategori, // Otomatis diset "Lainnya (Via Chat)" dari React
            'tujuan' => $request->tujuan, // <-- BARU (Menangkap dari tombol React)
            'tanggal_kejadian' => Carbon::now()->toDateString(),
            'ket' => $request->ket,
            'lampiran' => $path,
            'status' => 'Menunggu'
        ]);

        $idAspirasi = $aspirasi->id_aspirasi ?? $aspirasi->id;

        return response()->json([
            'status' => 'success',
            'message' => "Sip! Laporanmu berhasil dicatat dengan ID #ASP-{$idAspirasi}. Tim {$request->tujuan} akan segera menindaklanjutinya. Pantau terus statusnya di menu Histori ya!"
        ]);
    }

    public function cekStatus()
    {
        $aspirasis = Aspirasi::where('username', Auth::user()->username)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        if ($aspirasis->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'reply' => "Kamu belum punya riwayat laporan masalah. Silakan gunakan form laporan jika ada kendala."
            ]);
        }

        $replyText = "Berikut adalah status dari 3 laporan terakhirmu:\n\n";

        foreach ($aspirasis as $asp) {
            $emoji = $asp->status === 'Selesai' ? '🟢' : ($asp->status === 'Proses' ? '🔵' : '🟠');
            $replyText .= "{$emoji} *{$asp->judul}*\n";
            $replyText .= "Status: {$asp->status}\n";
            if ($asp->feedback) {
                $replyText .= "Balasan: \"{$asp->feedback}\"\n";
            }
            $replyText .= "──────────────\n";
        }

        return response()->json([
            'status' => 'success',
            'reply' => $replyText
        ]);
    }

    public function getHistory()
    {

        $tikets = TiketBantuan::where('username', Auth::user()->username)
            ->where(function ($query) {
                $query->where('status', 'pending')
                    ->orWhere('updated_at', '>=', Carbon::now()->subMinutes(15));
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($tikets);
    }

    public function jawabTiket(Request $request, $id)
    {
        $request->validate(['jawaban' => 'required|string']);

        $tiket = TiketBantuan::findOrFail($id);
        $tiket->update([
            'jawaban_admin' => $request->jawaban,
            'status' => 'terjawab'
        ]);

        return redirect()->back()->with('message', 'Jawaban berhasil dikirim ke siswa!');
    }
}
