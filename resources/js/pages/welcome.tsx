import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    ShieldCheck, Zap, LineChart, MessageSquarePlus,
    Clock, CheckCircle2, ArrowRight, Bot, Sparkles,
    FileText, MapPin, Mail, Phone, Github, Instagram
} from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden scroll-smooth">
            <Head title="Selamat Datang di SuaraSiswa" />

            {/* NAVBAR (Glassmorphism & Sticky) */}
            <nav className="fixed w-full z-50 top-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all">
                <div className="flex items-center justify-between py-4 px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 p-2 group-hover:rotate-12 transition-transform duration-300">
                            <AppLogoIcon className="size-full text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-slate-800 leading-none">
                                Suara<span className="text-indigo-600">Siswa</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#cara-kerja" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block">
                            Cara Kerja
                        </a>
                        <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                            Masuk
                        </Link>
                        <Link href={route('login')} className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-300/50 hover:-translate-y-1 transition-all duration-300">
                            Lapor Sekarang
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION (Clean & Breathing Room) */}
            <main className="relative isolate pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#818cf8] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                    <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black tracking-widest text-indigo-700 uppercase bg-indigo-100/80 border border-indigo-200 rounded-full shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            Platform Pengaduan Sekolah Resmi
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Suarakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Aspirasimu</span><br className="hidden sm:block" /> untuk Sekolah yang Lebih Baik.
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Punya keluhan fasilitas, usulan kegiatan, atau sekadar bingung jadwal? Sampaikan semuanya melalui platform digital terpadu dengan respon cepat.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <Link href={route('login')} className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group">
                            Mulai Buat Laporan
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                        <a href="#cara-lapor" className="w-full sm:w-auto rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            Lihat Cara Lapor
                        </a>
                    </div>
                </div>
            </main>

            {/* SEKSI 2 CARA MELAPOR (Interaktif & Spacious) */}
            <section id="cara-lapor" className="py-24 bg-white relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-4">Dua Cara Mudah Melapor</h2>
                        <div className="h-1.5 w-20 bg-indigo-600 rounded-full mx-auto mb-6"></div>
                        <p className="text-slate-500 max-w-xl mx-auto text-lg">Pilih jalur pelaporan yang paling nyaman untukmu. Keduanya langsung terhubung ke meja Admin.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Cara 1: Form */}
                        <div className="bg-[#F8FAFC] p-10 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>

                            <div className="w-16 h-16 bg-white border-2 border-indigo-100 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-sm group-hover:bg-indigo-600 transition-colors duration-300">
                                <FileText className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">1. Mode Form Klasik</h3>
                            <p className="text-slate-600 leading-relaxed mb-8 relative z-10">
                                Cocok untuk laporan formal yang butuh detail spesifik seperti foto bukti kejadian, tanggal pasti, dan divisi tujuan yang jelas.
                            </p>

                            <ul className="space-y-3 text-sm font-bold text-slate-700 relative z-10 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Upload Bukti Foto / PDF</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Pilih Divisi Tujuan Akurat</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Histori Tracking Rapi</li>
                            </ul>
                        </div>

                        {/* Cara 2: Chatbot */}
                        <div className="bg-slate-900 p-10 rounded-[2rem] border border-slate-800 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/50 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>

                            <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-sm group-hover:bg-gradient-to-br from-indigo-500 to-blue-500 transition-all duration-300">
                                <Bot className="w-8 h-8 text-emerald-400 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 relative z-10">2. Mode Asisten AI</h3>
                            <p className="text-slate-400 leading-relaxed mb-8 relative z-10">
                                Sedang buru-buru? Cukup ketik keluhanmu seperti sedang <i>chatting</i>. Asisten pintar kami akan otomatis membuatkan tiket laporannya.
                            </p>

                            <ul className="space-y-3 text-sm font-bold text-slate-200 relative z-10 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-emerald-400" /> Pakai Bahasa Gaul & Santai</li>
                                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-emerald-400" /> Tanya-Jawab Seputar Sekolah</li>
                                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-emerald-400" /> Otomatis Buat Tiket Admin</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FITUR & KEUNGGULAN SECTION (Clean Grid) */}
            <section className="py-24 bg-[#F8FAFC] border-y border-slate-200/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-4">Mengapa Menggunakan SuaraSiswa?</h2>
                        <div className="h-1.5 w-20 bg-indigo-600 rounded-full mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />} title="Verifikasi Akun" desc="Hanya siswa terdaftar yang bisa melapor, meminimalisir laporan palsu dan menjaga kredibilitas." />
                        <FeatureCard icon={<Zap className="w-8 h-8 text-amber-500" />} title="Respon Cepat" desc="Sistem merutekan laporan langsung ke divisi terkait (Sarpras, Kesiswaan, IT) secara otomatis." />
                        <FeatureCard icon={<LineChart className="w-8 h-8 text-emerald-500" />} title="Transparansi" desc="Siswa dapat memantau progres laporan dari 'Menunggu' hingga 'Selesai' secara real-time." />
                    </div>
                </div>
            </section>

            {/* CARA KERJA SECTION (Visual Timeline) */}
            <section id="cara-kerja" className="py-24 bg-white relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                                <Clock className="w-4 h-4" /> Proses Mudah & Cepat
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-10">Alur Pengaduan Transparan</h2>

                            <div className="space-y-10">
                                <StepItem number="1" icon={<MessageSquarePlus className="w-6 h-6 text-indigo-600" />} title="Tulis & Kirim Laporan" desc="Deskripsikan masalah dengan jelas, sertakan lokasi, dan unggah foto bukti jika ada." />
                                <StepItem number="2" icon={<ShieldCheck className="w-6 h-6 text-blue-600" />} title="Verifikasi Admin" desc="Laporanmu akan dibaca dan diteruskan ke staf atau guru yang bertanggung jawab." />
                                <StepItem number="3" icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} title="Tindakan & Selesai" desc="Masalah diperbaiki. Kamu akan mendapat notifikasi dan balasan resmi dari sekolah." isLast={true} />
                            </div>
                        </div>

                        {/* Visual Mockup */}
                        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 flex items-center justify-center p-8 overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                            {/* Dekorasi Layar */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>

                            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center"><span className="text-indigo-600 font-black text-sm">TB</span></div>
                                        <div>
                                            <div className="h-3 w-28 bg-slate-800 rounded-full mb-2"></div>
                                            <div className="h-2 w-20 bg-slate-300 rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-200">Selesai</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-slate-800 rounded-md"></div>
                                    <div className="h-4 w-5/6 bg-slate-800 rounded-md mb-6"></div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                        <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-indigo-500">Tanggapan Admin</div>
                                        <div className="h-3 w-full bg-slate-300 rounded-full mb-2"></div>
                                        <div className="h-3 w-2/3 bg-slate-300 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MEGA FOOTER (Profesional & Lengkap) */}
            <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 border-t-[6px] border-indigo-600">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                        {/* Kolom 1: Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center p-2">
                                    <AppLogoIcon className="size-full text-white" />
                                </div>
                                <span className="font-black text-2xl tracking-tight text-white">
                                    Suara<span className="text-indigo-400">Siswa</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Platform digital modern untuk menampung aspirasi, keluhan, dan pelaporan siswa secara terstruktur, cerdas, dan transparan.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                            </div>
                        </div>

                        {/* Kolom 2: Navigasi Cepat */}
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Navigasi Utama</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><a href="#cara-lapor" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Cara Melapor</a></li>
                                <li><a href="#cara-kerja" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Alur Proses</a></li>
                                <li><Link href={route('login')} className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Login Siswa</Link></li>
                            </ul>
                        </div>

                        {/* Kolom 3: Informasi Proyek */}
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Informasi Sistem</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><span className="text-slate-500 block text-xs mb-1">Pengembang</span>Andyto Murti P. H.</li>
                                <li><span className="text-slate-500 block text-xs mb-1">Jurusan</span>Rekayasa Perangkat Lunak</li>
                                <li><span className="text-slate-500 block text-xs mb-1">Status Proyek</span>UKK / Tugas Akhir 2026</li>
                            </ul>
                        </div>

                        {/* Kolom 4: Kontak Sekolah */}
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Hubungi Sekolah</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span>SMK Taruna Bhakti<br />Depok, Jawa Barat</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                    <span>(021) 8728282</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                    <span>info@smktarunabhakti.net</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Copyright Bar */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                        <p>&copy; {new Date().getFullYear()} SuaraSiswa. Dikembangkan dengan ❤️ oleh Andyto.</p>
                        <p>Powered by Laravel, React, & Google Gemini AI.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ================= Komponen Pembantu (Reusable) =================
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-2 transition-all duration-300 group text-left">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

function StepItem({ number, icon, title, desc, isLast = false }: { number: string, icon: React.ReactNode, title: string, desc: string, isLast?: boolean }) {
    return (
        <div className="flex gap-6 group">
            <div className="flex-shrink-0 relative flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full shadow-md border-2 border-slate-100 flex items-center justify-center relative z-10 group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-300">
                    {icon}
                </div>
                {!isLast && <div className="w-1 h-full bg-slate-100 mt-2 rounded-full group-hover:bg-indigo-100 transition-colors duration-300"></div>}
            </div>
            <div className={`pb-8 ${isLast ? '' : 'pt-2'}`}>
                <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">Tahap {number}</span> {title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}