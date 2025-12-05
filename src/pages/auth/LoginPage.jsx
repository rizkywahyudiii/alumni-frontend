import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '../../components/common/Toast';
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Cek apakah ada pesan "Session Expired" saat halaman dimuat
  useEffect(() => {
    if (location.state?.sessionExpired) {
        setToast({
            show: true,
            message: 'Sesi Anda telah habis. Mohon login ulang.',
            type: 'error'
        });
        
        // Bersihkan state history agar kalau di-refresh alert gak muncul lagi
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Tutup toast sebelumnya jika ada
    setToast({ ...toast, show: false });

    try {
      // PERBAIKAN: Gunakan '/login' saja.
      // Karena baseURL di api.js sudah 'http://localhost:8000/api', 
      // maka request ini akan menjadi 'http://localhost:8000/api/login'.
      const response = await api.post('/login', { email, password });

      // Pastikan struktur response sesuai dengan backend Laravel Anda
      // Biasanya: response.data.token atau response.data.access_token
      const token = response.data.access_token || response.data.token;
      const userData = response.data.user;

      if (!token) {
        throw new Error('Token tidak ditemukan dalam respon server.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/dashboard'); 

    } catch (error) {
      console.error("Login Error:", error);
      
      let errorMessage = 'Login Gagal. Periksa email/password.';
      
      // Menangani pesan error dari backend
      if (error.response) {
        // Backend memberikan respon error (misal 401 atau 422)
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request terkirim tapi tidak ada respon (misal server mati atau CORS parah)
        errorMessage = 'Tidak dapat terhubung ke server. Cek koneksi Anda.';
      } else {
        // Error lainnya
        errorMessage = error.message;
      }

      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden font-sans bg-gray-50">
      
      {/* --- ANIMATED BACKGROUND --- */}
      {/* Pastikan tailwind.config.js sudah diupdate agar animasi blob jalan */}
      <div className="absolute top-0 left-0 z-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute rounded-full -bottom-32 left-20 w-96 h-96 bg-lime-200 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50"></div>
        
        <div className="relative z-20">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mx-auto mb-4 text-3xl text-white shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30">
                    🎓
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-800">Welcome Back!</h1>
                <p className="text-gray-500">Masuk untuk mengelola karirmu</p>
            </div>

            <div className="mb-8 text-center">
              {/* Pasang Toast disini */}
              {toast.show && (
                  <Toast 
                      message={toast.message} 
                      type={toast.type} 
                      onClose={() => setToast({ ...toast, show: false })} 
                  />
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block mb-1.5 ml-1 text-sm font-semibold text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-5 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 border border-gray-200 shadow-sm bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white"
                        placeholder="nama@alumni.com"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1.5 ml-1 text-sm font-semibold text-gray-700">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-5 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 border border-gray-200 shadow-sm bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                             <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             Memproses...
                        </span>
                    ) : "Masuk Aplikasi"}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Lupa password? <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">Reset di sini</a>
                </p>
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    <a 
                      href="/" 
                      className="inline-flex items-center gap-1.5 text-sm font-medium 
                                text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      <ArrowLeft size={16} className="text-gray-500" />
                      Kembali
                    </a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}