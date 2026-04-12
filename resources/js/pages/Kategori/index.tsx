import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Trash2, Plus, Tags, FileUp, Loader2 } from 'lucide-react'; // Tambah FileUp & Loader2
import React from 'react';

export default function Index({ kategoris = [] }: any) {
    const { flash } = usePage().props as any;

    // Form untuk Input Manual
    const manualForm = useForm({
        ket_kategori: '',
    });

    // Form khusus untuk Import Excel
    const excelForm = useForm({
        file: null as File | null,
    });

    const submitManual = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post(route('kategori.store'), {
            onSuccess: () => manualForm.reset(),
        });
    };

    const submitExcel = (e: React.FormEvent) => {
        e.preventDefault();
        excelForm.post(route('kategori.import'), {
            onSuccess: () => excelForm.reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('kategori.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Kategori', href: '/kategori' }]}>
            <Head title="Kelola Kategori" />

            <div className="p-4 md:p-8 w-full px-4 md:px-8 mx-auto space-y-6">

                {/* Flash Message */}
                {flash?.message && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-1.5 rounded-full">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Berhasil!</p>
                                <p className="text-xs text-emerald-700 mt-0.5">{flash.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Title & Import Excel */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Manajemen Kategori</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola atau import daftar klasifikasi laporan aspirasi.</p>
                    </div>

                    {/* FORM IMPORT EXCEL MODERN */}
                    <form onSubmit={submitExcel} className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
                        <div className="relative group">
                            <input 
                                type="file" 
                                onChange={e => excelForm.setData('file', e.target.files ? e.target.files[0] : null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required
                            />
                            <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 group-hover:border-indigo-400 transition-all">
                                <FileUp className="w-4 h-4 text-indigo-500" />
                                {excelForm.data.file ? excelForm.data.file.name : "Pilih File Excel"}
                            </div>
                        </div>
                        <button 
                            disabled={excelForm.processing || !excelForm.data.file} 
                            className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
                        >
                            {excelForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Import"}
                        </button>
                    </form>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Form Tambah Manual */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Plus className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tambah Manual</h3>
                        </div>

                        <form onSubmit={submitManual} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={manualForm.data.ket_kategori}
                                    onChange={(e) => manualForm.setData('ket_kategori', e.target.value)}
                                    placeholder="Contoh: Sarana Prasarana"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                                    required
                                />
                                {manualForm.errors.ket_kategori && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{manualForm.errors.ket_kategori}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={manualForm.processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70"
                            >
                                {manualForm.processing ? 'Menyimpan...' : 'Simpan Kategori'}
                            </button>
                        </form>
                    </div>

                    {/* Tabel List Kategori */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-5 w-16 text-center">No</th>
                                        <th className="px-6 py-5">Keterangan Kategori</th>
                                        <th className="px-6 py-5 w-28 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {kategoris.length > 0 ? (
                                        kategoris.map((kat: any, index: number) => (
                                            <tr key={kat.id_kategori} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-6 py-5 text-center text-xs font-bold text-slate-400">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform"></div>
                                                        <span className="font-bold text-slate-800 text-sm tracking-tight">{kat.ket_kategori}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() => handleDelete(kat.id_kategori)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-slate-50 p-5 rounded-full mb-4 border border-slate-100">
                                                        <Tags className="w-8 h-8 text-slate-200" />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Database Kosong</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}