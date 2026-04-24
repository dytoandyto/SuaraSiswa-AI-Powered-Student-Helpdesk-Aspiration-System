import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import ChatbotInterface from '../Chatbot/ChatbotInterface';
import { Bot, MessageSquarePlus, Clock, Inbox, Paperclip, Star } from 'lucide-react'; // Tambahan icon

export default function SiswaView({ data, setData, submitSiswa, processing, errors, kategoris, aspirasis, inputClasses, labelClasses, getStatusStyle }: any) {
    const [activeTab, setActiveTab] = useState('form');
    const [hoverRating, setHoverRating] = useState<{ id: number; val: number } | null>(null);

    const handleRating = (id_aspirasi: number, nilai: number) => {
        router.patch(`/aspirasi/${id_aspirasi}/rating`, { rating: nilai }, {
            preserveScroll: true,
            // Tambahkan ini biar kerasa kalau sudah sukses nyimpan
            onSuccess: () => {
                setHoverRating(null); 
            }
        });
    };
    return (
        <div className="grid lg:grid-cols-12 gap-8">

            {/* SISI KIRI: Form / Chatbot */}
            <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-fit sticky top-6">

                {/* Header & Tabs */}
                <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sampaikan Aspirasimu</h3>
                    <p className="text-sm text-slate-500 mt-1">Gunakan form resmi atau ngobrol dengan AI Assistant kami.</p>

                    {/* Modern Segmented Control Tabs */}
                    <div className="flex bg-slate-200/50 p-1.5 rounded-xl w-fit mt-6 border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('form')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'form'
                                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            <MessageSquarePlus className="w-4 h-4" /> Form Laporan
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'chat'
                                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            <Bot className="w-4 h-4" /> Chat Laporan
                        </button>
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="min-h-[500px] relative">
                    {activeTab === 'form' ? (
                        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={submitSiswa} className="space-y-7">

                                <div className="grid sm:grid-cols-2 gap-7">
                                    {/* Judul Aspirasi */}
                                    <div>
                                        <label className={labelClasses}>Judul Aspirasi <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} className={inputClasses} placeholder="Contoh: Kerusakan Proyektor Kelas" required />
                                        {errors.judul && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.judul}</p>}
                                    </div>

                                    {/* Kategori Laporan */}
                                    <div>
                                        <label className={labelClasses}>Kategori Laporan <span className="text-red-500">*</span></label>
                                        <select value={data.id_kategori} onChange={e => setData('id_kategori', e.target.value)} className={inputClasses} required>
                                            <option value="" disabled>-- Pilih Kategori --</option>
                                            {kategoris.map((k: any) => (
                                                <option key={k.id_kategori} value={k.id_kategori}>{k.ket_kategori}</option>
                                            ))}
                                            <option value="manual" className="font-bold text-indigo-600">-- Lainnya (Ketik Manual) --</option>
                                        </select>

                                        {/* Input Manual Kategori */}
                                        {data.id_kategori === 'manual' && (
                                            <div className="animate-in fade-in slide-in-from-top-2 p-4 mt-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 block">Sebutkan Kategori Lainnya</label>
                                                <input type="text" placeholder="Misal: Masalah Kantin..." value={data.kategori_manual} onChange={e => setData('kategori_manual', e.target.value)} className={`${inputClasses} bg-white border-indigo-200 focus:ring-indigo-500/10`} required />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tujuan Pengajuan */}
                                <div>
                                    <label className={labelClasses}>Tujuan Pengajuan <span className="text-red-500">*</span></label>
                                    <select value={data.tujuan} onChange={e => setData('tujuan', e.target.value)} className={inputClasses} required>
                                        <option value="" disabled>-- Pilih Bagian yang Dituju -- </option>
                                        <option value="ADMIN">Kepala Tata Usaha / Admin Umum</option>
                                        <option value="SARPRAS">Waka Sarana & Prasarana (Sarpras)</option>
                                        <option value="KESISWAAN">Waka Kesiswaan</option>
                                        <option value="KURIKULUM">Waka Kurikulum</option>
                                        <option value="HUBIN">Hubungan Industri (Hubin / PKL)</option>
                                        <option value="SIMS">Tim IT / SIMS</option>
                                    </select>
                                    {errors.tujuan && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.tujuan}</p>}
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className={labelClasses}>Deskripsi Detail <span className="text-red-500">*</span></label>
                                    <textarea value={data.ket} onChange={e => setData('ket', e.target.value)} className={`${inputClasses} h-32 resize-none`} placeholder="Ceritakan detail masalah yang kamu alami secara spesifik..." required></textarea>
                                    {errors.ket && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.ket}</p>}
                                </div>

                                {/* Lokasi & Tanggal */}
                                <div className="grid sm:grid-cols-2 gap-7">
                                    <div>
                                        <label className={labelClasses}>Lokasi Kejadian <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} className={inputClasses} placeholder="Contoh: Lab Jaringan Komputer" required />
                                        {errors.lokasi && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.lokasi}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Tanggal Kejadian <span className="text-red-500">*</span></label>
                                        <input type="date" value={data.tanggal_kejadian} onChange={e => setData('tanggal_kejadian', e.target.value)} className={inputClasses} required />
                                        {errors.tanggal_kejadian && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.tanggal_kejadian}</p>}
                                    </div>
                                </div>

                                {/* Lampiran */}
                                <div>
                                    <label className={labelClasses}>Lampiran Foto/Dokumen <span className="text-slate-400 normal-case font-medium">(Opsional tapi disarankan)</span></label>
                                    <div className="mt-1.5 flex items-center gap-4">
                                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl cursor-pointer transition-colors text-sm font-bold w-full sm:w-auto">
                                            <Paperclip className="w-4 h-4" />
                                            {data.lampiran ? 'Ganti File' : 'Pilih File'}
                                            <input type="file" className="hidden" onChange={e => setData('lampiran', e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                        <span className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                                            {data.lampiran ? data.lampiran.name : 'Tidak ada file dipilih'}
                                        </span>
                                    </div>
                                    {errors.lampiran && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.lampiran}</p>}
                                </div>

                                {/* Tombol Submit */}
                                <button type="submit" disabled={processing} className="w-full mt-4 bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 text-white py-4 rounded-xl font-black text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                    {processing ? 'MENGIRIM LAPORAN...' : 'KIRIM ASPIRASI SEKARANG'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <ChatbotInterface />
                        </div>
                    )}
                </div>
            </div>

            {/* SISI KANAN: Riwayat Terbaru */}
            <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-end mb-6 pb-2 border-b border-slate-200">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" /> Riwayat Terbaru
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 ml-7">Pantau status laporanmu</p>
                    </div>
                    <Link href="/histori" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg">
                        Lihat Semua
                    </Link>
                </div>

                {aspirasis?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {aspirasis.data.slice(0, 3).map((asp: any) => (
                            <div key={asp.id_aspirasi} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-default">
                                {/* Garis Indikator Status */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:w-2 ${asp.status === 'Selesai' ? 'bg-emerald-500' : asp.status === 'Proses' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>

                                <div className="flex flex-col gap-2 mb-3 pl-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100 line-clamp-1">
                                            {asp.id_kategori && asp.id_kategori !== 'manual' ? asp.kategori?.ket_kategori : `Lainnya: ${asp.kategori_manual}`}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusStyle(asp.status)}`}>
                                            {asp.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm leading-snug mt-1">{asp.judul || asp.lokasi}</h4>
                                </div>

                                <div className="text-xs text-slate-500 pl-2 pr-2 mb-3 line-clamp-2 leading-relaxed">"{asp.ket}"</div>

                                {/* Feedback Admin (Sudah ada di kodinganmu) */}
                                {asp.feedback && (
                                    <div className="ml-2 mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 relative">
                                        <span className="absolute -top-2.5 left-3 bg-white px-2 py-0.5 rounded text-[9px] font-black text-indigo-500 uppercase tracking-widest border border-slate-100 shadow-sm">
                                            Respons Admin
                                        </span>
                                        <span className="line-clamp-2 mt-1 italic font-medium">"{asp.feedback}"</span>
                                    </div>
                                )}

                                {asp.status === 'Selesai' && (
                                    <div className="mt-4 pt-3 border-t border-slate-100/80">
                                        {!asp.rating ? (
                                            <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                                                <span className="text-[10px] font-bold text-indigo-800">Seberapa puas kamu?</span>
                                                <div
                                                    className="flex items-center gap-1.5"
                                                    onMouseLeave={() => setHoverRating(null)}
                                                >
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        // LOGIKA BENAR: Cek apakah nilai bintang ini KURANG DARI atau SAMA DENGAN bintang yang sedang di-hover
                                                        const isHovered = hoverRating !== null && hoverRating.id === asp.id_aspirasi && star <= hoverRating.val;
                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => handleRating(asp.id_aspirasi, star)}
                                                                onMouseEnter={() => setHoverRating({ id: asp.id_aspirasi, val: star })}
                                                                className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                                                                title={`Beri ${star} Bintang`}
                                                            >
                                                                <Star
                                                                    className={`w-6 h-6 transition-all duration-200 ${isHovered
                                                                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                                                        : 'fill-transparent text-slate-300'
                                                                        }`}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                                                <span className="text-[10px] font-bold text-amber-800">Penilaianmu:</span>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < asp.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State yang Lebih Menarik */
                    <div className="bg-slate-50/80 p-10 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-slate-100">
                            <Inbox className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Belum Ada Riwayat</p>
                        <p className="text-xs text-slate-500 mt-1.5 px-4 leading-relaxed">
                            Laporan yang kamu kirimkan akan muncul dan dapat dipantau di sini.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}