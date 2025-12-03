import { useState } from 'react';
import api from '../services/api';
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
      // 1. Ambil CSRF
      await api.get('/sanctum/csrf-cookie');
      
      // 2. Login
      await api.post('/login', { email, password });

      // 3. AMBIL DATA USER (WAJIB ADA)
      // Kita panggil route '/api/user' yang ada di api.php
      const userResponse = await api.get('/api/user');
      
      // 4. Simpan ke LocalStorage
      // Laravel Resource membungkus data dalam object { data: ... }
      // Jadi kita ambil userResponse.data.data
      const userData = userResponse.data.data; 
      
      console.log('User Data:', userData); // Cek console, pastikan tidak kosong
      
      localStorage.setItem('user', JSON.stringify(userData));

      // 5. Redirect
      navigate('/dashboard'); 

    } catch (error) {
      console.error(error);
      alert('Login Gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      
      {/* --- ANIMATED BACKGROUND (Fresh Blobs) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Blob Hijau Utama */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        {/* Blob Biru Muda (Untuk variasi segar) */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        {/* Blob Kuning/Lime (Aksen cerah) */}
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASS CARD (Light Mode) --- */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        {/* Card Background: Putih semi-transparan dengan border tipis */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white"></div>
        
        <div className="relative z-20">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                    🎓
                </div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">Welcome Back!</h1>
                <p className="text-gray-500">Masuk untuk mengelola karirmu</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        placeholder="nama@alumni.com"
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
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
                    Lupa password? <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Reset di sini</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}