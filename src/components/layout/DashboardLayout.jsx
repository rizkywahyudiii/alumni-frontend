import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useIdleTimer from '../../hooks/useIdleTimer';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // --- 1. AMBIL USER & ROLE ---
  // Kita perlu tahu siapa yang login untuk filter menu
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const userRole = user.role || 'guest'; // Default guest jika error

  // --- LOGIKA AUTO LOGOUT ---
  const handleAutoLogout = () => {
    console.log("User tidak aktif. Auto logout...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { state: { sessionExpired: true } });
  };

  useIdleTimer(handleAutoLogout, 1800000); 

  // --- 2. DEFINISI MENU DENGAN RBAC ---
  // Tambahkan property 'allowedRoles' (Array)
  // Jika allowedRoles tidak didefinisikan, anggap menu itu PUBLIC untuk semua user login
  const allMenus = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      // allowedRoles: ['alumni', 'admin', 'dosen', 'mahasiswa', 'super_admin'], // Bisa dikosongkan jika semua boleh
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>)
    },
    { 
      name: 'Tracer Study', 
      path: '/tracer-study', 
      allowedRoles: ['alumni', 'super_admin'], // Hanya Alumni & Super Admin
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>)
    },
    { 
      name: 'Riwayat Pekerjaan', 
      path: '/alumni/employments', 
      allowedRoles: ['alumni', 'super_admin'], 
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>)
    },
    { 
      name: 'Riwayat Magang', 
      path: '/alumni/internships', 
      allowedRoles: ['alumni', 'super_admin'],
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>)
    },
    { 
      name: 'Lowongan Kerja', 
      path: '/jobs', 
      // Semua user login boleh lihat jobs, jadi tidak perlu allowedRoles
      // Tapi jika ingin membatasi create job, itu logic-nya di halaman /jobs/create, bukan di menu sidebar ini.
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>)
    },
    { 
      name: 'Direktori Alumni', 
      path: '/directory', 
      // Semua user login boleh lihat direktori
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>)
    },
    { 
      name: 'Manajemen User', 
      path: '/admin/users', 
      allowedRoles: ['admin', 'super_admin'],
      icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>)
    },
  ];

  // --- 3. FILTER MENU ---
  const filteredMenus = allMenus.filter(menu => {
    // Jika tidak ada batasan role (undefined), tampilkan ke semua
    if (!menu.allowedRoles) return true;
    
    // Jika ada batasan, cek apakah role user saat ini ada di list allowedRoles
    return menu.allowedRoles.includes(userRole);
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        // Kirim menu yang sudah difilter
        menuItems={filteredMenus} 
      />

      <div className="flex flex-col min-h-screen transition-all duration-300 lg:ml-64">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
             <Outlet />
          </div>
        </main>

        <footer className="p-6 text-xs text-center text-gray-400">
           &copy; {new Date().getFullYear()} AlumniApp System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}