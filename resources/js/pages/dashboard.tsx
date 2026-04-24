import AdminView from '@/components/Dashboard/AdminView';
import SiswaView from '@/components/Dashboard/SiswaView';
import StatCard from '@/components/Dashboard/StatCard';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';


export default function Dashboard({ kategoris = [], aspirasis, stats, filters = {} }: any) {
    const { auth, flash } = usePage().props as any;
    const isStaff = auth.user.role !== 'siswa';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAspirasi, setSelectedAspirasi] = useState<any>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        judul: '', id_kategori: '', kategori_manual: '', lokasi: '', tujuan: '',
        tanggal_kejadian: '', ket: '', lampiran: null as File | null, status: 'Menunggu', feedback: '',
    });

    const submitSiswa = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('aspirasi.store'), {
            preserveScroll: true,
            preserveState: true, 
            onSuccess: () => {
                // Form langsung dikosongkan setelah berhasil
                reset('id_kategori', 'kategori_manual', 'lokasi', 'ket', 'judul', 'tujuan', 'tanggal_kejadian', 'lampiran');
            }
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
            preserveScroll: true,
            preserveState: true, 
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const filterData = Object.fromEntries(formData.entries());
        const cleanedData = Object.fromEntries(Object.entries(filterData).filter(([_, v]) => v !== ''));
        router.get(route('dashboard'), cleanedData, { preserveState: true });
    };

    const getPrintUrl = () => {
        const params = new URLSearchParams();
        if (filters.periode) params.append('periode', filters.periode);
        if (filters.dari_tanggal) params.append('dari_tanggal', filters.dari_tanggal);
        if (filters.sampai_tanggal) params.append('sampai_tanggal', filters.sampai_tanggal);
        if (filters.kategori) params.append('kategori', filters.kategori);
        if (filters.search) params.append('search', filters.search);
        return `/aspirasi/cetak?${params.toString()}`;
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Proses': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm";
    const labelClasses = "text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block";

    // Kumpulkan semua props untuk diparsing ke child component
    const viewProps = {
        data, setData, submitSiswa, processing, errors, kategoris, aspirasis, inputClasses, labelClasses, getStatusStyle,
        filters, handleFilter, openModal, isModalOpen, setIsModalOpen, selectedAspirasi, submitAdmin
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title={isStaff ? `Panel ${auth.user.role.toUpperCase()}` : "Pengaduan Siswa"} />

            <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
                {flash?.message && (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-xl shadow-sm flex items-center gap-3">
                        <div className="bg-teal-100 p-1.5 rounded-full">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-teal-900">Berhasil!</p>
                            <p className="text-xs text-teal-700 mt-0.5">{flash.message}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            {isStaff ? `Dashboard ${auth.user.role.toUpperCase()}` : 'Sistem Pengaduan Siswa'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, <span className="font-semibold text-slate-700">{auth.user.nama}</span> 👋</p>
                    </div>

                    {isStaff && (
                        <a href={getPrintUrl()} target="_blank" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Cetak Laporan
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {isStaff ? (
                        <>
                            <StatCard title="Total Masuk" value={stats.total} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="bg-indigo-500" lightColor="bg-indigo-50 text-indigo-600" />
                            <StatCard title="Menunggu" value={stats.menunggu} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-amber-500" lightColor="bg-amber-50 text-amber-600" />
                            <StatCard title="Diproses" value={stats.proses} icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" color="bg-blue-500" lightColor="bg-blue-50 text-blue-600" />
                            <StatCard title="Selesai" value={stats.selesai} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-emerald-500" lightColor="bg-emerald-50 text-emerald-600" />
                        </>

                    ) : (
                        <>
                            <StatCard title="Total Laporanmu" value={stats.total} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="bg-indigo-500" lightColor="bg-indigo-50 text-indigo-600" />
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                                <div className="pl-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Status Terakhir</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border mt-1 ${getStatusStyle(stats.terakhir)}`}>{stats.terakhir}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* PEMISAHAN LOGIKA RENDER */}
                {isStaff ? <AdminView {...viewProps} /> : <SiswaView {...viewProps} />}

            </div>
        </AppLayout>
    );
}