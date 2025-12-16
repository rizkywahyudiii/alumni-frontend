import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Briefcase, Mail } from "lucide-react"; 
import { Link } from 'react-router-dom';

const AlumniDirectoryPage = () => {
    const [alumniList, setAlumniList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Fungsi Fetch Data
    const fetchAlumni = async (query = '') => {
        setLoading(true);
        try {
            console.log("Fetching with Token:", localStorage.getItem('token')); // Debug Token

            const response = await api.get(`/v1/alumni/directory?q=${query}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Accept: 'application/json'
                }
            });
            
            // ... (logic data sama)
            let incomingData = [];
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                incomingData = response.data.data.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                incomingData = response.data.data;
            } else if (Array.isArray(response.data)) {
                incomingData = response.data;
            }
            setAlumniList(incomingData);

        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchAlumni();
    }, []);

    // Handle Search Submit
    const handleSearch = (e) => {
        e.preventDefault();
        fetchAlumni(searchTerm);
    };

    // Helper Avatar
    const getAvatarUrl = (path) => {
        // 1. Jika path kosong/null, kembalikan Default Avatar (Biar UI tetap rapi)
        // Kamu bisa ganti "&name=Alumni" jadi nama user kalau variabelnya tersedia
        if (!path) return `https://ui-avatars.com/api/?background=random&name=Alumni`;
        
        // 2. Jika path sudah lengkap (misal dari Google Login ada https), pakai langsung
        if (path.startsWith('http')) return path;

        // 3. Ambil URL server dari Env Vercel (INI PENTING BUAT DEPLOY)
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        // 4. Gabungkan: URL Server + /storage/ + nama file
        return `${baseUrl}/storage/${path}`;
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Header & Search */}
            <div className="flex flex-col items-end justify-between gap-4 mb-8 md:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">👥 Direktori Alumni</h1>
                    <p className="mt-1 text-gray-500">Cari teman seprodi atau bangun relasi profesional.</p>
                </div>
                
                <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
                    <input 
                        type="text" 
                        placeholder="Cari nama alumni..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>
            </div>

            {/* Grid Alumni */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 mx-auto mb-4 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {alumniList.length > 0 ? (
                        alumniList.map((alumni) => (
                            <div key={alumni.id} className="flex items-start gap-4 p-6 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                                
                                {/* Avatar */}
                                <Link to={`/directory/${alumni.id}`} className="flex-shrink-0">
                                    <img 
                                        src={getAvatarUrl(alumni.avatar)} 
                                        alt={alumni.name} 
                                        className="object-cover transition-opacity border-2 border-white rounded-full shadow-sm w-14 h-14 hover:opacity-80"
                                    />
                                </Link>
                                
                                <div className="flex-1 min-w-0">
                                    {/* Nama */}
                                    <h3 className="text-lg font-bold text-gray-900 truncate">
                                        <Link to={`/directory/${alumni.id}`} className="transition-colors hover:text-blue-600">
                                            {alumni.name}
                                        </Link>
                                    </h3>
                                    
                                    {/* ✅ Perbaikan Akses Angkatan (Langsung dari object alumni) */}
                                    <div className="mb-1 text-sm text-gray-500">
                                        Angkatan {alumni.angkatan || '-'}
                                    </div>

                                    {/* Data Pekerjaan (Tracer Study) */}
                                    {alumni.tracer_study ? (
                                        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mt-2">
                                            <Briefcase size={12} className="shrink-0" />
                                            <span className="truncate max-w-[150px]">
                                                {alumni.tracer_study.jabatan} di {alumni.tracer_study.nama_instansi}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-xs italic text-gray-400">Belum update karir</div>
                                    )}

                                    {/* Tombol Kontak */}
                                    {alumni.alumni_profile?.privacy_settings?.allow_contact && (
                                        <a 
                                            href={`mailto:${alumni.email}`} 
                                            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gray-600 transition-colors hover:text-blue-600"
                                        >
                                            <Mail size={14} />
                                            Hubungi
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500 border border-dashed rounded-lg col-span-full bg-gray-50">
                            Tidak ditemukan alumni dengan nama tersebut.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlumniDirectoryPage;