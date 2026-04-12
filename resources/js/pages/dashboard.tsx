import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Dashboard({ kategoris = [], aspirasis, stats, filters = {} }: any) {
    const { auth, flash } = usePage().props as any;
    const isAdmin = auth.user.role === 'admin';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAspirasi, setSelectedAspirasi] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        judul: '',
        id_kategori: '',
        kategori_manual: '',
        lokasi: '',
        tujuan: '',
        tanggal_kejadian: '',
        ket: '',
        lampiran: null as File | null,
        status: 'Menunggu',
        feedback: '',
    });

    const submitSiswa = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('aspirasi.store'), {
            onSuccess: () => reset('id_kategori', 'kategori_manual', 'lokasi', 'ket', 'judul', 'tujuan', 'tanggal_kejadian', 'lampiran'),
            preserveScroll: true
        });
    };

    const openModal = (asp: any) => {
        setSelectedAspirasi(asp);
        setData({ ...data, status: asp.status, feedback: asp.feedback || '' });
        setIsModalOpen(true);
    };

    const submitAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('aspirasi.update', selectedAspirasi.id_aspirasi), {
            onSuccess: () => { setIsModalOpen(false); reset(); },
            preserveScroll: true
        });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        // Trik rapi: Hapus data yang kosong agar URL tidak panjang dan kotor (misal: ?search=&kategori=)
        const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));

        router.get(route('dashboard'), cleanedData, { preserveState: true });
    };

    // Logika Pintar untuk URL Cetak Laporan
    const getPrintUrl = () => {
        if (typeof window === 'undefined') return '/aspirasi/cetak';

        // Ambil semua filter yang sedang aktif di URL saat ini
        const params = new URLSearchParams(window.location.search);

        // Jika ada checkbox yang dicentang, tambahkan parameter 'ids'
        if (selectedIds.length > 0) {
            params.set('ids', selectedIds.join(','));
        }

        return `/aspirasi/cetak?${params.toString()}`;
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && aspirasis?.data) {
            setSelectedIds(aspirasis.data.map((a: any) => a.id_aspirasi));
        } else {
            setSelectedIds([]);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Proses': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    // Class standar untuk input form
    const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm placeholder:text-slate-400";
    const labelClasses = "text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block";

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title={isAdmin ? "Panel Admin" : "Pengaduan Siswa"} />

            <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">

                {/* Flash Message */}
                {flash?.message && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between no-print animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-100 p-1.5 rounded-full">
                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-teal-900">Berhasil!</p>
                                <p className="text-xs text-teal-700 mt-0.5">{flash.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header & Print Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 no-print border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            {isAdmin ? 'Manajemen Aspirasi' : 'Dashboard Laporan'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, <span className="font-semibold text-slate-700">{auth.user.nama}</span> 👋</p>
                    </div>
                    {isAdmin && (
                        <a
                            href={getPrintUrl()}
                            target="_blank"
                            className="bg-slate-900 hover:bg-slate-800 transition-all text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            {selectedIds.length > 0 ? `Cetak (${selectedIds.length}) Laporan` : 'Cetak Semua Laporan'}
                        </a>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {isAdmin ? (
                        <>
                            <StatCard title="Total Aspirasi" value={stats.total} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="bg-indigo-500" lightColor="bg-indigo-50 text-indigo-600" />
                            <StatCard title="Menunggu" value={stats.menunggu} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-amber-500" lightColor="bg-amber-50 text-amber-600" />
                            <StatCard title="Diproses" value={stats.proses} icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" color="bg-blue-500" lightColor="bg-blue-50 text-blue-600" />
                            <StatCard title="Selesai" value={stats.selesai} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-emerald-500" lightColor="bg-emerald-50 text-emerald-600" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Total Laporanmu" value={stats.total} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="bg-indigo-500" lightColor="bg-indigo-50 text-indigo-600" />
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4 overflow-hidden relative group transition-all hover:shadow-md">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                                <div className="pl-2 relative z-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Terakhir</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(stats.terakhir)}`}>
                                        {stats.terakhir}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {isAdmin ? (
                    /* ================= TAMPILAN ADMIN ================= */
                    <div className="space-y-6">
                        {/* Filter Form Toolbar */}
                        <form onSubmit={handleFilter} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 no-print flex flex-col lg:flex-row gap-3 items-center">

                            <div className="flex w-full lg:w-auto items-center gap-2">
                                <div className="flex-1">
                                    <input type="date" name="dari_tanggal" defaultValue={filters.dari_tanggal} className={inputClasses} title="Dari Tanggal" />
                                </div>
                                <span className="text-slate-400 text-xs font-bold">s/d</span>
                                <div className="flex-1">
                                    <input type="date" name="sampai_tanggal" defaultValue={filters.sampai_tanggal} className={inputClasses} title="Sampai Tanggal" />
                                </div>
                            </div>

                            <div className="w-full lg:w-1/4">
                                <select name="kategori" defaultValue={filters.kategori} className={inputClasses}>
                                    <option value="">Semua Kategori</option>
                                    {kategoris.map((k: any) => <option key={k.id_kategori} value={k.id_kategori}>{k.ket_kategori}</option>)}
                                    <option value="manual">Lainnya (Manual)</option>
                                </select>
                            </div>

                            <div className="w-full lg:flex-1 flex gap-3">
                                <input type="text" name="search" defaultValue={filters.search} placeholder="Cari NIS, Nama, atau Judul..." className={inputClasses} />
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-xl font-bold text-sm shadow-sm px-6 py-2.5 whitespace-nowrap">
                                    Terapkan Filter
                                </button>
                                {/* Tombol Reset Filter */}
                                {(filters.search || filters.kategori || filters.dari_tanggal) && (
                                    <Link href={route('dashboard')} className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm px-4 py-2.5 whitespace-nowrap transition-colors">
                                        Reset
                                    </Link>
                                )}
                            </div>
                        </form>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-[11px] uppercase font-black tracking-wider text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-4 w-10 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={toggleSelectAll}
                                                    checked={aspirasis?.data?.length > 0 && selectedIds.length === aspirasis.data.length}
                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </th>
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
                                                    <td className="px-5 py-4 text-center align-top pt-5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(asp.id_aspirasi)}
                                                            onChange={() => toggleSelect(asp.id_aspirasi)}
                                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-5 py-4 align-top">
                                                        <div className="text-[11px] font-bold text-indigo-600 mb-1">
                                                            {new Date(asp.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{asp.siswa?.nama || 'Siswa Terhapus'}</div>
                                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{asp.nis}</div>
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
                                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                            {asp.lokasi}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 align-top">
                                                        <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed whitespace-normal" title={asp.ket}>
                                                            "{asp.ket}"
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center align-top">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusStyle(asp.status)}`}>
                                                                {asp.status}
                                                            </span>
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
                                                    <p className="text-xs text-slate-500 mt-1">Belum ada data yang sesuai dengan pencarian atau filter Anda.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ================= TAMPILAN SISWA ================= */
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Form Input Sisi Kiri */}
                        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-6">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sampaikan Aspirasimu</h3>
                                <p className="text-sm text-slate-500 mt-1">Isi formulir di bawah ini dengan jelas dan detail agar mudah diproses.</p>
                            </div>

                            <form onSubmit={submitSiswa} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Judul Aspirasi */}
                                        <div>
                                            <label className={labelClasses}>Judul Aspirasi <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} className={inputClasses} placeholder="Contoh: Kerusakan Proyektor Kelas" required />
                                            {errors.judul && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.judul}</p>}
                                        </div>

                                        {/* Kategori Laporan */}
                                        <div>
                                            <label className={labelClasses}>Kategori Laporan <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.id_kategori}
                                                onChange={e => setData('id_kategori', e.target.value)}
                                                className={inputClasses}
                                                required
                                            >
                                                <option value="" disabled>-- Pilih Kategori --</option>
                                                {kategoris.map((k: any) => (
                                                    <option key={k.id_kategori} value={k.id_kategori}>{k.ket_kategori}</option>
                                                ))}
                                                <option value="manual" className="font-bold text-indigo-600">-- Lainnya (Ketik Manual) --</option>
                                            </select>

                                            {/* Input Manual Muncul di Sini */}
                                            {data.id_kategori === 'manual' && (
                                                <div className="animate-in fade-in slide-in-from-top-2 p-4 mt-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 block">Sebutkan Kategori Lainnya</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Misal: Masalah Kantin..."
                                                        value={data.kategori_manual}
                                                        onChange={e => setData('kategori_manual', e.target.value)}
                                                        className={`${inputClasses} bg-white border-indigo-200 focus:ring-indigo-500/10`}
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Tujuan Pengajuan <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.tujuan} onChange={e => setData('tujuan', e.target.value)} className={inputClasses} placeholder="Contoh: Waka Sarpras / Pihak Kantin" required />
                                    {errors.tujuan && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.tujuan}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>Deskripsi Detail <span className="text-red-500">*</span></label>
                                    <textarea value={data.ket} onChange={e => setData('ket', e.target.value)} className={`${inputClasses} h-32 resize-none`} placeholder="Ceritakan detail masalah yang kamu alami secara spesifik..." required></textarea>
                                    {errors.ket && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.ket}</p>}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
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

                                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 transition-colors group">
                                    <label className={labelClasses}>Lampiran Foto/Dokumen <span className="text-slate-400 normal-case font-medium">(Opsional tapi sangat disarankan)</span></label>
                                    <input
                                        type="file"
                                        onChange={e => setData('lampiran', e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-sm text-slate-600 bg-transparent cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all mt-2 outline-none"
                                    />
                                    {errors.lampiran && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.lampiran}</p>}
                                </div>

                                <button type="submit" disabled={processing} className="w-full bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 text-white py-3.5 rounded-xl font-black text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                    {processing ? 'MENGIRIM LAPORAN...' : 'KIRIM ASPIRASI SEKARANG'}
                                </button>
                            </form>
                        </div>

                        {/* Riwayat Sisi Kanan */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex justify-between items-end mb-6 pb-2 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Riwayat Terbaru</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Pantau status laporanmu</p>
                                </div>
                                <Link href="/histori" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg">
                                    Lihat Semua
                                </Link>
                            </div>

                            {aspirasis?.data?.length > 0 ? (
                                <div className="space-y-4">
                                    {aspirasis?.data?.slice(0, 3).map((asp: any) => (
                                        <div key={asp.id_aspirasi} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                            <div className={`absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2 ${asp.status === 'Selesai' ? 'bg-emerald-500' : asp.status === 'Proses' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>

                                            <div className="flex flex-col gap-2 mb-3 pl-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                        {asp.id_kategori && asp.id_kategori !== 'manual'
                                                            ? (asp.kategori?.ket_kategori || 'Kategori Terhapus')
                                                            : `Lainnya: ${asp.kategori_manual || 'Tanpa Keterangan'}`
                                                        }
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase border ${getStatusStyle(asp.status)}`}>
                                                        {asp.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-snug">{asp.judul || asp.lokasi}</h4>
                                            </div>

                                            <p className="text-xs text-slate-500 pl-2 line-clamp-2 leading-relaxed mb-3">"{asp.ket}"</p>

                                            {asp.feedback && (
                                                <div className="ml-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 relative">
                                                    <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[9px] font-black text-indigo-500 uppercase tracking-widest">Respons Admin</span>
                                                    <span className="line-clamp-2 mt-1 italic">{asp.feedback}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
                                    <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-slate-100">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">Belum Ada Riwayat</p>
                                    <p className="text-xs text-slate-400 mt-1 px-4">Aspirasi yang kamu kirimkan akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PAGINATION ADMIN */}
                {isAdmin && aspirasis?.links?.length > 3 && (
                    <div className="flex flex-wrap gap-1 justify-center no-print pt-4">
                        {aspirasis.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${link.active
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                    } ${!link.url && 'opacity-50 pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL ADMIN PREMIUM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Tanggapi Laporan</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Perbarui status dan berikan pesan balasan.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors border border-slate-100 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={submitAdmin} className="p-6 space-y-6">
                            <div>
                                <label className={labelClasses}>Status Penyelesaian</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClasses}>
                                    <option value="Menunggu">🟠 Menunggu</option>
                                    <option value="Proses">🔵 Sedang Diproses</option>
                                    <option value="Selesai">🟢 Selesai</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Pesan Balasan / Feedback</label>
                                <textarea placeholder="Berikan penjelasan tindak lanjut untuk siswa..." value={data.feedback} onChange={e => setData('feedback', e.target.value)} className={`${inputClasses} h-36 resize-none`} required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function StatCard({ title, value, icon, color, lightColor }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className={`p-3.5 rounded-xl ${lightColor} group-hover:${color} group-hover:text-white transition-colors duration-300`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}