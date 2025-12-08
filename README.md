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

### 2. 📄 Frontend README (`frontend/README.md`)

```markdown
# 💻 Alumni System Client (Frontend)

Antarmuka pengguna (User Interface) untuk **Sistem Informasi Alumni**. Dibangun sebagai Single Page Application (SPA) menggunakan **React 19** dan **Vite**.

## 🛠 Tech Stack

* **Framework:** React.js 19.x (Vite)
* **Styling:** Tailwind CSS 3.x
* **Routing:** React Router DOM 7.x
* **Charts:** Recharts (Visualisasi Data)
* **Icons:** Lucide React
* **HTTP Client:** Axios

## ✅ Progress & Fitur

### 🔐 1. Security & Routing (RBAC)
* ✅ **RoleRoute Guard:** Mencegah user mengakses halaman yang tidak sesuai hak aksesnya (redirect ke 403).
* ✅ **Dynamic Sidebar:** Menu sidebar otomatis berubah sesuai role user yang login.
* ✅ **Error Pages:** Halaman kustom untuk 403 (Forbidden) dan 404 (Not Found).
* ✅ **Conditional Rendering:** Menyembunyikan tombol sensitif (misal: "Posting Job") bagi Mahasiswa.

### 👥 2. Modul Admin & Kaprodi
* ✅ **Manajemen User:** Halaman tabel untuk melihat, mencari, mengubah role, dan menghapus user.
* ✅ **Export Excel:** Tombol download laporan Tracer Study langsung dari Dashboard.
* ✅ **Super Admin Protection:** Menyembunyikan opsi edit Super Admin dari Admin biasa.

### 📊 3. Dashboard & Tracer Study
* ✅ **Smart Dashboard:** Menampilkan statistik & grafik.
* ✅ **Smart Reminder:** Peringatan "Isi Tracer Study" hanya muncul bagi Alumni yang belum mengisi.
* ✅ **Tracer Form:** Formulir multi-step untuk pendataan alumni.

### 💼 4. Job Portal
* ✅ **Lowongan Kerja:** Tampilan grid lowongan dengan fitur pencarian.
* ✅ **Create Job:** Form posting lowongan (Dibatasi untuk Alumni & Admin).

## 🚀 Roadmap Selanjutnya

1.  **🔑 Fitur Lupa Password**
    * UI untuk request reset password & form input password baru.
2.  **🔔 Pusat Notifikasi**
    * UI Lonceng notifikasi di Navbar.
3.  **🎨 UI/UX Improvements**
    * Dark Mode support.
    * Loading Skeleton yang lebih halus.
    * Responif Mobile yang lebih optimal.

## 📦 Instalasi & Menjalankan

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Jalankan Development Server:**
    ```bash
    npm run dev
    ```

---

*Dokumentasi ini dibuat untuk memudahkan developer memahami struktur dan fitur aplikasi frontend.*
