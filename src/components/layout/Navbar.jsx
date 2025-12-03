import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Format Role (misal: 'alumni' -> 'Alumni')
  const roleName = user.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') 
    : 'User';

  const handleLogout = async () => {
    try {
      await api.post('/logout'); 
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.clear(); 
      navigate('/login');
    }
  };

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      
      {/* KIRI: Hamburger Button (Mobile) & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-700 hidden sm:block">Dashboard</h2>
      </div>

      {/* KANAN: User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="text-right hidden md:block mr-1">
            {/* Tampilkan Nama Dinamis */}
            <p className="text-sm font-bold text-gray-800 leading-tight">
                {user.name || 'Guest'}
            </p>
            {/* Tampilkan Role Dinamis */}
            <p className="text-xs text-primary-600 font-medium">
                {roleName}
            </p>
          </div>
          
          <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
            {/* Inisial Dinamis */}
            {(user.name?.[0] || 'U').toUpperCase()}
          </div>
          
          {/* Chevron Icon */}
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Bagian Mobile: Tampilkan Nama & Role di dalam dropdown */}
            <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                {/* PERBAIKAN DI SINI: ganti userRole jadi roleName */}
                <p className="text-xs text-gray-500">{roleName}</p> 
            </div>
            
            <Link 
              to="/alumni/profile" 
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profil Saya
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}