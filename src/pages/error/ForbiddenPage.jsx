import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden font-sans text-gray-800 bg-gray-50">
      
      {/* --- BACKGROUND ANIMATION (Sama dengan WelcomePage) --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-lg p-8 mx-4 text-center border shadow-2xl bg-white/60 backdrop-blur-xl border-white/50 rounded-3xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-red-600 bg-red-100 rounded-2xl animate-bounce">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Akses Ditolak</h1>
        <p className="mb-8 text-lg text-gray-600">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini (403).
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-gray-900 shadow-lg rounded-xl hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}