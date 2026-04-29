# 🏫 SuaraSiswa: AI-Powered Student Helpdesk System

SuaraSiswa adalah platform transformasi digital untuk birokrasi sekolah. Mengintegrasikan LLM (Large Language Model) dari Google Gemini untuk memproses aspirasi siswa secara cerdas, transparan, dan terukur.

---

## ✨ Fitur Utama
- **🤖 AI Assistant (Google Gemini):** Konsultasi informasi sekolah & auto-routing laporan via chatbot.
- **🛡️ Role-Based Access Control (RBAC):** Pemisahan akses antara Siswa, Admin, dan Staf Divisi (Sarpras, Hubin, SIMS, Kesiswaan, Kurikulum).
- **📊 Real-time Dashboard:** Statistik laporan masuk, proses, dan rating kepuasan siswa.
- **📑 Stored Procedure Integration:** Logika update status yang aman dan cepat di level database.
- **📥 Mass Import & Export:** Manajemen data siswa via Excel dan cetak laporan PDF resmi.
- **⭐ Student Feedback:** Sistem rating bintang setelah laporan dinyatakan selesai.

## 🚀 Tech Stack
- **Framework:** [Laravel 12](https://laravel.com)
- **Frontend:** [React.js](https://reactjs.org) with [Inertia.js](https://inertiajs.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** MySQL
- **AI Engine:** Google Gemini API (Flash 1.5)

## 📸 Screenshots
<img width="1920" height="4496" alt="screencapture-localhost-8000-2026-04-29-07_45_40" src="https://github.com/user-attachments/assets/baacf093-87ff-4748-bbc6-cf8dbdd459fb" />
<img width="1920" height="2238" alt="screencapture-localhost-8000-dashboard-2026-04-29-07_50_07" src="https://github.com/user-attachments/assets/23cdb9c7-0c5c-4ad5-9723-6c4536b4c63d" />
<img width="1920" height="1407" alt="screencapture-localhost-8000-dashboard-2026-04-29-07_52_37" src="https://github.com/user-attachments/assets/f97439f7-806a-4b5e-b7f8-87fcb06a2ea0" />


## 🛠️ Instalasi

# Clone repository
git clone https://github.com/username/SuaraSiswa.git
cd SuaraSiswa

# Install dependencies PHP
composer install

# Install dependencies JavaScript
npm install

# Setup Environment
cp .env.example .env
php artisan key:generate

# Konfigurasi Database di .env
# DB_DATABASE=laravel_pengaduan_sekolah
# GEMINI_API_KEY=your_api_key_here

# Run Migration & Seeder (PENTING: Untuk data Role & Admin)
php artisan migrate --seed

# Jalankan Server
php artisan serve
# (Di terminal terpisah)
npm run dev
