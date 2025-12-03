# 💻 Alumni System Client (Frontend)

Repositori ini adalah antarmuka pengguna (User Interface) untuk **Sistem Informasi Alumni**. Aplikasi ini adalah Single Page Application (SPA) yang dibangun menggunakan **React**.

## 🛠 Tech Stack
* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS / Custom CSS
* **State Management:** React Context API / Redux (Tentukan sesuai implementasi)
* **HTTP Client:** Axios
* **Routing:** React Router DOM

## 📂 Progress & Fitur Saat Ini

### 1. Struktur Proyek
Aplikasi mengikuti struktur modular:
* `/src/components`: Reusable UI components (Button, Cards, Navbar).
* `/src/pages`: Halaman utama (Dashboard, Login, Profile).
* `/src/api`: Konfigurasi Axios dan endpoint services.

### 2. Fitur UI yang Sudah Ada
* **Authentication Flow:** Halaman Login dan Register sudah tersedia dengan validasi form dasar.
* **Dashboard Layout:** Sidebar navigasi dan Header responsif.
* **Profile Page:** UI untuk menampilkan dan mengedit data diri alumni/dosen (sesuai field di backend seperti NIP/NIDN).

## 🚀 Cara Menjalankan (Local Development)

1.  **Masuk ke direktori:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **Build untuk Production:**
    ```bash
    npm run build
    ```

## 🔌 Integrasi API
Frontend dikonfigurasi untuk berkomunikasi dengan Backend Laravel.
* **Base URL:** Biasanya `http://127.0.0.1:8000/api` (Dikonfigurasi di file `.env` frontend).

## 🗺️ Langkah Selanjutnya (Next Steps)
Fokus pengembangan frontend selanjutnya adalah:

1.  **[TODO] Integrasi Login (Auth State):** Menghubungkan form login dengan API `sanctum/csrf-cookie` dan menyimpan token/session.
2.  **[TODO] Form Tracer Study:** Membuat form wizard (multi-step) untuk pengisian data tracer study yang user-friendly.
3.  **[TODO] Dashboard Visualisasi:** Mengimplementasikan library chart (seperti Chart.js atau Recharts) untuk menampilkan statistik alumni (Implementasi konsep Big Data Dashboard: KPI Efisiensi & Serapan Lulusan).
4.  **[TODO] State Management Refinement:** Memastikan data user (dosen/alumni) tersimpan global setelah login agar tidak perlu fetch ulang di setiap halaman.

---
*Gunakan panduan ini saat meminta bantuan AI untuk memahami struktur komponen dan state aplikasi.*