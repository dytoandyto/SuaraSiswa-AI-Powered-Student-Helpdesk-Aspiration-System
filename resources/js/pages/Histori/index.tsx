import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Histori({ aspirasis }: any) {
    // Fungsi pembantu untuk warna badge status
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Proses': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Histori Aspirasi', href: '/histori' }]}>
            <Head title="Histori Laporan Saya" />

            <div className="p-4 md:p-8 w-full mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex justify-between items-end border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800">Histori Aspirasi Saya</h1>
                        <p className="text-sm text-gray-500 mt-1">Daftar seluruh laporan yang pernah kamu ajukan.</p>
                    </div>
                    {/* Tombol pintasan kembali ke form jika ingin lapor lagi */}
                    <Link href="/dashboard" className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                        + Buat Laporan Baru
                    </Link>
                </div>

                {/* Container Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
                            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b">
                                <tr>
                                    <th className="px-4 py-4 w-32 whitespace-nowrap">Tanggal</th>
                                    <th className="px-4 py-4 min-w-[200px]">Judul & Kategori</th>
                                    <th className="px-4 py-4 min">Tujuan</th>
                                    <th className="px-4 py-4 min-w-[250px]">Keterangan</th>
                                    <th className="px-4 py-4 min-w-[150px]">Lokasi Kejadian</th>
                                    <th className="px-4 py-4 text-center">Status</th>
                                    <th className="px-4 py-4 min-w-[200px]">Tanggapan Admin</th>
                                    <th className="px-4 py-4 text-center">Lampiran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {aspirasis?.data?.length > 0 ? (
                                    aspirasis.data.map((asp: any) => (
                                        <tr key={asp.id_aspirasi} className="hover:bg-gray-50 transition-colors">

                                            {/* Kolom Tanggal */}
                                            <td className="px-4 py-4 text-sm text-gray-600 font-semibold whitespace-nowrap align-top">
                                                {asp.tanggal_kejadian}
                                            </td>

                                            {/* Kolom Judul, Kategori */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                                                        {asp.kategori?.ket_kategori}  {asp.kategori_manual}
                                                    </span>
                                                    <h4 className="font-bold text-gray-800 text-sm whitespace-normal leading-tight">
                                                        {asp.judul || asp.lokasi}
                                                    </h4>
                                                </div>
                                            </td>

                                            {/* Kolom Tujuan */}
                                            <td className="px-1 py-4 align-top">
                                                <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">{asp.tujuan}</div>
                                            </td>

                                            {/* Kolom Keterangan */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="text-sm text-gray-600 whitespace-normal leading-relaxed line-clamp-3" title={asp.ket}>
                                                    {asp.ket}
                                                </div>
                                            </td>

                                            {/* Kolom Lokasi Kejadian */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="text-sm font-semibold text-gray-700 whitespace-normal leading-tight">{asp.lokasi}</div>
                                            </td>

                                            {/* Kolom Status */}
                                            <td className="px-4 py-4 text-center align-top">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusStyle(asp.status)}`}>
                                                    {asp.status}
                                                </span>
                                            </td>

                                            {/* Kolom Tanggapan / Feedback */}
                                            <td className="px-4 py-4 align-top">
                                                {asp.feedback ? (
                                                    <div className="text-xs text-gray-700 bg-indigo-50/50 p-2.5 rounded border border-indigo-100/50 whitespace-normal leading-relaxed line-clamp-3" title={asp.feedback}>
                                                        {asp.feedback}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Belum direspons</span>
                                                )}
                                            </td>

                                            {/* Kolom Lampiran (Icon Mata) */}
                                            <td className="px-4 py-4 text-center align-top">
                                                {asp.lampiran ? (
                                                    <a href={`/storage/${asp.lampiran}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Lihat Lampiran">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-300" title="Tidak ada lampiran">-</span>
                                                )}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    /* Tampilan jika data kosong */
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                <p className="text-base font-bold text-gray-700">Belum Ada Histori</p>
                                                <p className="text-xs text-gray-500 mt-1 mb-4">Kamu belum pernah mengajukan laporan apapun.</p>
                                                <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                                                    Mulai Lapor Sekarang
                                                </Link>
                                            </div>
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
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${link.active
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}