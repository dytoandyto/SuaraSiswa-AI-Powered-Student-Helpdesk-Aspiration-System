import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ tikets = [], faqs = [] }: any) {
    const { flash } = usePage().props as any;

    const [activeTab, setActiveTab] = useState('tiket');
    const [selectedTiket, setSelectedTiket] = useState<any>(null);

    // Form Khusus untuk Membalas Tiket Siswa
    const formTiket = useForm({
        jawaban: '',
    });

    // Form Khusus untuk Menambah Template FAQ Bot
    const formFaq = useForm({
        keyword: '',
        pertanyaan: '',
        isi_jawaban: '',
        kategori: 'umum'
    });

    const handleJawabTiket = (e: React.FormEvent) => {
        e.preventDefault();
        formTiket.patch(route('admin.tiket.jawab', selectedTiket.id), {
            onSuccess: () => {
                setSelectedTiket(null);
                formTiket.reset();
            }
        });
    };

    const handleSaveFaq = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFaqId) {
            formFaq.put(route('admin.faq.update', editingFaqId), {
                onSuccess: () => { setEditingFaqId(null); formFaq.reset(); }
            });
        } else {
            formFaq.post(route('admin.faq.store'), {
                onSuccess: () => formFaq.reset()
            });
        }
    };

    const handleEditClick = (faq: any) => {
        setEditingFaqId(faq.id);
        formFaq.setData({
            keyword: faq.keyword,
            pertanyaan: faq.pertanyaan,
            isi_jawaban: faq.jawaban,
            kategori: faq.kategori
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke form
    };

    const handleDeleteFaq = (id: number) => {
        if (confirm('Yakin ingin menghapus template FAQ ini?')) {
            router.delete(route('admin.faq.destroy', id));
        }
    };

    const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            formImport.setData('file_csv', e.target.files[0]);
            if (confirm('Import data dari file CSV ini?')) {
                formImport.post(route('admin.faq.import'), {
                    onSuccess: () => formImport.reset()
                });
            }
        }
    };

    // Hitung tiket yang butuh balasan cepat (SLA)
    const pendingTicketsCount = tikets.filter((t: any) => t.status === 'pending').length;

    const [editingFaqId, setEditingFaqId] = useState<number | null>(null);

    const formImport = useForm({ file_csv: null as File | null });

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Chatbot', href: '/admin/chatbot' }]}>
            <Head title="Manajemen Chatbot & Tiket" />

            <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">

                {/* Flash Message */}
                {flash?.message && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-xl shadow-sm flex items-center gap-3 mb-6">
                        <div className="bg-teal-100 p-1.5 rounded-full">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-teal-900">Berhasil!</p>
                            <p className="text-xs text-teal-700 mt-0.5">{flash.message}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Manajemen Asisten Digital</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola jawaban otomatis bot dan balas pertanyaan siswa yang tertunda.</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-slate-200/50 w-fit rounded-xl">
                    <button
                        onClick={() => setActiveTab('tiket')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'tiket' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Tiket Bantuan
                        {pendingTicketsCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                                {pendingTicketsCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'faq' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Database FAQ (Bot)
                    </button>
                </div>

                {activeTab === 'tiket' ? (
                    /* ================= SEKSI TIKET BANTUAN ================= */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-[11px] uppercase font-black text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 w-1/4">Siswa & Waktu</th>
                                            <th className="px-6 py-4 w-1/3">Pertanyaan Siswa</th>
                                            <th className="px-6 py-4">Batas Balas (SLA)</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tikets.length > 0 ? tikets.map((t: any) => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="font-bold text-slate-800 text-sm">{t.user?.nama || 'Siswa Dihapus'}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">NIS: {t.username}</div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic relative">
                                                        <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black text-indigo-400">Pesan</span>
                                                        "{t.pertanyaan_siswa}"
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${t.status === 'pending' ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                        {t.status === 'pending' ? `Sisa: ${t.sisa_waktu}` : 'Selesai'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center align-top">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border whitespace-nowrap ${t.status === 'terjawab' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center align-top">
                                                    {t.status === 'pending' ? (
                                                        <button
                                                            onClick={() => setSelectedTiket(t)}
                                                            className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                                        >
                                                            Balas
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-400">Tuntas</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <p>Semua tiket bantuan sudah terjawab!</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ================= SEKSI FAQ BOT ================= */
                    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Form Tambah/Edit FAQ Sisi Kiri */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight mb-1">
                                            {editingFaqId ? 'Edit Pengetahuan' : 'Tambah Pengetahuan'}
                                        </h3>
                                        <p className="text-xs text-slate-500">{editingFaqId ? 'Perbarui jawaban bot.' : 'Ajarkan bot cara menjawab.'}</p>
                                    </div>
                                    {editingFaqId && (
                                        <button onClick={() => { setEditingFaqId(null); formFaq.reset(); }} className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">Batal Edit</button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveFaq} className="space-y-5">
                                    <div>
                                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Keyword (Pemicu)</label>
                                        <input type="text" value={formFaq.data.keyword} onChange={e => formFaq.setData('keyword', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Judul Topik</label>
                                        <input type="text" value={formFaq.data.pertanyaan} onChange={e => formFaq.setData('pertanyaan', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Jawaban Bot</label>
                                        <textarea value={formFaq.data.isi_jawaban} onChange={e => formFaq.setData('isi_jawaban', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm h-32 resize-none" required />
                                    </div>
                                    <button type="submit" disabled={formFaq.processing} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-black text-sm tracking-wide transition-all shadow-md">
                                        {formFaq.processing ? 'Menyimpan...' : (editingFaqId ? 'Update Database Bot' : 'Simpan ke Database Bot')}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* List FAQ Sisi Kanan */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-slate-800 text-lg tracking-tight">Daftar Pengetahuan Bot Aktif</h3>

                                {/* Tombol Import CSV */}
                                <div className="relative">
                                    <input type="file" id="import-csv" accept=".csv" onChange={handleImportCsv} className="hidden" />
                                    <label htmlFor="import-csv" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        {formImport.processing ? 'Importing...' : 'Import CSV'}
                                    </label>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {faqs.length > 0 ? faqs.map((f: any) => (
                                    <div key={f.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>

                                        {/* Tombol Edit & Delete Muncul Saat Di-hover */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                                            <button onClick={() => handleEditClick(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                            <button onClick={() => handleDeleteFaq(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md" title="Hapus"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                        </div>

                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 bg-indigo-50 w-fit px-2 py-0.5 rounded border border-indigo-100">
                                            Keyword: {f.keyword}
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 mb-2 pr-12">{f.pertanyaan}</div>
                                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic line-clamp-4">
                                            "{f.jawaban}"
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                                        <p className="text-sm font-bold text-slate-600">Database Kosong</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL BALAS TIKET ADMIN */}
            {selectedTiket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Balas Pesan Siswa</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Jawaban ini akan langsung dikirim ke chat {selectedTiket.user?.nama}.</p>
                            </div>
                            <button onClick={() => { setSelectedTiket(null); formTiket.reset(); }} className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors border border-slate-100 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-5 md:p-6 bg-slate-50/50">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 relative">
                                <span className="absolute -top-3 left-4 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                                    Pertanyaan dari {selectedTiket.user?.nama}
                                </span>
                                <div className="text-sm text-slate-700 italic mt-2">
                                    "{selectedTiket.pertanyaan_siswa}"
                                </div>
                            </div>

                            <form onSubmit={handleJawabTiket} className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Tanggapan Admin (Manusia)</label>
                                    <textarea
                                        value={formTiket.data.jawaban}
                                        onChange={e => formTiket.setData('jawaban', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm h-32 resize-none"
                                        placeholder="Tuliskan jawaban yang sopan dan jelas..."
                                        required
                                    />
                                    {formTiket.errors.jawaban && <p className="text-red-500 text-[10px] mt-1">{formTiket.errors.jawaban}</p>}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setSelectedTiket(null)} className="w-1/3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={formTiket.processing} className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-black text-sm tracking-wide shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70">
                                        {formTiket.processing ? 'Mengirim...' : 'Kirim Balasan Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}