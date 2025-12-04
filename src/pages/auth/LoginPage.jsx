import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // HAPUS BARIS INI: await api.get('/sanctum/csrf-cookie'); 
      // Kita langsung tembak login saja.

      const response = await api.post('/login', { email, password });

      // Ambil & Simpan Token
      const token = response.data.access_token;
      const userData = response.data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect
      navigate('/dashboard'); 
      // atau window.location.href = '/dashboard'; (biar state bersih total)

    } catch (error) {
      console.error(error);
      alert('Login Gagal: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden bg-gray-50">
      
      {/* --- ANIMATED BACKGROUND (Fresh Blobs) --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-full overflow-hidden">
        {/* Blob Hijau Utama */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        {/* Blob Biru Muda (Untuk variasi segar) */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        {/* Blob Kuning/Lime (Aksen cerah) */}
        <div className="absolute rounded-full -bottom-32 left-20 w-96 h-96 bg-lime-200 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASS CARD (Light Mode) --- */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        {/* Card Background: Putih semi-transparan dengan border tipis */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white"></div>
        
        <div className="relative z-20">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-2xl rounded-full bg-primary-100">
                    🎓
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-800">Welcome Back!</h1>
                <p className="text-gray-500">Masuk untuk mengelola karirmu</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Input */}
                <div>
                    <label className="block mb-1 ml-1 text-sm font-semibold text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="nama@alumni.com"
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label className="block mb-1 ml-1 text-sm font-semibold text-gray-700">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Submit Button (Hijau Success) */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Memproses..." : "Masuk Aplikasi"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Lupa password? <a href="#" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">Reset di sini</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}