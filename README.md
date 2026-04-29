# 🏫 SuaraSiswa: AI-Powered Student Helpdesk System

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

> **SuaraSiswa** adalah platform transformasi digital untuk birokrasi sekolah. Mengintegrasikan **LLM (Large Language Model)** dari Google Gemini untuk memproses aspirasi siswa secara cerdas, transparan, dan terukur.

---

## 📌 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Preview Aplikasi](#-preview-aplikasi)
- [Instalasi](#-instalasi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

- **🤖 AI Assistant (Google Gemini):** Konsultasi informasi sekolah & *auto-routing* laporan via chatbot berbasis AI.
- **🛡️ Role-Based Access Control (RBAC):** Pemisahan akses yang ketat antara Siswa, Admin, dan Staf Divisi (Sarpras, Hubin, SIMS, Kesiswaan, Kurikulum).
- **📊 Real-time Dashboard:** Statistik laporan masuk, proses, dan rating kepuasan siswa yang ter-filter secara dinamis.
- **📑 Stored Procedure Integration:** Logika update status yang aman dan cepat di level database (SQL Layer).
- **📥 Mass Import & Export:** Manajemen data siswa massal via Excel dan fitur Cetak Laporan PDF resmi sekolah.
- **⭐ Student Feedback:** Sistem penilaian kinerja staf (Rating Bintang) setelah laporan dinyatakan tuntas.

---

## 🚀 Tech Stack

- **Framework:** [Laravel 12](https://laravel.com)
- **Frontend:** [React.js](https://reactjs.org) with [Inertia.js](https://inertiajs.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** MySQL (dengan Stored Procedures)
- **AI Engine:** Google Gemini API (Flash 1.5)

---

## 📸 Preview Aplikasi

Agar tampilan tidak terlalu besar, gambar di bawah ini telah disesuaikan ukurannya. Klik gambar untuk melihat ukuran penuh.

| **Landing Page** | **Dashboard Admin & Statistik** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/baacf093-87ff-4748-bbc6-cf8dbdd459fb" width="300" /> | <img src="https://github.com/user-attachments/assets/23cdb9c7-0c5c-4ad5-9723-6c4536b4c63d" width="300" /> |

| **Manajemen Aspirasi (Admin)** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/f97439f7-806a-4b5e-b7f8-87fcb06a2ea0" width="300" /> |

---

## 🛠️ Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal:

1. **Clone repository:**
   ```bash
   git clone [https://github.com/username/SuaraSiswa.git](https://github.com/username/SuaraSiswa.git)
   cd SuaraSiswa
2. **Install Dependencies:**
   ```bash
   composer install
   npm install
3. **Konfigurasi Key Environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   GEMINI_API_KEY
4. **Database Migration & Seeding:**
   ```bash
   php artisan migrate --seed
5. **Jalankan Aplikasi:**
   ```bash
   composer run dev
