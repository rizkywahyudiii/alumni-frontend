import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Briefcase, Mail } from "lucide-react"; // Pastikan install lucide-react atau ganti icon SVG biasa
import { Link } from 'react-router-dom';

const AlumniDirectoryPage = () => {
    const [alumniList, setAlumniList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Debounce search (biar gak request tiap ketik 1 huruf)
    // Tapi untuk simpel, kita pakai enter atau button cari saja dulu.

    const token = localStorage.getItem('token');

    const fetchAlumni = async (query = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/alumni/directory?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Laravel pagination membungkus data dalam response.data.data.data (agak tricky)
            // Cek struktur response di console log kalau error
            setAlumniList(response.data.data.data || response.data.data); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAlumni(searchTerm);
    };

    // Helper Avatar
    const getAvatarUrl = (path) => {
        if (!path) return `https://ui-avatars.com/api/?background=random&name=Alumni`;
        return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header & Search */}
            <div className="flex flex-col items-end justify-between gap-4 mb-8 md:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">👥 Direktori Alumni</h1>
                    <p className="mt-1 text-gray-500">Cari teman seangkatan atau bangun relasi profesional.</p>
                </div>
                
                <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
                    <input 
                        type="text" 
                        placeholder="Cari nama alumni..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>
            </div>

            {/* Grid Alumni */}
            {loading ? (
                <div className="py-10 text-center">Memuat data...</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {alumniList.length > 0 ? (
                        alumniList.map((alumni) => (
                            <div key={alumni.id} className="flex items-start gap-4 p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                                
                                {/* Avatar (Sekarang jadi Link) */}
                                <Link to={`/directory/${alumni.id}`} className="flex-shrink-0">
                                    <img 
                                        src={getAvatarUrl(alumni.avatar)} 
                                        alt={alumni.name} 
                                        className="object-cover transition-opacity border-2 border-white rounded-full shadow-sm w-14 h-14 hover:opacity-80"
                                    />
                                </Link>
                                
                                <div className="flex-1 min-w-0">
                                    {/* Nama (Sekarang jadi Link) */}
                                    <h3 className="text-lg font-bold text-gray-900 truncate">
                                        <Link to={`/directory/${alumni.id}`} className="transition-colors hover:text-blue-600">
                                            {alumni.name}
                                        </Link>
                                    </h3>                                    
                                    <div className="mb-1 text-sm text-gray-500">
                                        Angkatan {alumni.tahun_lulus || '-'}
                                    </div>

                                    {/* Data Pekerjaan (Dari Tracer Study) */}
                                    {alumni.tracer_study ? (
                                        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mt-2">
                                            <Briefcase size={12} />
                                            <span className="truncate max-w-[150px]">
                                                {alumni.tracer_study.jabatan} di {alumni.tracer_study.nama_instansi}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-xs italic text-gray-400">Belum update karir</div>
                                    )}

                                    {/* Tombol Kontak (Cek Privacy settings allow_contact) */}
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