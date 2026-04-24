import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function ChatbotInterface({ isFullPage = false }: { isFullPage?: boolean }) {
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // STATE MACHINE UNTUK FLOW
    // Tambahan step: form_tujuan (Untuk memilih staf)
    const [conversationStep, setConversationStep] = useState('menu_utama');
    const [tempForm, setTempForm] = useState<any>({ judul: '', kategori: '', tujuan: '', lokasi: '', ket: '' });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([
        { id: 'welcome', sender: 'bot', text: 'Halo! 👋 Saya siap memandumu membuat laporan resmi. Silakan mulai dengan menuliskan JUDUL masalahnya secara singkat. (Contoh: "Kran Toilet Patah")', type: 'text' }
    ]);

    useEffect(() => {
        if (conversationStep === 'menu_utama') setConversationStep('form_judul');
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // ==========================================
    // SISTEM VALIDASI ANTI-ISENG (SPAM GUARD)
    // ==========================================
    const isSpamOrInvalid = (text: string) => {
        const trimmed = text.trim();
        // 1. Cek jika terlalu pendek (kurang dari 5 karakter)
        if (trimmed.length < 5) return "Pesan terlalu pendek. Tolong jelaskan lebih detail ya (minimal 5 huruf).";

        // 2. Cek karakter spam berulang (misal: "aaaaa", "asdfg")
        if (/^(.)\1{4,}$/.test(trimmed)) return "Jangan mengetik karakter berulang secara iseng ya.";

        // 3. Cek kata kasar (Filter Dasar - Bisa kamu tambahkan sendiri)
        const badWords = ['anjing', 'babi', 'bangsat', 'goblok', 'tolol', 'idiot', 'sialan', 'brengsek', 'kontol', 'memek', 'bajingan', 'jancok', 'bacot', 'setan', 'brengsek', 'tai', 'lonte', 'pelacur', 'lc', 'gblk', 'bgsd', 'ajg'];
        if (badWords.some(word => trimmed.toLowerCase().includes(word))) {
            return "Mohon gunakan bahasa yang sopan. Laporan ini akan dibaca langsung oleh Staf Sekolah.";
        }

        return false; // Berarti valid
    };

    // ==========================================
    // FUNGSI SUBMIT ASPIRASI
    // ==========================================
    const submitAspirasiChat = async (file: File | null = null) => {
        setIsTyping(true);
        try {
            const formData = new FormData();
            formData.append('judul', tempForm.judul);
            // Paksa ID Kategori = null, dan masukkan nama kategori ke 'kategori_manual'
            formData.append('kategori', tempForm.kategori);
            formData.append('tujuan', tempForm.tujuan); // Kirim staf tujuan
            formData.append('lokasi', tempForm.lokasi);
            formData.append('ket', tempForm.ket);
            if (file) formData.append('lampiran', file);

            const res = await axios.post((window as any).route('chatbot.lapor'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setConversationStep('selesai');
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.message, type: 'text' }]);

            router.reload({ only: ['aspirasis', 'stats'] });

        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Gagal mengirim laporan. Pastikan semua data terisi benar.', type: 'text' }]);
            setConversationStep('selesai');
        } finally {
            setIsTyping(false);
        }
    };

    // ==========================================
    // LOGIKA PERCABANGAN (HANDLE INPUT)
    // ==========================================
    const handleChatAction = async (text: string) => {
        setIsTyping(true);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: text, type: 'text' }]);
        setInputText('');

        setTimeout(() => {
            // STEP 1: VALIDASI JUDUL
            if (conversationStep === 'form_judul') {
                const validationError = isSpamOrInvalid(text);
                if (validationError) {
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: validationError + ' Coba ketik judulnya lagi:', type: 'text' }]);
                } else {
                    setTempForm({ ...tempForm, judul: text, kategori: '(Via Chat)' }); // Set default kategori
                    setConversationStep('form_tujuan');
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Judul dicatat. Nah, laporan ini mau ditujukan ke divisi mana?', type: 'pilihan_tujuan' }]);
                }
            }

            // STEP 2: LOKASI
            else if (conversationStep === 'form_lokasi') {
                const validationError = isSpamOrInvalid(text);
                if (validationError) {
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: validationError + ' Sebutkan lokasinya dengan jelas ya:', type: 'text' }]);
                } else {
                    setTempForm({ ...tempForm, lokasi: text });
                    setConversationStep('form_ket');
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Lokasi dicatat. Sekarang, ceritakan kronologi atau detail masalahnya secara lengkap:', type: 'text' }]);
                }
            }

            // STEP 3: DESKRIPSI (KET)
            else if (conversationStep === 'form_ket') {
                const validationError = isSpamOrInvalid(text);
                if (text.length < 15) { // Syarat deskripsi lebih ketat (min 15 huruf)
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Deskripsi terlalu singkat. Tolong jelaskan minimal 15 huruf agar staf mudah memahaminya. Coba ketik lagi:', type: 'text' }]);
                } else if (validationError) {
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: validationError, type: 'text' }]);
                } else {
                    setTempForm({ ...tempForm, ket: text });
                    setConversationStep('form_lampiran');
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Deskripsi disimpan. Ada foto buktinya? Unggah fotonya agar cepat diproses, atau lewati.', type: 'text' }]);
                }
            }

            setIsTyping(false);
        }, 600);
    };

    // Fungsi khusus untuk menangani klik tombol Pilihan Tujuan
    const handlePilihTujuan = (tujuanCode: string, tujuanText: string) => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: tujuanText, type: 'text' }]);
        setIsTyping(true);

        setTimeout(() => {
            setTempForm({ ...tempForm, tujuan: tujuanCode });
            setConversationStep('form_lokasi');
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: `Baik, laporan akan dikirim ke ${tujuanText}. Di mana lokasi spesifik kejadiannya? (Misal: Ruang 22)`, type: 'text' }]);
            setIsTyping(false);
        }, 600);
    };

    return (
        <div className={`flex flex-col bg-[#F8FAFC] ${isFullPage ? 'h-full' : 'h-[550px]'} relative`}>

            {/* AREA CHAT */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl text-[14px] shadow-sm leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                            }`}>
                            {msg.text}
                        </div>

                        {/* RENDER TOMBOL PILIHAN TUJUAN */}
                        {msg.type === 'pilihan_tujuan' && conversationStep === 'form_tujuan' && (
                            <div className="flex flex-col gap-2 mt-3 ml-2 w-full max-w-xs animate-in slide-in-from-left-4">
                                <button onClick={() => handlePilihTujuan('SARPRAS', '🏢 Sarana Prasarana')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    🏢 Sarana Prasarana (Fasilitas)
                                </button>
                                <button onClick={() => handlePilihTujuan('SIMS', '💻 Tim IT / SIMS')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    💻 Tim IT / SIMS (Wifi, Web)
                                </button>
                                <button onClick={() => handlePilihTujuan('KESISWAAN', '👮 Kesiswaan')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    👮 Kesiswaan (Disiplin, Ekskul)
                                </button>
                                <button onClick={() => handlePilihTujuan('KURIKULUM', '📚 Kurikulum')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    📚 Kurikulum (Jadwal, Nilai)
                                </button>
                                <button onClick={() => handlePilihTujuan('HUBIN', '🤝 Hubungan Industri')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    🤝 Hubungan Industri (PKL)
                                </button>
                                <button onClick={() => handlePilihTujuan('ADMIN', '📑 Tata Usaha')} className="bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-xl text-left transition-all">
                                    📑 Tata Usaha (SPP, Surat)
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && <div className="text-xs text-slate-400 italic animate-pulse pl-2">Asisten sedang mengetik...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* AREA INPUT BAWAH */}
            <div className="p-4 bg-white border-t border-slate-200 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">

                {conversationStep === 'form_tujuan' ? (
                    // Jika sedang tahap pilih tujuan, sembunyikan input text
                    <div className="text-center text-xs text-slate-500 font-bold p-2 bg-slate-50 rounded-xl">
                        👆 Silakan klik salah satu pilihan di atas
                    </div>

                ) : conversationStep === 'form_lampiran' ? (
                    // Jika sedang minta foto
                    <div className="flex gap-3">
                        <input type="file" id="chat-upload-lampiran" className="hidden" accept="image/*,.pdf" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `📎 Mengirim ${file.name}...`, type: 'text' }]);
                                submitAspirasiChat(file);
                            }
                        }} />
                        <label htmlFor="chat-upload-lampiran" className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3.5 rounded-xl text-center text-sm font-black cursor-pointer border-2 border-indigo-200 transition-colors">
                            📸 Unggah Foto Bukti
                        </label>
                        <button onClick={() => {
                            setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: 'Lewati', type: 'text' }]);
                            submitAspirasiChat(null);
                        }} className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                            Lewati
                        </button>
                    </div>

                ) : conversationStep === 'selesai' ? (
                    <button onClick={() => window.location.reload()} className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md">
                        Buat Laporan Baru
                    </button>

                ) : (
                    // Tampilan Text Input Normal
                    <form onSubmit={(e) => { e.preventDefault(); inputText.trim() && handleChatAction(inputText); }} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isTyping}
                            placeholder="Ketik balasanmu di sini..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <button type="submit" disabled={!inputText.trim() || isTyping} className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-10 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm">
                            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}