<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cetak Laporan Aspirasi - SMK Taruna Bhakti</title>
    <style>
        /* Pengaturan Standar Kertas A4 */
        @page {
            size: A4;
            margin: 20mm;
        }

        /* Reset & Tipografi Dasar */
        body { 
            font-family: 'Times New Roman', Times, serif; 
            font-size: 12pt; /* Standar ukuran font surat resmi */
            color: #000; 
            background: #fff; 
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }

        .container { 
            width: 100%; 
            max-width: 210mm; /* Lebar maksimal A4 */
            margin: 0 auto;
        }

        /* UI Tombol Aksi (Tidak ikut di-print) */
        .no-print-area {
            background-color: #f8fafc;
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .btn {
            padding: 10px 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.8; }
        .btn-close { background: #ef4444; }
        .btn-print { background: #4f46e5; }

        /* ================= KOP SURAT ================= */
        .kop-surat { 
            width: 100%;
            text-align: center; 
            margin-bottom: 5px; 
        }
        .kop-surat h2 { font-size: 14pt; font-weight: bold; margin: 0; letter-spacing: 1px; }
        .kop-surat h1 { font-size: 18pt; font-weight: bold; margin: 3px 0; }
        .kop-surat h3 { font-size: 12pt; font-weight: normal; margin: 0 0 5px 0; }
        .kop-surat p { font-size: 10pt; margin: 2px 0; }
        .kop-surat a { color: #000; text-decoration: none; }
        
        /* Garis Ganda Kop Surat Resmi */
        .garis-kop {
            border-top: 3px solid #000;
            border-bottom: 1px solid #000;
            height: 2px;
            margin-bottom: 25px;
        }

        /* ================= JUDUL LAPORAN ================= */
        .judul-laporan { 
            text-align: center; 
            margin-bottom: 25px; 
        }
        .judul-laporan h3 { 
            font-size: 14pt;
            text-decoration: underline; 
            margin: 0 0 5px 0; 
            font-weight: bold;
        }
        .judul-laporan p { 
            font-size: 11pt; 
            margin: 0; 
        }

        /* ================= TABEL DATA ================= */
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 30px; 
            font-size: 11pt;
        }
        /* Mencegah baris tabel terpotong di tengah saat pindah halaman print */
        tr { page-break-inside: avoid; } 
        th, td { 
            border: 1px solid #000; 
            padding: 8px 10px; 
            vertical-align: top; 
        }
        th { 
            background-color: #e5e5e5; 
            font-weight: bold; 
            text-align: center; 
            text-transform: uppercase;
            font-size: 10pt;
            padding: 12px 8px;
        }
        
        /* Styling Khusus Kolom */
        .col-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .text-muted { color: #333; font-size: 10pt; margin-top: 4px; }
        
        /* ================= TANDA TANGAN ================= */
        .ttd-container { 
            width: 100%; 
            margin-top: 40px; 
            page-break-inside: avoid; /* Jangan pisahkan TTD ke halaman beda */
        }
        .ttd-box { 
            float: right; 
            text-align: center; 
            width: 250px; 
        }
        .ttd-box p { margin: 0; }
        .ttd-space { height: 80px; } /* Ruang untuk tanda tangan asli/stempel */

        /* Mode Print */
        @media print {
            .no-print-area { display: none !important; }
            body { background: transparent; }
        }
    </style>
</head>
<body onload="window.print()"> 
    
    <div class="no-print-area">
        <button class="btn btn-close" onclick="window.close()">Tutup Jendela Ini</button>
        <button class="btn btn-print" onclick="window.print()">Cetak Dokumen (Print)</button>
    </div>

    <div class="container">
        
        <div class="kop-surat">
            <h2>YAYASAN SETYA BHAKTI</h2>
            <h1>SMK TARUNA BHAKTI</h1>
            <h3>PROGRAM KEAHLIAN: REKAYASA PERANGKAT LUNAK</h3>
            <p>Jalan Pekapuran Curug Cimanggis Depok 16953</p>
            <p>Telp: (021) 8744810 | Website: <a href="http://www.smktarunabhakti.net">www.smktarunabhakti.net</a> | Email: taruna@smktarunabhakti.net</p>
        </div>
        
        <div class="garis-kop"></div>

        <div class="judul-laporan">
            <h3>REKAPITULASI DATA ASPIRASI DAN PENGADUAN SISWA</h3>
            <p>Tanggal Cetak: {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="15%">Waktu Laporan</th>
                    <th width="20%">Pengirim</th>
                    <th width="15%">Kategori</th>
                    <th width="33%">Deskripsi Pengaduan</th>
                    <th width="12%">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($aspirasis as $index => $asp)
                <tr>
                    <td class="col-center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($asp->created_at)->format('d/m/Y H:i') }}</td>
                    <td>
                        <div class="text-bold">{{ $asp->siswa->nama ?? 'Siswa Terhapus' }}</div>
                        <div class="text-muted">NIS: {{ $asp->nis }}</div>
                        <div class="text-muted">Kelas: {{ $asp->siswa->kelas ?? '-' }}</div>
                    </td>
                    <td>
                        {{ $asp->id_kategori && $asp->id_kategori !== 'manual' ? $asp->kategori->ket_kategori : ($asp->kategori_manual ?? '-') }}
                    </td>
                    <td>
                        <div class="text-bold" style="margin-bottom: 5px;">{{ $asp->judul }}</div>
                        <div style="text-align: justify;">{{ $asp->ket }}</div>
                    </td>
                    <td class="col-center text-bold">
                        {{ strtoupper($asp->status) }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="col-center" style="padding: 30px;">Tidak ada data laporan yang sesuai dengan filter.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="ttd-container">
            <div class="ttd-box">
                <p>Depok, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
                <p>Mengetahui,<br>Admin Sistem / Tata Usaha</p>
                <div class="ttd-space"></div>
                <p class="text-bold">_________________________</p>
                <p>NIP. ........................................</p>
            </div>
            <div style="clear: both;"></div>
        </div>
        
    </div>

</body>
</html>