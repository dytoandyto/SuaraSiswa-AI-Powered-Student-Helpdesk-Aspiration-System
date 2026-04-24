import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatbotInterface from '@/components/Chatbot/ChatbotInterface';

export default function ChatBantuan() {
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // STATE MACHINE UNTUK FLOW PERCABANGAN
    const [conversationStep, setConversationStep] = useState('menu_utama');
    const [tempForm, setTempForm] = useState<any>({ judul: '', kategori: '', lokasi: '', ket: '' });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([
        { id: 'welcome', sender: 'bot', text: 'Halo! 👋 Saya adalah Asisten Digital SuaraSiswa.\n\nDi ruang obrolan ini, kamu bisa leluasa melaporkan masalah, bertanya informasi seputar sekolah, atau mengecek status laporanmu. Silakan pilih menu di bawah ini untuk mulai:', type: 'menu' }
    ]);

    useEffect(() => {
        const fetchHistory = () => {
            axios.get((window as any).route('chatbot.history'))
                .then(res => {
                    const historyMessages: any[] = [];
                    res.data.forEach((tiket: any) => {
                        // 1. Pesan Siswa dari DB
                        historyMessages.push({ id: `user_${tiket.id}`, sender: 'user', text: tiket.pertanyaan_siswa, type: 'text' });

                        // 2. Balasan Admin dari DB
                        if (tiket.status === 'terjawab') {
                            historyMessages.push({ id: `admin_${tiket.id}`, sender: 'bot', text: `👨‍💼 Balasan Admin:\n"${tiket.jawaban_admin}"`, type: 'text' });
                        } else {
                            historyMessages.push({ id: `pending_${tiket.id}`, sender: 'bot', text: `⏳ Pertanyaan ini masih menunggu balasan dari admin...`, type: 'text' });
                        }
                    });

                    setMessages(prev => {
                        // AMBIL PESAN LOKAL (Menu, Welcome, atau ketikan yang belum masuk DB)
                        const localInteractions = prev.filter(msg => typeof msg.id === 'number' || msg.id === 'welcome');

                        // FILTER: Buang ketikan lokal jika pesannya sudah berhasil masuk ke Database (mencegah duplikat)
                        const filteredLocal = localInteractions.filter(localMsg => {
                            if (localMsg.sender === 'user') {
                                const isAlreadyInDB = historyMessages.some(dbMsg => dbMsg.text === localMsg.text);
                                return !isAlreadyInDB; // Jika sudah ada di DB, buang yang versi lokal
                            }
                            return true;
                        });

                        // Gabungkan: History DB (paling atas) + Pesan Lokal yang sedang aktif (bawah)
                        return [...historyMessages, ...filteredLocal];
                    });
                }).catch(err => console.error(err));
        };

        fetchHistory();
        const intervalId = setInterval(fetchHistory, 7000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, conversationStep]);

    // ==========================================
    // FUNGSI SUBMIT ASPIRASI (MENDUKUNG FILE)
    // ==========================================
    const submitAspirasiAkhir = async (file: File | null = null) => {
        setIsTyping(true);
        try {
            const formData = new FormData();
            formData.append('judul', tempForm.judul);
            formData.append('kategori', tempForm.kategori);
            formData.append('lokasi', tempForm.lokasi);
            formData.append('ket', tempForm.ket);
            if (file) formData.append('lampiran', file);

            const res = await axios.post((window as any).route('chatbot.lapor'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setConversationStep('menu_utama');
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.message, type: 'menu' }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Terjadi kesalahan sistem saat mengirim laporan.', type: 'menu' }]);
            setConversationStep('menu_utama');
        } finally {
            setIsTyping(false);
            setTempForm({ judul: '', kategori: '', lokasi: '', ket: '' });
        }
    };

    // ==========================================
    // LOGIKA PERCABANGAN TEKS
    // ==========================================
    const handleAction = async (text: string) => {
        setIsTyping(true);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: text, type: 'text' }]);
        setInputText('');

        try {
            if (conversationStep === 'form_judul') {
                setTempForm({ ...tempForm, judul: text });
                setConversationStep('form_kategori');
                setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Kategori masalahnya apa? (Misal: Sarpras, IT, Kesiswaan)', type: 'text' }]), 500);
            }
            else if (conversationStep === 'form_kategori') {
                setTempForm({ ...tempForm, kategori: text });
                setConversationStep('form_lokasi');
                setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Bisa sebutkan lokasi detailnya? (Misal: Ruang Guru / Lab RPL)', type: 'text' }]), 500);
            }
            else if (conversationStep === 'form_lokasi') {
                setTempForm({ ...tempForm, lokasi: text });
                setConversationStep('form_ket');
                setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Silakan ketik detail kerusakannya selengkap mungkin di sini:', type: 'text' }]), 500);
            }
            else if (conversationStep === 'form_ket') {
                setTempForm({ ...tempForm, ket: text });
                setConversationStep('form_lampiran');
                setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Terakhir, apakah kamu punya foto buktinya? Klik tombol di bawah untuk mengunggah, atau lewati jika tidak ada.', type: 'text' }]), 500);
            }
            else if (conversationStep === 'tanya_info') {
                const res = await axios.post((window as any).route('chatbot.send'), { pesan: text });
                setConversationStep('menu_utama');
                setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.reply, type: 'menu' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Terjadi kesalahan jaringan.', type: 'menu' }]);
            setConversationStep('menu_utama');
        } finally {
            setIsTyping(false);
        }
    };

    const handleMainMenu = async (pilihan: string) => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: pilihan, type: 'text' }]);

        if (pilihan === 'Lapor Masalah') {
            setConversationStep('form_judul');
            setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Mari kita buat laporannya. Apa judul masalah yang terjadi?', type: 'text' }]), 500);
        }
        else if (pilihan === 'Tanya Info') {
            setConversationStep('tanya_info');
            setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Ketikkan pertanyaanmu secara lengkap. Saya akan mencarikan informasinya atau meneruskannya ke Staf terkait.', type: 'text' }]), 500);
        }
        else if (pilihan === 'Cek Status') {
            setIsTyping(true);
            try {
                const res = await axios.get((window as any).route('chatbot.status'));
                setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: res.data.reply, type: 'menu' }]);
            } catch (error) {
                setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Gagal memuat status.', type: 'menu' }]);
            }
            setIsTyping(false);
        }
    };

    return (
       <AppLayout breadcrumbs={[{ title: 'Pusat Bantuan', href: '/chat-bantuan' }]}>
            <Head title="Pusat Bantuan" />
            <div className="max-w-5xl mx-auto p-8 h-[calc(100vh-150px)]">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden h-full">
                    {/* Kirim isFullPage={true} agar tingginya menyesuaikan kontainer */}
                    <ChatbotInterface isFullPage={true} />
                </div>
            </div>
        </AppLayout>
    );
}