import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, Trash2, UploadCloud, Users, Pencil, KeyRound, Plus } from 'lucide-react';
import React, { useState } from 'react';

export default function Index({ siswas, filters, kelasList = [] }: any) {
    const { flash } = usePage().props as any;

    // Form Khusus Import Excel
    const { data: importData, setData: setImportData, post: postImport, processing: processingImport, reset: resetImport } = useForm({
        file: null as File | null,
    });

    // Form Khusus CRUD (Tambah/Edit)
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nis: '',
        nama: '',
        kelas: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // ================= HANDLERS =================

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        postImport(route('siswa.import'), {
            onSuccess: () => resetImport(),
            preserveScroll: true,
        });
    };

    const handleFilterChange = (field: string, value: string) => {
        router.get(route('siswa.index'), { ...filters, [field]: value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data siswa bernama ${nama}?`)) {
            router.delete(route('siswa.destroy', id), { preserveScroll: true });
        }
    };

    const handleResetPassword = (id: number, nama: string) => {
        if (confirm(`Reset password untuk ${nama} menjadi "siswa123"?`)) {
            router.patch(route('siswa.resetPassword', id), {}, { preserveScroll: true });
        }
    };

    // Modal Handlers
    const openAddModal = () => {
        setIsEdit(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (siswa: any) => {
        setIsEdit(true);
        setSelectedId(siswa.id);
        setData({ nis: siswa.nis, nama: siswa.nama, kelas: siswa.kelas });
        clearErrors();
        setIsModalOpen(true);
    };

    const submitCrud = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && selectedId) {
            put(route('siswa.update', selectedId), {
                onSuccess: () => { setIsModalOpen(false); reset(); },
                preserveScroll: true
            });
        } else {
            post(route('siswa.store'), {
                onSuccess: () => { setIsModalOpen(false); reset(); },
                preserveScroll: true
            });
        }
    };

    // UI Helper Classes
    const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400";
    const labelClasses = "text-xs font-bold text-slate-600 mb-1.5 block";

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Siswa', href: '/siswa' }]}>
            <Head title="Manajemen Siswa" />


            <div className="p-4 md:p-8 w-full px-4 md:px-8 mx-auto space-y-6">

                {/* Flash Message */}
                {flash?.message && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm font-semibold text-teal-800">{flash.message}</p>
                    </div>
                )}

                {/* Header & Import Form */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Database Siswa</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola akses, data kelas, dan pengaturan password siswa.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <button onClick={openAddModal} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                            <Plus className="w-4 h-4" /> Tambah Manual
                        </button>

                        <form onSubmit={handleImport} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-100 shadow-sm w-full lg:w-auto">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={e => setImportData('file', e.target.files ? e.target.files[0] : null)}
                                className="w-full sm:w-auto text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-white file:text-emerald-700 file:shadow-sm hover:file:bg-emerald-100 cursor-pointer text-emerald-800"
                            />
                            <button
                                type="submit"
                                disabled={processingImport || !importData.file}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <UploadCloud className="w-4 h-4" />
                                {processingImport ? 'Memproses...' : 'Import'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            defaultValue={filters?.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Cari Nama atau NIS..."
                            className="pl-10 w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all py-2.5"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            defaultValue={filters?.kelas || ''}
                            onChange={(e) => handleFilterChange('kelas', e.target.value)}
                            className="w-full rounded-xl border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 py-2.5 cursor-pointer font-medium text-slate-700"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k: string, i: number) => (
                                <option key={i} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 w-32">NIS</th>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4 w-40">Kelas</th>
                                    <th className="px-6 py-4 w-32 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {siswas?.data?.length > 0 ? (
                                    siswas.data.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">
                                                    {s.nis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                                {s.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {s.kelas}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button onClick={() => handleResetPassword(s.id, s.nama)} className="p-2 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-lg transition-colors" title="Reset Password ke default">
                                                        <KeyRound className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => openEditModal(s)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Edit Data">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(s.id, s.nama)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Hapus Siswa">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-slate-50 p-4 rounded-full mb-3 border border-slate-100">
                                                    <Users className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">Data Tidak Ditemukan</p>
                                                <p className="text-xs text-slate-500 mt-1">Gunakan tombol 'Tambah Manual' atau 'Import Excel' untuk memasukkan data.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {siswas?.links?.length > 3 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-center gap-1.5">
                            {siswas.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${link.active
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                        } ${!link.url && 'opacity-50 pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL TAMBAH / EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-lg">{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{isEdit ? 'Perbarui informasi siswa.' : 'Password default: siswa123'}</p>
                            </div>
                        </div>
                        <form onSubmit={submitCrud} className="p-6 space-y-5">
                            <div>
                                <label className={labelClasses}>NIS</label>
                                <input type="text" value={data.nis} onChange={e => setData('nis', e.target.value)} className={inputClasses} placeholder="Masukkan Nomor Induk Siswa" required />
                                {errors.nis && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.nis}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Nama Lengkap</label>
                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className={inputClasses} placeholder="Nama Siswa Lengkap" required />
                                {errors.nama && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.nama}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Kelas / Kategori</label>
                                <input type="text" value={data.kelas} onChange={e => setData('kelas', e.target.value)} className={inputClasses} placeholder="Contoh: XII RPL 1" required />
                                {errors.kelas && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.kelas}</p>}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}