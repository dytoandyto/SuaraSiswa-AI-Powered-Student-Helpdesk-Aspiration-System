import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageCircle, X, Bot, User, ChevronLeft, RefreshCw } from 'lucide-react';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isWaitingAdmin, setIsWaitingAdmin] = useState(false);

    // State untuk Menu Dinamis FAQ
    const [faqData, setFaqData] = useState<any>({});
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([
        { id: 'welcome', sender: 'bot', text: 'Halo! 👋 Saya adalah Asisten AI SuaraSiswa. Silakan pilih kategori pertanyaan di bawah, atau ketik langsung pertanyaanmu.', type: 'menu' }
    ]);

    // Fetch History & FAQ Database saat Widget dibuka
    useEffect(() => {
        if (isOpen) {
            // Ambil FAQ Categories
            axios.get((window as any).route('chatbot.faqs'))
                .then(res => setFaqData(res.data))
                .catch(err => console.error("Gagal load FAQ", err));

            // Ambil History
            axios.get('/chatbot/history')
                .then(res => {
                    const historyMessages: any[] = [];
                    let pendingExists = false;

                    res.data.forEach((tiket: any) => {
                        historyMessages.push({ id: `user_${tiket.id}`, sender: 'user', text: tiket.pertanyaan_siswa });
                        if (tiket.status === 'terjawab') {
                            historyMessages.push({ id: `admin_${tiket.id}`, sender: 'bot', text: `👨‍💼 Admin menjawab:\n"${tiket.jawaban_admin}"` });
                        } else {
                            historyMessages.push({ id: `pending_${tiket.id}`, sender: 'bot', text: `⏳ Menunggu balasan Admin untuk: "${tiket.pertanyaan_siswa}"...` });
                            pendingExists = true;
                        }
                    });

                    setIsWaitingAdmin(pendingExists);
                    setMessages(prev => {
                        const welcomeMsg = prev.filter(msg => msg.id === 'welcome');
                        return [...welcomeMsg, ...historyMessages];
                    });
                });
        }
    }, [isOpen]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    // Handle Kirim Pesan
    const handleSendMessage = async (text: string, isFromMenu = false) => {
        if (!text.trim() || isTyping) return;

        setInputText('');
        setIsTyping(true);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: text }]);

        try {
            const res = await axios.post((window as any).route('chatbot.send'), { pesan: text });

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                text: res.data.reply,
                type: res.data.status === 'ask_ticket' ? 'ask_ticket' : 'text',
                originalQuestion: text // Simpan pertanyaan untuk dikirim ke tiket jika user setuju
            }]);

        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Maaf, server sedang sibuk. Coba lagi nanti ya!' }]);
        } finally {
            setIsTyping(false);
            if (isFromMenu) setActiveCategory(null); // Reset menu setelah klik pertanyaan
        }
    };

    // Handle Konfirmasi Bikin Tiket
    const handleBuatTiket = async (pertanyaan: string) => {
        setIsTyping(true);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: "Ya, tolong teruskan ke Admin." }]);

        try {
            const res = await axios.post((window as any).route('chatbot.tiket'), { pesan: pertanyaan });
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.reply }]);
            setIsWaitingAdmin(true);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Gagal membuat tiket.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Fungsi untuk mereset obrolan ke awal
    const handleResetChat = () => {
        setMessages([
            { id: 'welcome', sender: 'bot', text: 'Halo! 👋 Obrolan sudah direset. Silakan pilih kategori pertanyaan di bawah, atau ketik langsung pertanyaanmu.', type: 'menu' }
        ]);
        setActiveCategory(null);
        setInputText('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end no-print font-sans">
            {isOpen && (
                <div className="bg-white w-[350px] sm:w-[380px] h-[550px] max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full relative">
                                <Bot className="w-5 h-5 text-white" />
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide leading-tight">Pusat Informasi</h3>
                                <p className="text-[10px] text-indigo-100">Tanya seputar sekolah</p>
                            </div>
                        </div>

                        {/* KUMPULAN TOMBOL AKSI DI KANAN ATAS */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleResetChat}
                                title="Reset Obrolan"
                                className="text-indigo-100 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Tutup Chat"
                                className="text-indigo-100 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Area Chat */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

                                {msg.sender === 'bot' && (
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-auto border border-indigo-200">
                                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 max-w-[80%]">
                                    <div className={`px-4 py-3 text-[13px] shadow-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm'}`}>
                                        {msg.text}
                                    </div>

                                    {/* MENU KATEGORI & PERTANYAAN DINAMIS */}
                                    {msg.type === 'menu' && (
                                        <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm w-full">
                                            {!activeCategory ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider mb-1">Pilih Topik:</p>
                                                    {Object.keys(faqData).map((kategori) => (
                                                        <button
                                                            key={kategori}
                                                            onClick={() => setActiveCategory(kategori)}
                                                            className="text-left text-[12px] font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors flex justify-between items-center"
                                                        >
                                                            {kategori} <span className="text-indigo-400">→</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    <button onClick={() => setActiveCategory(null)} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 px-1 mb-1">
                                                        <ChevronLeft className="w-3 h-3" /> Kembali
                                                    </button>
                                                    {faqData[activeCategory].map((faq: any) => (
                                                        <button
                                                            key={faq.id}
                                                            onClick={() => handleSendMessage(faq.pertanyaan, true)}
                                                            className="text-left text-[11px] font-medium text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-100 px-3 py-2 rounded-xl transition-colors"
                                                        >
                                                            {faq.pertanyaan}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* TOMBOL KONFIRMASI TIKET */}
                                    {msg.type === 'ask_ticket' && (
                                        <div className="flex gap-2 mt-1 ml-1">
                                            <button
                                                onClick={() => handleBuatTiket(msg.originalQuestion)}
                                                className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-[11px] font-bold transition-colors shadow-sm"
                                            >
                                                Ya, Tanya Admin
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-auto border border-slate-300">
                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && <div className="text-[10px] text-slate-400 italic pl-10 animate-pulse">Asisten sedang mengetik...</div>}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Input Footer */}
                    <div className="p-3 bg-white border-t border-slate-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)] z-10">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex gap-2 relative items-center">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isTyping || isWaitingAdmin}
                                placeholder={isWaitingAdmin ? "⏳ Menunggu Admin..." : "Ketik pertanyaanmu..."}
                                className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-slate-100 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping || isWaitingAdmin}
                                className="absolute right-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Fab Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-indigo-600'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}