<?php

namespace Database\Seeders;

use App\Models\FaqChatbot;
use Illuminate\Database\Seeder;

class FaqChatbotSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            // --- KATEGORI: KURIKULUM & AKADEMIK ---
            ['keyword' => 'jadwal pelajaran', 'pertanyaan' => 'Di mana saya bisa melihat jadwal pelajaran?', 'jawaban' => 'Jadwal pelajaran dapat dilihat melalui mading kelas atau melalui menu Akademik di portal website sekolah.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'uts ganjil', 'pertanyaan' => 'Kapan pelaksanaan UTS Ganjil?', 'jawaban' => 'UTS Ganjil biasanya dilaksanakan pada minggu ke-3 bulan September. Pantau terus info di grup kelas.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'uas ganjil', 'pertanyaan' => 'Kapan UAS Ganjil dilaksanakan?', 'jawaban' => 'UAS Ganjil dijadwalkan pada minggu pertama bulan Desember.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'remidial', 'pertanyaan' => 'Bagaimana prosedur remidial?', 'jawaban' => 'Siswa dapat menghubungi guru mata pelajaran terkait maksimal 1 minggu setelah nilai keluar.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'ukk', 'pertanyaan' => 'Apa itu UKK?', 'jawaban' => 'UKK adalah Uji Kompetensi Keahlian untuk menguji kemampuan teknis siswa sesuai jurusan masing-masing.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'ijazah', 'pertanyaan' => 'Kapan ijazah bisa diambil?', 'jawaban' => 'Ijazah biasanya tersedia 1-2 bulan setelah pengumuman kelulusan dan sudah ditandatangani.', 'kategori' => 'Kurikulum'],
            ['keyword' => 'pindah jurusan', 'pertanyaan' => 'Apakah boleh pindah jurusan?', 'jawaban' => 'Perpindahan jurusan hanya diperbolehkan di semester 1 dengan syarat dan ketentuan dari Waka Kurikulum.', 'kategori' => 'Kurikulum'],

            // --- KATEGORI: SARPRAS (FASILITAS) ---
            ['keyword' => 'wifi', 'pertanyaan' => 'Apa password wifi sekolah?', 'jawaban' => 'Untuk login wifi, silakan gunakan username dan password portal siswa masing-masing.', 'kategori' => 'Sarpras'],
            ['keyword' => 'ac mati', 'pertanyaan' => 'Bagaimana jika AC di kelas mati?', 'jawaban' => 'Silakan lapor melalui fitur "Lapor Masalah" di aplikasi SuaraSiswa agar segera dicek tim Sarpras.', 'kategori' => 'Sarpras'],
            ['keyword' => 'buku perpus', 'pertanyaan' => 'Berapa lama durasi peminjaman buku perpus?', 'jawaban' => 'Maksimal peminjaman buku adalah 1 minggu dan dapat diperpanjang satu kali.', 'kategori' => 'Sarpras'],
            ['keyword' => 'lab komputer', 'pertanyaan' => 'Jam operasional lab komputer?', 'jawaban' => 'Lab terbuka mulai pukul 07.00 - 16.00 WIB untuk kegiatan belajar mengajar.', 'kategori' => 'Sarpras'],
            ['keyword' => 'parkir', 'pertanyaan' => 'Di mana area parkir siswa?', 'jawaban' => 'Area parkir siswa berada di lahan belakang sekolah. Pastikan membawa STNK dan menggunakan helm.', 'kategori' => 'Sarpras'],
            ['keyword' => 'kantin', 'pertanyaan' => 'Kapan kantin mulai buka?', 'jawaban' => 'Kantin mulai beroperasi saat jam istirahat pertama pukul 09.30 WIB.', 'kategori' => 'Sarpras'],
            ['keyword' => 'toilet', 'pertanyaan' => 'Lapor kran toilet rusak?', 'jawaban' => 'Gunakan fitur pengaduan chatbot atau form aspirasi dengan kategori Sarpras.', 'kategori' => 'Sarpras'],

            // --- KATEGORI: KESISWAAN & TATA TERTIB ---
            ['keyword' => 'seragam senin', 'pertanyaan' => 'Senin pakai baju apa?', 'jawaban' => 'Setiap hari Senin wajib menggunakan seragam putih abu-abu lengkap dengan dasi, topi, dan ikat pinggang sekolah.', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'seragam jumat', 'pertanyaan' => 'Jumat pakai baju apa?', 'jawaban' => 'Hari Jumat menggunakan seragam Muslim/Batik yang telah ditentukan sekolah.', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'potong rambut', 'pertanyaan' => 'Berapa standar panjang rambut?', 'jawaban' => 'Untuk siswa laki-laki, standar rambut adalah 3-2-1 cm (rapi dan tidak menyentuh kerah baju).', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'atribut', 'pertanyaan' => 'Di mana beli atribut sekolah?', 'jawaban' => 'Atribut sekolah seperti dasi dan lokasi bisa dibeli di Koperasi Siswa.', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'terlambat', 'pertanyaan' => 'Konsekuensi jika terlambat?', 'jawaban' => 'Siswa yang terlambat wajib melapor ke guru piket dan akan mendapatkan poin disiplin.', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'izin sakit', 'pertanyaan' => 'Cara kirim surat izin sakit?', 'jawaban' => 'Orang tua wajib mengirimkan foto surat dokter ke wali kelas melalui WhatsApp.', 'kategori' => 'Kesiswaan'],
            ['keyword' => 'ekskul', 'pertanyaan' => 'Apa saja pilihan ekskul?', 'jawaban' => 'Ada Pramuka (Wajib), OSIS, Paskibra, Futsal, Basket, Rohis, dan Coding Club.', 'kategori' => 'Kesiswaan'],

            // --- KATEGORI: PKL & PRAKERIN ---
            ['keyword' => 'pkl kapan', 'pertanyaan' => 'Kapan pelaksanaan PKL?', 'jawaban' => 'PKL biasanya dilaksanakan di awal kelas XI selama 3 sampai 6 bulan.', 'kategori' => 'PKL'],
            ['keyword' => 'syarat pkl', 'pertanyaan' => 'Apa syarat untuk bisa PKL?', 'jawaban' => 'Sudah menyelesaikan kompetensi dasar di kelas X dan tidak memiliki tunggakan nilai.', 'kategori' => 'PKL'],
            ['keyword' => 'cari tempat pkl', 'pertanyaan' => 'Apakah sekolah mencarikan tempat PKL?', 'jawaban' => 'Sekolah membantu menyalurkan, namun siswa sangat disarankan mencari mandiri sesuai minat.', 'kategori' => 'PKL'],
            ['keyword' => 'laporan pkl', 'pertanyaan' => 'Kapan batas pengumpulan laporan PKL?', 'jawaban' => 'Maksimal 2 minggu setelah masa PKL selesai untuk mendapatkan nilai sertifikat.', 'kategori' => 'PKL'],

            // --- KATEGORI: UMUM & ADMINISTRASI ---
            ['keyword' => 'spp', 'pertanyaan' => 'Bagaimana cara cek tagihan SPP?', 'jawaban' => 'Tagihan SPP dapat dicek melalui aplikasi pembayaran sekolah atau ke bagian TU Keuangan.', 'kategori' => 'Umum'],
            ['keyword' => 'legalisir', 'pertanyaan' => 'Syarat legalisir dokumen?', 'jawaban' => 'Membawa fotokopi dokumen asli dan menyerahkannya ke bagian Tata Usaha pada jam kerja.', 'kategori' => 'Umum'],
            ['keyword' => 'kartu pelajar', 'pertanyaan' => 'Kartu pelajar hilang?', 'jawaban' => 'Silakan lapor ke bagian Tata Usaha untuk pencetakan ulang dengan membawa biaya administrasi.', 'kategori' => 'Umum'],
        ];

        // Duplikasi logic untuk mencapai 50 data (Contoh data variasi lainnya)
        foreach ($faqs as $faq) {
            FaqChatbot::create($faq);
        }

        // Tambahan data dummy otomatis menggunakan loop untuk melengkapi hingga 50
        for ($i = 1; $i <= 20; $i++) {
            FaqChatbot::create([
                'keyword' => 'info tambahan ' . $i,
                'pertanyaan' => 'Pertanyaan seputar topik umum ' . $i . '?',
                'jawaban' => 'Ini adalah jawaban otomatis untuk informasi tambahan ke-' . $i . '. Silakan hubungi admin jika butuh detail lebih lanjut.',
                'kategori' => 'Umum'
            ]);
        }
    }
}