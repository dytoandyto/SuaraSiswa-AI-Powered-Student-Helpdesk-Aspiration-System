import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FileDown, Search, Trash2, UploadCloud, Users } from 'lucide-react';
import React from 'react';

export default function Index({ siswas, filters }: any) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('siswa.import'), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const handleSearch = (e: any) => {
        router.get(route('siswa.index'), { search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data siswa bernama ${nama}?`)) {
            router.delete(route('siswa.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Siswa', href: '/siswa' }]}>
            <Head title="Manajemen Siswa" />

            <div className="p-4 md:p-6 w-full px-4 md:px-8 mx-auto space-y-6">

                {/* Flash Message Modern */}
                {flash?.message && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <p className="text-sm font-bold text-teal-800">Informasi</p>
                                <p className="text-xs text-teal-700">{flash.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header & Import Form */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Database Siswa</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data seluruh siswa yang memiliki akses ke sistem.</p>
                    </div>

                    <form onSubmit={handleImport} className="flex flex-wrap items-center gap-2 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 shadow-sm w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-wider px-1">Import Data (Excel):</label>
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                className="w-full sm:w-auto text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-emerald-700 file:shadow-sm hover:file:bg-emerald-100 cursor-pointer text-emerald-800"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing || !data.file}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <UploadCloud className="w-4 h-4" />
                            {processing ? 'Mengunggah...' : 'Upload File'}
                        </button>
                    </form>
                </div>

                {/* Toolbar & Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            defaultValue={filters?.search}
                            onChange={handleSearch}
                            placeholder="Cari berdasarkan Nama atau NIS..."
                            className="pl-10 w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                    </div>
                    {/* Opsional: Tombol Download Template Excel jika kamu punya fiturnya */}
                    {/* <button className="hidden sm:flex text-xs font-bold text-indigo-600 hover:text-indigo-800 items-center gap-1.5 bg-indigo-50 px-3 py-2 rounded-lg transition-colors">
                        <FileDown className="w-4 h-4" /> Template Excel
                    </button> */}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase font-black tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-32">NIS</th>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4 w-40">Kelas</th>
                                    <th className="px-6 py-4 w-28 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {siswas?.data?.length > 0 ? (
                                    siswas.data.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-indigo-600 font-bold bg-indigo-50/30">
                                                {s.nis}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                                {s.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                                    {s.kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(s.id, s.nama)}
                                                    className="inline-flex items-center justify-center p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                    title="Hapus Data Siswa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                    <Users className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">Data Siswa Tidak Ditemukan</p>
                                                <p className="text-xs text-gray-500 mt-1">Belum ada data yang tersimpan atau pencarian tidak cocok.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {siswas?.links?.length > 3 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-center gap-1.5">
                            {siswas.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${link.active
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-50 pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}