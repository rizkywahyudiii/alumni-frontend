import React from 'react';
import { Link } from 'react-router-dom';
// Pastikan install lucide-react jika belum
import { Users, Briefcase, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-gray-800 bg-gray-50">
      
      {/* --- 1. ANIMATED BACKGROUND (Konsisten dengan Login) --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- 2. NAVBAR (Transparent) --- */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 text-xl text-white shadow-lg rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30">
            🎓
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">AlumniApp</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Masuk / Daftar
          </Link>
        </div>
      </nav>

      {/* --- 3. HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center max-w-5xl px-4 pt-10 pb-20 mx-auto text-center lg:pt-24 lg:pb-32">
        
        {/* Badge Kecil */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium border rounded-full text-emerald-700 bg-emerald-50 border-emerald-100 animate-fade-in-down">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
          </span>
          Portal Resmi Ikatan Alumni
        </div>

        {/* Headline Besar */}
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Jalin Kembali Koneksi, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Bangun Masa Depan.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mb-10 text-lg leading-relaxed text-gray-600 sm:text-xl">
          Wadah digital untuk terhubung kembali dengan teman seangkatan, 
          menemukan peluang karir eksklusif, dan berkontribusi bagi kemajuan almamater.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 shadow-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-1"
          >
            Mulai Sekarang
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a 
            href="#features" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* --- 4. DASHBOARD PREVIEW (MOCKUP) --- */}
        <div className="relative w-full max-w-4xl mx-auto mt-20 group perspective-1000">

            {/* Background Glow */}
            <div className="absolute transition duration-1000 -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur opacity-20 group-hover:opacity-40 group-hover:duration-200"></div>
            
            {/* Animated Card */}
            <div className="
                relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl 
                overflow-hidden transform transition-transform duration-700 
                group-hover:rotate-x-2 group-hover:rotate-y-2 group-hover:scale-[1.01]
                preserve-3d
            ">

                {/* Mockup Header */}
                <div className="flex items-center h-8 gap-2 px-4 border-b border-gray-200 bg-gray-100/50">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="grid items-center justify-center h-64 grid-cols-12 gap-6 p-6 bg-gray-50/50 sm:h-80">

                    {/* Sidebar Skeleton */}
                    <div className="hidden h-full col-span-3 bg-white border border-gray-100 shadow-sm rounded-xl sm:block">
                        <div className="w-3/4 h-4 mx-auto mt-4 rounded shimmer"></div>
                        <div className="w-2/3 h-3 mx-auto mt-2 rounded shimmer"></div>

                        <div className="w-full h-4 mt-6 bg-gray-50 shimmer"></div>
                        <div className="w-full h-4 mt-2 bg-gray-50 shimmer"></div>
                        <div className="w-full h-4 mt-2 bg-gray-50 shimmer"></div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex flex-col h-full col-span-12 gap-4 sm:col-span-9">

                        {/* Card Top */}
                        <div className="flex items-center gap-4 p-6 bg-white border border-gray-100 shadow-sm h-1/3 rounded-xl">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="w-32 h-4 mb-2 bg-gray-200 rounded shimmer"></div>
                                <div className="w-48 h-3 bg-gray-100 rounded shimmer"></div>
                            </div>
                        </div>

                        {/* Card Bottom (animated pulse chart) */}
                        <div className="flex items-end justify-around flex-1 p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="w-3 rounded bg-emerald-400 animate-bar"></div>
                            <div className="w-3 rounded bg-emerald-400 animate-bar-delayed"></div>
                            <div className="w-3 rounded bg-emerald-400 animate-bar"></div>
                            <div className="w-3 rounded bg-emerald-400 animate-bar-delayed"></div>
                        </div>

                    </div>
                </div>
                
                {/* Overlay Label */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
                    <p className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-full shadow-sm bg-white/90">
                        Preview Dashboard Aplikasi
                    </p>
                </div>
            </div>
        </div>
      </main>

      {/* --- 5. FEATURES SECTION --- */}
      <section id="features" className="relative z-10 py-24 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="px-6 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Fitur Unggulan</h2>
                <p className="max-w-2xl mx-auto text-gray-500">
                    Platform ini dirancang khusus untuk memenuhi kebutuhan alumni dan universitas dalam satu ekosistem terintegrasi.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Feature 1 */}
                <div className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl hover:-translate-y-1 group">
                    <div className="flex items-center justify-center mb-6 transition-colors duration-300 w-14 h-14 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                        <TrendingUp size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">Tracer Study Digital</h3>
                    <p className="leading-relaxed text-gray-500">
                        Isi kuesioner penelusuran alumni dengan mudah. Data Anda membantu akreditasi kampus dan peningkatan kualitas kurikulum.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl hover:-translate-y-1 group">
                    <div className="flex items-center justify-center mb-6 text-blue-600 transition-colors duration-300 w-14 h-14 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white">
                        <Briefcase size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">Portal Karir Eksklusif</h3>
                    <p className="leading-relaxed text-gray-500">
                        Temukan lowongan kerja dari sesama alumni atau perusahaan mitra. Posting lowongan untuk merekrut talenta terbaik dari almamater.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl hover:-translate-y-1 group">
                    <div className="flex items-center justify-center mb-6 text-purple-600 transition-colors duration-300 w-14 h-14 bg-purple-50 rounded-2xl group-hover:bg-purple-600 group-hover:text-white">
                        <Users size={28} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">Direktori Alumni</h3>
                    <p className="leading-relaxed text-gray-500">
                        Cari teman seangkatan, senior, atau mentor. Bangun jejaring profesional yang kuat dengan fitur pencarian pintar.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="relative z-10 py-12 bg-white border-t border-gray-200">
        <div className="flex flex-col items-center justify-between gap-6 px-6 mx-auto max-w-7xl md:flex-row">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-lg bg-emerald-600">🎓</div>
                <span className="font-bold text-gray-800">AlumniApp</span>
            </div>
            
            <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Ilmu Komputer UNIMED. All rights reserved.
            </p>

            <div className="flex gap-6">
                <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Privacy</a>
                <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Terms</a>
                <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Contact</a>
            </div>
        </div>
      </footer>

    </div>
  );
}

