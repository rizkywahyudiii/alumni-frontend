import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const roleName = user.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') 
    : 'User';

  // Efek shadow saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup dropdown kalau klik luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GANTI HANDLE LOGOUT JADI SIMPEL
  const handleLogoutClick = () => {
      // Cukup buka modalnya saja
      setIsLogoutModalOpen(true);
      setIsDropdownOpen(false); // Tutup dropdown profil
  };

  // FUNGSI EKSEKUSI (Dipanggil saat tombol "Ya" di modal diklik)
  const confirmLogout = async () => {
      setIsLoggingOut(true);
      try {
          const token = localStorage.getItem('token');
          if (token) {
              await axios.post('http://localhost:8000/api/logout', {}, {
                  headers: { Authorization: `Bearer ${token}` }
              });
          }
      } catch (error) {
          console.error("Logout error", error);
      } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
      }
  };

  return (
  <>
    <header 
      className={`sticky top-0 z-30 flex items-center justify-between h-20 px-4 lg:px-8 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' // Saat discroll: putih transparan + shadow
          : 'bg-transparent' // Saat diatas: transparan (menyatu dengan background layout)
      }`}
    >
      {/* KIRI: Hamburger Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 transition-colors rounded-xl hover:bg-emerald-50 hover:text-emerald-600 lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </button>
        
        {/* Breadcrumb / Title simpel */}
        <div className="hidden sm:block">
           <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
           <p className="text-xs text-gray-400">Selamat datang kembali!</p>
        </div>
      </div>

      {/* KANAN: Profile */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-200 border ${
            isDropdownOpen ? 'bg-white border-emerald-200 shadow-md ring-2 ring-emerald-100' : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white rounded-full shadow-sm bg-gradient-to-br from-emerald-500 to-teal-500">
            {(user.name?.[0] || 'U').toUpperCase()}
          </div>
          
          <div className="hidden text-left md:block">
            <p className="mb-1 text-sm font-bold leading-none text-gray-700">
                {user.name?.split(' ')[0] || 'Guest'}
            </p>
            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                {roleName}
            </p>
          </div>

          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 w-56 mt-3 overflow-hidden origin-top-right bg-white border border-gray-100 shadow-xl rounded-2xl ring-1 ring-black/5 animate-fade-in-down">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 md:hidden">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs font-medium text-emerald-600">{roleName}</p>
            </div>
            
            <div className="p-2">
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors rounded-xl hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profil Saya
                </Link>
                
                <div className="h-px mx-2 my-1 bg-gray-100"></div>

                <button 
                  onClick={handleLogoutClick}
                  className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-red-600 transition-colors rounded-xl hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
            </div>
          </div>
        )}
      </div>
    </header>
    {/* PASANG MODAL DI LUAR HEADER (TAPI DALAM FRAGMENT) */}
        <ConfirmModal 
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={confirmLogout}
            title="Konfirmasi Logout"
            message="Apakah Anda yakin ingin keluar dari sesi ini?"
            variant="danger" // Mode Danger (Tombol Batal Solid, Tombol Ya Outline)
            isLoading={isLoggingOut}
        />
    </>
  );
}