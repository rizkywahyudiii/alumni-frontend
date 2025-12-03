export default function DashboardPage() {
  // Ambil user buat sapaan
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {user.name || 'Alumni'}! 👋</h1>
        <p className="text-gray-500 mt-1">Selamat datang kembali di portal karir.</p>
      </div>

      {/* Contoh Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Status Karir</div>
          <div className="text-2xl font-bold text-gray-800 mt-2">Bekerja Full-time</div>
          <div className="mt-4 text-green-600 text-sm font-medium bg-green-50 inline-block px-2 py-1 rounded-lg">Update Terbaru</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Profil Lengkap</div>
          <div className="text-2xl font-bold text-gray-800 mt-2">80%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}