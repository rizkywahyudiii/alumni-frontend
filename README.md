# 💻 Alumni System Client (Frontend)

Repositori ini adalah antarmuka pengguna (User Interface) untuk **Sistem Informasi Alumni**. Aplikasi ini adalah Single Page Application (SPA) yang dibangun menggunakan **React** dengan **Vite** sebagai build tool.

## 🛠 Tech Stack

* **Framework:** React.js 19.x (Vite)
* **Styling:** Tailwind CSS 3.x
* **HTTP Client:** Axios
* **Routing:** React Router DOM 7.x
* **Icons:** Lucide React
* **Charts:** Recharts
* **Fonts:** Inter (via @fontsource/inter)

## 📦 Dependencies & Packages

### Core Dependencies
* `react` ^19.2.0 - React library
* `react-dom` ^19.2.0 - React DOM renderer
* `react-router-dom` ^7.10.0 - Client-side routing
* `axios` ^1.13.2 - HTTP client untuk API calls

### UI & Styling
* `tailwindcss` ^3.4.17 - Utility-first CSS framework
* `@fontsource/inter` ^5.2.8 - Inter font family
* `lucide-react` ^0.555.0 - Icon library

### Data Visualization
* `recharts` ^3.5.1 - Chart library untuk visualisasi data

### Development Dependencies
* `vite` ^7.2.4 - Next generation frontend tooling
* `@vitejs/plugin-react` ^5.1.1 - Vite plugin untuk React
* `autoprefixer` ^10.4.22 - CSS vendor prefixing
* `postcss` ^8.5.6 - CSS post-processor
* `eslint` ^9.39.1 - JavaScript linter
* `@types/react` ^19.2.5 - TypeScript definitions untuk React
* `@types/react-dom` ^19.2.3 - TypeScript definitions untuk React DOM

## 📂 Struktur Proyek

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (Toast, Modal, Badge, dll)
│   │   └── layout/         # Layout components (Navbar, Sidebar, DashboardLayout)
│   ├── pages/              # Halaman aplikasi
│   │   ├── auth/          # Authentication pages (Login)
│   │   ├── alumni/        # Alumni-related pages
│   │   └── jobs/          # Job portal pages
│   ├── services/          # API services & configuration
│   └── App.jsx            # Main App component dengan routing
├── public/                # Static assets
└── package.json           # Dependencies
```

## ✅ Progress & Fitur Saat Ini

### ✅ 1. Authentication
* ✅ Halaman Login (`/login`)
* ✅ Integrasi dengan Laravel Sanctum API
* ✅ Token management (localStorage)
* ✅ Protected routes dengan `ProtectedRoute` component
* ✅ Auto redirect jika belum login

### ✅ 2. Layout & Navigation
* ✅ Dashboard Layout dengan Sidebar
* ✅ Navbar dengan user info
* ✅ Responsive design (mobile-friendly)
* ✅ Welcome Page (Landing page) dengan animasi

### ✅ 3. Dashboard
* ✅ Dashboard Statistics (`/dashboard`)
* ✅ Statistik total alumni terdata
* ✅ Statistik lowongan aktif
* ✅ Visualisasi data dengan Pie Chart & Bar Chart
* ✅ Reminder untuk mengisi tracer study

### ✅ 4. Profile Management
* ✅ Halaman Profile (`/profile`)
* ✅ Tab-based interface (Biodata, Akun & Keamanan, Privasi)
* ✅ Upload avatar/foto profil
* ✅ Update biodata (phone, address, linkedin, gender, dll)
* ✅ Ganti password
* ✅ Privacy settings (show_in_directory, allow_contact, show_email)
* ✅ Data akademik (read-only): NIM, Angkatan, Tahun Lulus

### ✅ 5. Career Management
* ✅ **Riwayat Pekerjaan** (`/alumni/employments`)
  * List semua employment
  * Tambah/Edit/Hapus employment
  * Filter berdasarkan employment type
  * Visibility toggle (public/private)
* ✅ **Riwayat Magang** (`/alumni/internships`)
  * List semua internship
  * Tambah/Edit/Hapus internship
  * Visibility toggle (public/private)

### ✅ 6. Tracer Study
* ✅ Form Tracer Study (`/tracer-study`)
* ✅ Multi-step form untuk pengisian data
* ✅ Validasi form
* ✅ Submit data ke backend

### ✅ 7. Job Portal
* ✅ **List Lowongan** (`/jobs`)
  * Tampilkan semua lowongan kerja
  * Search & filter lowongan
  * Filter berdasarkan job type
  * Filter "Punya Saya"
* ✅ **Detail Lowongan** (`/jobs/:id`)
  * Detail lengkap lowongan
  * Tombol lamar (email/URL)
* ✅ **Posting Lowongan** (`/jobs/create`)
  * Form untuk posting lowongan baru
  * Upload company logo
  * Validasi form

### ✅ 8. Alumni Directory
* ✅ **Direktori Alumni** (`/directory`)
  * Search alumni
  * List alumni dengan filter
* ✅ **Detail Alumni** (`/directory/:id`)
  * Profil publik alumni
  * Riwayat pekerjaan & magang (jika public)

### ✅ 9. UI Components
* ✅ Toast notification component
* ✅ Modal component
* ✅ Badge component
* ✅ Loading states
* ✅ Error handling

## 🚀 Cara Menjalankan (Local Development)

1. **Masuk ke direktori:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5173`

4. **Build untuk Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 🔌 Integrasi API

Frontend dikonfigurasi untuk berkomunikasi dengan Backend Laravel.

* **Base URL:** `http://localhost:8000/api` (dikonfigurasi di `src/services/api.js`)
* **Authentication:** Token-based (Bearer token) via Laravel Sanctum
* **CORS:** Sudah dikonfigurasi di backend untuk `http://localhost:5173`

### API Service Configuration
File `src/services/api.js` berisi:
* Axios instance dengan baseURL
* Request interceptor untuk auto-inject token
* Error handling

## 🎨 Styling

Aplikasi menggunakan **Tailwind CSS** untuk styling dengan konfigurasi custom:
* Custom color palette
* Custom animations (blob, fade-in, dll)
* Responsive breakpoints
* Dark mode ready (belum diimplementasi)

## 🗺️ Roadmap Pengembangan Selanjutnya

### 🔒 Role-Based Access Control (RBAC) - Frontend
Implementasi UI dan routing berdasarkan role user:
* **Alumni Dashboard** - Dashboard lengkap dengan semua fitur
* **Mahasiswa Dashboard** - Dashboard terbatas (view-only untuk beberapa fitur)
* **Dosen Dashboard** - Dashboard monitoring dan analytics
* **Kaprodi Dashboard** - Dashboard admin dengan full access

**Fitur RBAC yang akan dikembangkan:**
1. ✅ Role-based route protection
2. ✅ Role-based menu/navigation
3. ✅ Role-based component rendering
4. ✅ Role-based dashboard views
5. ✅ Role-based permissions UI

### 📱 Responsive Design Improvements
* Mobile-first approach untuk semua halaman
* Touch-friendly interactions
* Optimized untuk tablet

### 🎨 UI/UX Enhancements
* Dark mode support
* Loading skeletons
* Better error states
* Success animations
* Form validation improvements

### 📊 Advanced Analytics
* Interactive charts dengan drill-down
* Export chart sebagai image/PDF
* Real-time data updates
* Custom date range filters

### 🔔 Notifications System
* Toast notifications untuk semua actions
* In-app notification center
* Email notification preferences

### 🌐 PWA Support
* Service worker untuk offline support
* Install as app
* Push notifications

---

*Dokumentasi ini dibuat untuk memudahkan developer memahami struktur dan fitur aplikasi frontend.*
