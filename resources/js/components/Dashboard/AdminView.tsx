import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminView({ aspirasis, kategoris, filters, handleFilter, getStatusStyle, openModal, isModalOpen, setIsModalOpen, selectedAspirasi, submitAdmin, data, setData, processing, inputClasses, labelClasses }: any) {
    const [isCustomDate, setIsCustomDate] = useState(!!(filters.dari_tanggal || filters.sampai_tanggal));

    return (
        <div className="space-y-6">
            {/* Filter Form Toolbar */}
            <form onSubmit={handleFilter} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 no-print mb-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-end">

                    {/* AREA 1: WAKTU (4 Kolom) */}
                    <div className="xl:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Periode Waktu</label>
                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                            <select
                                className="text-xs border-none bg-transparent focus:ring-0 cursor-pointer font-bold text-indigo-600"
                                value={isCustomDate ? 'rentang' : 'bulan'}
                                onChange={(e) => setIsCustomDate(e.target.value === 'rentang')}
                            >
                                <option value="bulan">📅 Bulan</option>
                                <option value="rentang">🗓️ Rentang</option>
                            </select>
                            <div className="h-6 w-px bg-slate-300"></div>
                            <div className="flex-1">
                                {!isCustomDate ? (
                                    <input type="month" name="periode" defaultValue={filters.periode} className="w-full bg-transparent border-none text-sm focus:ring-0 py-1" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input type="date" name="dari_tanggal" defaultValue={filters.dari_tanggal} className="w-full bg-transparent border-none text-[11px] focus:ring-0 py-1 px-0" />
                                        <span className="text-slate-300">-</span>
                                        <input type="date" name="sampai_tanggal" defaultValue={filters.sampai_tanggal} className="w-full bg-transparent border-none text-[11px] focus:ring-0 py-1 px-0" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AREA 2: KATEGORI & STATUS (4 Kolom) */}
                    <div className="xl:col-span-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                                <select name="kategori" defaultValue={filters.kategori} className={`${inputClasses} !bg-slate-50`}>
                                    <option value="">Semua Kategori</option>
                                    {kategoris.map((k: any) => <option key={k.id_kategori} value={k.id_kategori}>{k.ket_kategori}</option>)}
                                    <option value="manual">Lainnya</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                <select name="status" defaultValue={filters.status} className={`${inputClasses} !bg-slate-50`}>
                                    <option value="semua">Semua Status</option>
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Proses">Proses</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* AREA 3: SEARCH & ACTION (4 Kolom) */}
                    <div className="xl:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Kunci</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari laporan..."
                                    className={`${inputClasses} !bg-slate-50 pl-10`}
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button type="submit" className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs px-5 py-2.5 transition-all shadow-sm active:scale-95">
                                FILTER
                            </button>

                            {(filters.search || filters.kategori || filters.periode || filters.dari_tanggal || (filters.status && filters.status !== 'semua')) && (
                                <Link
                                    href="/dashboard"
                                    className="bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl px-3 flex items-center justify-center transition-all shadow-sm"
                                    title="Reset Filter"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </form>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[11px] uppercase font-black tracking-wider text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-4 w-48 whitespace-nowrap">Tgl & Pengirim</th>
                                <th className="px-5 py-4 min-w-[200px]">Aspirasi & Lokasi</th>
                                <th className="px-5 py-4 min-w-[250px]">Keterangan</th>
                                <th className="px-5 py-4 text-center whitespace-nowrap">Status</th>
                                <th className="px-5 py-4 text-center no-print w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {aspirasis?.data?.length > 0 ? (
                                aspirasis.data.map((asp: any) => (
                                    <tr key={asp.id_aspirasi} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 align-top">
                                            <div className="text-[11px] font-bold text-indigo-600 mb-1 flex items-center gap-1" title="Tanggal Kejadian">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                {new Date(asp.tanggal_kejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                            <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{asp.user?.nama || 'Pengguna Terhapus'}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Dilaporkan: {new Date(asp.created_at).toLocaleDateString('id-ID')}</div>
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <div className="flex flex-wrap gap-1.5 items-center mb-1.5">
                                                <span className="text-[9px] font-black text-indigo-700 uppercase tracking-wider bg-indigo-100/50 px-2 py-0.5 rounded border border-indigo-200">
                                                    {asp.id_kategori && asp.id_kategori !== 'manual'
                                                        ? (asp.kategori?.ket_kategori || 'Kategori Dihapus')
                                                        : `Lainnya: ${asp.kategori_manual}`
                                                    }
                                                </span>
                                            </div>
                                            <div className="font-bold text-slate-800 text-sm leading-tight whitespace-normal">{asp.judul}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold text-rose-500">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                                                Tujuan: {asp.tujuan}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                {asp.lokasi}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <div className="text-sm text-slate-600 max-h-24 overflow-y-auto whitespace-pre-wrap pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                                {asp.ket}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center align-top">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusStyle(asp.status)}`}>
                                                    {asp.status}
                                                </span>
                                                {asp.rating && (
                                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 shadow-sm animate-in fade-in zoom-in">
                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        <span className="text-[10px] font-black text-amber-700">{asp.rating}/5</span>
                                                    </div>
                                                )}
                                                {asp.lampiran && (
                                                    <a href={`/storage/${asp.lampiran}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1 transition-colors">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                        Bukti
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center no-print align-top">
                                            <button onClick={() => openModal(asp)} className="w-full text-indigo-700 font-bold text-xs bg-indigo-50 hover:bg-indigo-600 hover:text-white py-2 rounded-xl transition-all shadow-sm">
                                                Proses
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">Tidak ada aspirasi</p>
                                        <p className="text-xs text-slate-500 mt-1">Belum ada data laporan yang masuk ke divisi Anda.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            {aspirasis?.links?.length > 3 && (
                <div className="flex flex-wrap gap-1 justify-center pt-4">
                    {aspirasis.links.map((link: any, i: number) => (
                        <Link key={i} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 rounded-xl text-xs font-bold border ${link.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'} ${!link.url && 'opacity-50 pointer-events-none'}`} />
                    ))}
                </div>
            )}

            {/* MODAL ADMIN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Detail & Tanggapi Laporan</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Baca detail laporan sebelum memberikan tanggapan.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors border border-slate-100 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 md:p-6 bg-slate-50/50">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                                        {selectedAspirasi?.id_kategori && selectedAspirasi?.id_kategori !== 'manual' ? selectedAspirasi?.kategori?.ket_kategori : `Lainnya: ${selectedAspirasi?.kategori_manual}`}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {selectedAspirasi?.lokasi}
                                    </span>
                                </div>

                                <h4 className="font-bold text-slate-900 text-lg mb-3">{selectedAspirasi?.judul}</h4>
                                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    {selectedAspirasi?.ket}
                                </div>

                                {selectedAspirasi?.lampiran && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <a href={`/storage/${selectedAspirasi.lampiran}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            Buka Lampiran Bukti
                                        </a>
                                    </div>
                                )}
                                {/* --- DISPLAY RATING DI DALAM MODAL --- */}
                                {selectedAspirasi?.rating && (
                                    <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Penilaian Siswa</p>
                                            <p className="text-xs text-amber-600 font-medium">Siswa merasa puas dengan penanganan ini.</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < selectedAspirasi.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={submitAdmin} className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">Berikan Tanggapan</h4>
                                <div>
                                    <label className={labelClasses}>Status Penyelesaian</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className={inputClasses}
                                        // Jika status sudah Selesai, kunci select-nya agar tidak bisa diubah sama sekali
                                        disabled={selectedAspirasi?.status === 'Selesai'}
                                    >
                                        {/* Opsi Menunggu: Hanya aktif jika status saat ini memang masih Menunggu */}
                                        <option
                                            value="Menunggu"
                                            disabled={selectedAspirasi?.status === 'Proses' || selectedAspirasi?.status === 'Selesai'}
                                        >
                                            🟠 Menunggu
                                        </option>

                                        {/* Opsi Proses: Hanya aktif jika status saat ini Menunggu atau Proses */}
                                        <option
                                            value="Proses"
                                            disabled={selectedAspirasi?.status === 'Selesai'}
                                        >
                                            🔵 Sedang Diproses
                                        </option>

                                        {/* Opsi Selesai: Selalu aktif selama status sebelumnya bukan Selesai (atau biarkan aktif sebagai status akhir) */}
                                        <option value="Selesai">🟢 Selesai (Tuntas)</option>
                                    </select>

                                    {selectedAspirasi?.status === 'Selesai' && (
                                        <p className="text-[10px] text-amber-600 font-bold mt-2 animate-pulse">
                                            ⚠️ Laporan yang sudah SELESAI dikunci dan tidak dapat diubah lagi.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClasses}>Pesan Balasan / Feedback (Opsional)</label>
                                    <textarea placeholder="Berikan penjelasan tindak lanjut untuk siswa..." value={data.feedback} onChange={e => setData('feedback', e.target.value)} className={`${inputClasses} h-28 resize-none`} />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all">
                                        {processing ? 'Menyimpan...' : 'Simpan Tanggapan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}