import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppLogoIcon from '@/components/app-logo-icon'; // Pastikan path ini sesuai
import { ShieldCheck, Zap, LineChart, MessageSquarePlus, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
            <Head title="Selamat Datang di SuaraSiswa" />

            {/* NAVBAR */}
            <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all">
                <div className="flex items-center justify-between py-4 px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 group">
                        {/* Menggunakan AppLogoIcon Sesuai Request */}
                        <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 p-2 group-hover:scale-105 transition-transform">
                            <AppLogoIcon className="size-full text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-slate-800 leading-none">
                                Suara<span className="text-indigo-600">Siswa</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                            Masuk
                        </Link>
                        <Link href={route('login')} className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300">
                            Lapor Sekarang
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <main className="relative isolate pt-28 lg:pt-36 pb-16">
                {/* Background Decor */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#818cf8] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[11px] font-black tracking-widest text-indigo-700 uppercase bg-indigo-100/50 border border-indigo-200/50 rounded-full shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        Platform Pengaduan Sekolah Resmi
                    </span>
                    
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl mb-8 leading-[1.1]">
                        Suarakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Aspirasimu</span><br className="hidden sm:block" /> untuk Lingkungan yang Lebih Baik.
                    </h1>
                    
                    <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-600 max-w-2xl mx-auto mb-10">
                        Fasilitas rusak? Ada kendala belajar? Atau punya ide brilian untuk sekolah? Jangan diam saja, laporkan melalui sistem terpadu yang transparan dan cepat tanggap.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={route('login')} className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                            Mulai Buat Laporan
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#cara-kerja" className="w-full sm:w-auto rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center">
                            Pelajari Cara Kerjanya
                        </a>
                    </div>
                </div>
            </main>

            {/* FITUR & KEUNGGULAN SECTION */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Mengapa Menggunakan SuaraSiswa?</h2>
                        <p className="mt-4 text-lg text-slate-500">Didesain khusus untuk memberikan pengalaman melapor yang aman dan efektif.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
                            title="Aman & Terverifikasi"
                            desc="Sistem login terintegrasi memastikan setiap laporan berasal dari siswa resmi, menghindari laporan palsu."
                        />
                        <FeatureCard 
                            icon={<Zap className="w-8 h-8 text-amber-500" />}
                            title="Cepat Tanggap"
                            desc="Laporan langsung diteruskan ke meja Admin (Sarpras, Kesiswaan, dll) untuk ditindaklanjuti secara instan."
                        />
                        <FeatureCard 
                            icon={<LineChart className="w-8 h-8 text-emerald-500" />}
                            title="Transparan"
                            desc="Pantau terus status laporanmu (Menunggu, Diproses, Selesai) lengkap dengan balasan dari pihak sekolah."
                        />
                    </div>
                </div>
            </section>

            {/* CARA KERJA SECTION (Informatif) */}
            <section id="cara-kerja" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-6">Alur Pengaduan Sederhana</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Tidak perlu lagi repot mencari guru atau mengisi kertas saran. Sampaikan aspirasimu hanya dalam 3 langkah mudah dari perangkat apa saja.
                            </p>

                            <div className="space-y-8">
                                <StepItem 
                                    number="1"
                                    icon={<MessageSquarePlus className="w-6 h-6 text-indigo-600" />}
                                    title="Tulis Laporan & Bukti"
                                    desc="Pilih kategori, ceritakan masalah yang terjadi, dan unggah foto sebagai bukti (opsional)."
                                />
                                <StepItem 
                                    number="2"
                                    icon={<Clock className="w-6 h-6 text-blue-600" />}
                                    title="Sekolah Memproses"
                                    desc="Admin akan memverifikasi dan meneruskan laporan ke bagian yang berwenang (misal: Teknisi/Sarpras)."
                                />
                                <StepItem 
                                    number="3"
                                    icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                                    title="Masalah Selesai"
                                    desc="Kamu akan mendapatkan notifikasi dan pesan balasan langsung dari sekolah saat masalah telah diselesaikan."
                                />
                            </div>
                        </div>
                        
                        {/* Ilustrasi Kotak / Mockup Card UI */}
                        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 flex items-center justify-center p-8 overflow-hidden shadow-inner">
                            <div className="absolute w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl top-10 right-10"></div>
                            
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 relative z-10 hover:-translate-y-2 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <span className="text-indigo-600 font-black text-xs">A</span>
                                        </div>
                                        <div>
                                            <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
                                            <div className="h-2 w-16 bg-slate-100 rounded-full mt-2"></div>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-md">Selesai</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-3/4 bg-slate-800 rounded-md"></div>
                                    <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                                    <div className="h-3 w-5/6 bg-slate-100 rounded-md"></div>
                                </div>
                                <div className="mt-5 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                    <div className="h-2 w-16 bg-indigo-200 rounded-full mb-2"></div>
                                    <div className="h-2.5 w-full bg-slate-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-white border-t border-slate-200 text-center text-sm font-medium text-slate-500">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded flex items-center justify-center p-1">
                        <AppLogoIcon className="size-full text-white" />
                    </div>
                    <span className="font-black text-slate-800">SuaraSiswa.</span>
                </div>
                <p>&copy; {new Date().getFullYear()} UKK RPL - Project by <span className="font-bold text-slate-900">Andyto</span>.</p>
                <p className="mt-1 text-xs text-slate-400">Tugas Rekayasa Perangkat Lunak </p>
            </footer>
        </div>
    );
}

// ================= Komponen Pembantu (Reusable) =================

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group text-left">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

function StepItem({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center relative z-10">
                    {icon}
                </div>
                {/* Garis vertikal penghubung (kecuali untuk item terakhir, tapi kita biarkan saja sebagai dekorasi) */}
                <div className="absolute top-12 bottom-[-2rem] left-1/2 -translate-x-1/2 w-0.5 bg-slate-200 -z-0 hidden md:block"></div>
            </div>
            <div className="pb-4">
                <h4 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider">Step {number}</span> 
                    {title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}