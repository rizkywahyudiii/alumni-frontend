import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Panggil endpoint profile yang sudah kita buat di backend
        const response = await api.get('/api/v1/alumni/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Gagal ambil profil', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600">
             {user?.name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Data Akademik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">NIM</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.nim || '-'}</div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Angkatan</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.angkatan || '-'}</div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-500">Tahun Lulus</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.tahun_lulus || 'Belum Lulus'}</div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-500">No. HP</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.alumni_profile?.phone || '-'}</div>
            </div>
        </div>
      </div>
    </div>
  );
}