import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link
import Toast from '../../components/common/Toast';
import { ArrowLeft, Loader2 } from "lucide-react"; // Pakai icon loader biar rapi

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Cek Session Expired
  useEffect(() => {
    if (location.state?.sessionExpired) {
        setToast({
            show: true,
            message: 'Sesi Anda telah habis. Mohon login ulang.',
            type: 'error'
        });
        window.history.replaceState({}, document.title);
    } else if (location.state?.registered) {
        setToast({
            show: true,
            message: 'Registrasi berhasil! Silakan login.',
            type: 'success'
        });
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast({ ...toast, show: false });

    try {
      // POST Login
      const response = await api.post('/login', { email, password });

      const token = response.data.access_token; 
      const userData = response.data.user;

      // Simpan Auth Data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect Logic
      if (userData.email_verified_at === null) {
          navigate('/register-success', { state: { email: userData.email } });
      } else {
          navigate('/dashboard');
      }

    } catch (error) {
      console.error("Login Error:", error);
      
      let errorMessage = 'Login Gagal. Periksa email/password.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Cek koneksi Anda.';
      } else {
        errorMessage = error.message;
      }

      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden font-sans bg-gray-50 animate-fade-in">
      
      {/* --- ANIMATED BACKGROUND --- */}
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

            {/* Toast Notification */}
            <div className="mb-6">
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
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isLoading ? (
                        <>
                             <Loader2 className="animate-spin" size={20} />
                             Memproses...
                        </>
                    ) : "Masuk Aplikasi"}
                </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-4 text-center">
                {/* Opsi Daftar Baru */}
                <p className="text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link 
                        to="/register" 
                        className="font-semibold transition-colors text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                        Daftar sekarang
                    </Link>
                </p>

                {/* Forgot Password */}
                <p className="text-sm text-gray-500">
                    Lupa password?{' '}
                    <Link 
                        to="/forgot-password" 
                        className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                        Reset di sini
                    </Link>
                </p>

                {/* Back to Home */}
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}