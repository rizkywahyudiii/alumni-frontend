import { Link } from 'react-router-dom';
import {
  Users, Briefcase, TrendingUp, ArrowRight, CheckCircle, ShieldCheck,
  IdCard, ClipboardList, Network,
} from 'lucide-react';

const features = [
  {
    icon: <TrendingUp size={24} />,
    color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
    title: 'Tracer Study Digital',
    desc: 'Isi kuesioner penelusuran alumni dalam hitungan menit. Data Anda membantu akreditasi kampus dan perbaikan kurikulum.',
  },
  {
    icon: <Briefcase size={24} />,
    color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    title: 'Portal Karir',
    desc: 'Temukan lowongan dari sesama alumni, atau pasang lowongan untuk merekrut talenta terbaik dari almamater.',
  },
  {
    icon: <Users size={24} />,
    color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    title: 'Direktori Alumni',
    desc: 'Cari teman seangkatan, senior, atau mentor dan bangun jejaring profesional yang kuat.',
  },
  {
    icon: <ShieldCheck size={24} />,
    color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600',
    title: 'Privasi Terkendali',
    desc: 'Anda yang menentukan apakah profil, email, dan riwayat karir ditampilkan ke publik.',
  },
];

const steps = [
  { icon: <IdCard size={22} />, title: 'Aktivasi dengan NIM', desc: 'Verifikasi identitas memakai NIM dan tanggal lahir yang terdaftar di kampus.' },
  { icon: <ClipboardList size={22} />, title: 'Lengkapi Data Karir', desc: 'Isi tracer study, riwayat pekerjaan, dan pengalaman magang Anda.' },
  { icon: <Network size={22} />, title: 'Terhubung & Berkembang', desc: 'Jelajahi direktori alumni dan temukan peluang karir baru.' },
];

const highlights = ['Verifikasi via NIM', 'Privasi terjaga', 'Gratis untuk alumni'];

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-gray-800 bg-gray-50">

      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute inset-x-0 top-0 z-0 overflow-hidden pointer-events-none h-[42rem]" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-50 motion-safe:animate-blob"></div>
        <div className="absolute top-32 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-50 motion-safe:animate-blob animation-delay-2000"></div>
        <div className="absolute top-80 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-lime-200 rounded-full mix-blend-multiply blur-3xl opacity-40 motion-safe:animate-blob animation-delay-4000"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 border-b border-transparent bg-gray-50/70 backdrop-blur-md">
        <nav className="flex items-center justify-between h-16 px-4 mx-auto sm:h-20 sm:px-6 lg:px-8 max-w-6xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center text-lg text-white shadow-lg w-9 h-9 sm:w-10 sm:h-10 sm:text-xl rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30">🎓</span>
            <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">AlumniApp</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <a href="#fitur" className="hidden px-3 py-2 text-sm font-medium text-gray-600 md:inline-block hover:text-gray-900">Fitur</a>
            <a href="#cara-kerja" className="hidden px-3 py-2 text-sm font-medium text-gray-600 md:inline-block hover:text-gray-900">Cara Kerja</a>
            <Link to="/login" className="px-3 py-2 text-sm font-semibold text-gray-700 sm:px-4 hover:text-gray-900">
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white transition-all bg-gray-900 rounded-full shadow-md sm:px-5 sm:py-2.5 hover:bg-gray-800 hover:-translate-y-0.5"
            >
              Daftar<span className="hidden sm:inline"> Sekarang</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* --- HERO --- */}
      <main className="relative z-10 px-4 pt-10 pb-16 mx-auto text-center sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-24 max-w-6xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium border rounded-full sm:mb-8 sm:text-sm text-emerald-700 bg-emerald-50 border-emerald-100">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 motion-safe:animate-ping bg-emerald-400"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
          </span>
          Portal Resmi Ikatan Alumni
        </div>

        <h1 className="max-w-4xl mx-auto mb-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:mb-6 sm:text-5xl lg:text-6xl">
          Jalin Kembali Koneksi,{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Bangun Masa Depan.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mb-8 text-base leading-relaxed text-gray-600 sm:mb-10 sm:text-lg">
          Wadah digital untuk terhubung kembali dengan teman seangkatan, menemukan peluang karir,
          dan berkontribusi bagi kemajuan almamater.
        </p>

        <div className="flex flex-col max-w-sm gap-3 mx-auto sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white transition-all shadow-lg sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Aktivasi Akun
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-gray-700 transition-all bg-white border border-gray-200 shadow-sm sm:px-8 sm:py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-300"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>

        <ul className="flex flex-wrap justify-center mt-6 text-sm text-gray-600 gap-x-5 gap-y-2 sm:mt-8">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>

        {/* --- DASHBOARD PREVIEW (ilustrasi) --- */}
        <div className="relative max-w-4xl mx-auto mt-12 sm:mt-16" aria-hidden="true">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20"></div>

          <div className="relative overflow-hidden text-left border shadow-2xl bg-white/90 backdrop-blur-xl border-white/60 rounded-2xl">
            <div className="flex items-center h-8 gap-1.5 px-4 border-b border-gray-200 bg-gray-100/70">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
            </div>

            <div className="flex gap-4 p-3 sm:p-5 bg-gray-50/60">
              {/* Sidebar */}
              <div className="flex-col hidden w-40 gap-2 p-3 text-xs font-medium text-white rounded-xl md:flex bg-gradient-to-br from-emerald-600 to-teal-700">
                <span className="mb-2 font-bold">🎓 AlumniApp</span>
                <span className="px-2 py-1.5 rounded-lg bg-white text-emerald-700">Dashboard</span>
                <span className="px-2 py-1.5">Tracer Study</span>
                <span className="px-2 py-1.5">Lowongan Kerja</span>
                <span className="px-2 py-1.5">Direktori Alumni</span>
              </div>

              {/* Main */}
              <div className="flex flex-col flex-1 min-w-0 gap-3 sm:gap-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {['Alumni Terdata', 'Lowongan Aktif', 'Partisipasi'].map((label) => (
                    <div key={label} className="p-2.5 bg-white border border-gray-100 shadow-sm sm:p-4 rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">{label}</p>
                      <div className="w-10 h-4 mt-2 rounded sm:w-16 sm:h-6 shimmer"></div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white border border-gray-100 shadow-sm sm:p-4 rounded-xl">
                  <p className="mb-3 text-xs font-semibold text-gray-500">Sebaran Karir Alumni</p>
                  <div className="flex items-end justify-around h-24 gap-2 sm:h-36">
                    {['animate-bar', 'animate-bar-delayed', 'animate-bar', 'animate-bar-delayed', 'animate-bar'].map((cls, i) => (
                      <div key={i} className={`w-5 sm:w-8 rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-400 ${cls}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FITUR --- */}
      <section id="fitur" className="relative z-10 py-16 bg-white border-t border-gray-100 scroll-mt-16 sm:py-20 lg:py-24 sm:scroll-mt-20">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mx-auto mb-10 text-center sm:mb-14">
            <p className="mb-2 text-sm font-semibold tracking-wide uppercase text-emerald-600">Fitur Unggulan</p>
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Semua kebutuhan alumni dalam satu tempat</h2>
            <p className="text-sm text-gray-500 sm:text-base">
              Dirancang untuk alumni dan universitas dalam satu ekosistem terintegrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {features.map(({ icon, color, title, desc }) => (
              <div key={title} className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-2xl sm:p-7 hover:shadow-xl hover:-translate-y-1">
                <div className={`flex items-center justify-center w-12 h-12 mb-5 transition-colors duration-300 rounded-xl group-hover:text-white ${color}`}>
                  {icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CARA KERJA --- */}
      <section id="cara-kerja" className="relative z-10 py-16 scroll-mt-16 sm:py-20 lg:py-24 sm:scroll-mt-20 bg-gray-50">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mx-auto mb-10 text-center sm:mb-14">
            <p className="mb-2 text-sm font-semibold tracking-wide uppercase text-emerald-600">Cara Kerja</p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Mulai dalam 3 langkah</h2>
          </div>

          <ol className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {steps.map(({ icon, title, desc }, i) => (
              <li key={title} className="relative flex gap-4 p-6 bg-white border border-gray-100 shadow-sm md:flex-col rounded-2xl sm:p-7">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-white shadow-md rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-600">Langkah {i + 1}</p>
                  <h3 className="mt-1 mb-1.5 text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8 sm:pb-20 lg:pb-24 bg-gray-50">
        <div className="relative max-w-6xl px-6 py-10 mx-auto overflow-hidden text-center text-white shadow-xl sm:px-12 sm:py-14 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800">
          <div className="absolute rounded-full -top-16 -right-16 w-60 h-60 bg-white/10 blur-2xl" aria-hidden="true"></div>
          <h2 className="relative mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">Siap terhubung kembali?</h2>
          <p className="relative max-w-xl mx-auto mb-8 text-sm sm:text-base text-emerald-50">
            Aktifkan akun Anda sekarang dan jadilah bagian dari jejaring alumni.
          </p>
          <Link
            to="/register"
            className="relative inline-flex items-center justify-center w-full px-8 py-3.5 font-bold transition-all bg-white shadow-lg sm:w-auto text-emerald-700 rounded-2xl hover:bg-emerald-50 hover:-translate-y-0.5"
          >
            Aktivasi Akun Sekarang
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-8 bg-white border-t border-gray-200 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-4 px-4 mx-auto text-center sm:px-6 lg:px-8 max-w-6xl md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-lg bg-emerald-600">🎓</span>
            <span className="font-bold text-gray-800">AlumniApp</span>
          </div>
          <p className="text-xs text-gray-500 sm:text-sm">
            &copy; {new Date().getFullYear()} Ilmu Komputer UNIMED. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm">
            <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Privacy</a>
            <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Terms</a>
            <a href="#" className="text-gray-400 transition-colors hover:text-emerald-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
