import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, ArrowLeft, Building } from "lucide-react";

const AlumniDetailPage = () => {
    const { id } = useParams();
    const [alumni, setAlumni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/alumni/directory/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlumni(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Gagal memuat profil.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, token]);

    // Helper Avatar
    const getAvatarUrl = (path) => {
        if (!path) return `https://ui-avatars.com/api/?background=random&name=${alumni?.name || 'User'}`;
        return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
    };

    if (loading) return <div className="p-10 text-center">Memuat profil...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!alumni) return null;

    // Shortcut untuk privacy settings
    const privacy = alumni.alumni_profile?.privacy_settings || {};
    const profile = alumni.alumni_profile || {};
    const job = alumni.tracer_study || {};

    return (
        <div className="max-w-5xl px-4 py-8 mx-auto">
            {/* Tombol Kembali */}
            <Link to="/directory" className="inline-flex items-center mb-6 text-gray-500 transition-colors hover:text-blue-600">
                <ArrowLeft size={18} className="mr-2" /> Kembali ke Direktori
            </Link>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                
                {/* === KOLOM KIRI: Sidebar Info === */}
                <div className="space-y-6 md:col-span-1">
                    
                    {/* Card Profil Utama */}
                    <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden border-4 rounded-full shadow-sm border-gray-50">
                            <img src={getAvatarUrl(alumni.avatar)} alt={alumni.name} className="object-cover w-full h-full" />
                        </div>
                        <h1 className="mb-1 text-xl font-bold text-gray-800">{alumni.name}</h1>
                        <p className="mb-4 text-sm text-gray-500">{alumni.email}</p> {/* Email user login tetap bisa lihat email dasar (biasanya) */}
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <span className="px-3 py-1 text-xs font-semibold text-blue-700 rounded-full bg-blue-50">
                                Angkatan: {alumni.angkatan || '-'}
                            </span>

                            <span className="px-3 py-1 text-xs font-semibold text-green-700 rounded-full bg-green-50">
                                Status: {alumni.tahun_lulus ? `Sudah Lulus (${alumni.tahun_lulus})` : 'Ongoing'}
                            </span>
                        </div>

                        {/* Tombol Kontak (Cek Privacy) */}
                        {privacy.allow_contact && (
                            <a href={`mailto:${alumni.email}`} className="block w-full py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                                Hubungi Alumni
                            </a>
                        )}
                    </div>

                    {/* Card Kontak (Cek Privacy untuk tiap item) */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <h3 className="pb-2 mb-4 font-bold text-gray-800 border-b">Informasi Kontak</h3>
                        <div className="space-y-4">
                            
                            {/* Email Publik */}
                            {privacy.show_email && (
                                <div className="flex items-start gap-3 text-sm">
                                    <Mail size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs text-gray-500">Email</span>
                                        <a href={`mailto:${alumni.email}`} className="text-blue-600 break-all hover:underline">{alumni.email}</a>
                                    </div>
                                </div>
                            )}

                            {/* No HP (Asumsi public jika diisi) */}
                            {profile.phone ? (
                                <div className="flex items-start gap-3 text-sm">
                                    <Phone size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs text-gray-500">WhatsApp / HP</span>
                                        <span className="text-gray-800">{profile.phone}</span>
                                    </div>
                                </div>
                            ) : null}

                            {/* LinkedIn */}
                            {profile.linkedin_url ? (
                                <div className="flex items-start gap-3 text-sm">
                                    <Linkedin size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs text-gray-500">LinkedIn</span>
                                        <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Kunjungi Profil</a>
                                    </div>
                                </div>
                            ) : null}

                            {/* Domisili */}
                            {profile.address && (
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="block text-xs text-gray-500">Domisili</span>
                                        <span className="text-gray-800">{profile.address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* === KOLOM KANAN: Detail Karir & Akademik === */}
                <div className="space-y-6 md:col-span-2">
                    
                    {/* Section Pekerjaan Saat Ini */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800">
                            <Briefcase className="text-blue-500" size={20} /> Karir & Pekerjaan
                        </h2>
                        
                        {job.status_pekerjaan ? (
                            <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{job.jabatan || 'Posisi tidak disebutkan'}</h3>
                                            <p className="font-medium text-gray-600">{job.nama_instansi || 'Nama Perusahaan tidak disebutkan'}</p>
                                        </div>
                                        <span className="px-3 py-1 mt-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full md:mt-0">
                                            {job.status_pekerjaan}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                        {job.jenis_instansi && <span>🏢 {job.jenis_instansi}</span>}
                                        {/* Gaji tidak ditampilkan karena sensitif */}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm italic text-gray-500">Belum ada data pekerjaan terbaru.</div>
                        )}
                    </div>

                    {/* --- SECTION RIWAYAT MAGANG (FORMAT BULAN TAHUN) --- */}
                    <div className="p-6 mt-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800">
                            <Building className="text-blue-500" size={20} /> Riwayat Magang
                        </h2>

                        {alumni.internships && alumni.internships.length > 0 ? (
                            <div className="space-y-4">
                                {alumni.internships.map((intern, index) => {
                                    
                                    // Helper Format Tanggal: "Jan 2024"
                                    const formatDate = (dateString) => {
                                        if (!dateString) return 'Sekarang';
                                        return new Date(dateString).toLocaleDateString('id-ID', { 
                                            month: 'short', // 'short' = Jan, 'long' = Januari
                                            year: 'numeric' 
                                        });
                                    };

                                    return (
                                        <div key={index} className="p-4 transition-colors border border-gray-200 rounded-lg bg-gray-50 hover:bg-blue-50/30">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{intern.title}</h3>
                                                    <p className="text-sm font-medium text-gray-700">{intern.company_name}</p>
                                                </div>
                                                
                                                {/* Format Tanggal: Jan 2025 - Mar 2025 */}
                                                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-white border rounded-md shadow-sm whitespace-nowrap">
                                                    {formatDate(intern.start_date)} - {formatDate(intern.end_date)}
                                                </div>
                                            </div>
                                            
                                            {intern.description && (
                                                <p className="pt-2 mt-2 text-sm leading-relaxed text-gray-600 border-t border-gray-200 border-dashed">
                                                    {intern.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-6 text-center border border-gray-300 border-dashed rounded-lg bg-gray-50">
                                <p className="text-sm italic text-gray-400">Belum ada riwayat magang yang ditambahkan.</p>
                            </div>
                        )}
                    </div>

                    {/* Section Data Akademik */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800">
                            <GraduationCap className="text-blue-500" size={20} /> Data Akademik
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs tracking-wide text-gray-500 uppercase">NIM</p>
                                <p className="font-mono font-medium text-gray-800">{alumni.nim || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs tracking-wide text-gray-500 uppercase">Program Studi</p>
                                <p className="font-medium text-gray-800">Teknik Informatika</p> {/* Hardcoded atau ambil dari DB */}
                            </div>
                            <div>
                                <p className="text-xs tracking-wide text-gray-500 uppercase">Tahun Masuk</p>
                                <p className="font-medium text-gray-800">{alumni.angkatan || '-'}</p>
                            </div>
                             <div>
                                <p className="text-xs tracking-wide text-gray-500 uppercase">Judul Skripsi</p>
                                <p className="mt-1 text-sm italic text-gray-800">
                                    {/* Jika nanti ada kolom judul skripsi di tracer study/user */}
                                    "Analisis Data Mining..." (Data dummy)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section Skills (Optional, kalau ada relasi skills) */}
                    {alumni.skills && alumni.skills.length > 0 && (
                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <h2 className="mb-4 text-lg font-bold text-gray-800">Keahlian & Skill</h2>
                            <div className="flex flex-wrap gap-2">
                                {alumni.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AlumniDetailPage;