import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JobDetailPage = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/alumni/jobs/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                });
                setJob(response.data.data);
            } catch (error) {
                console.error("Job not found", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    // --- LOGIKA PINTAR TOMBOL LAMAR ---
    const getApplyLink = (text) => {
        if (!text) return '#';
        
        // 1. Jika mendeteksi karakter '@' DAN tidak ada http, anggap ini EMAIL murni
        if (text.includes('@') && !text.includes('http')) {
            return `mailto:${text}`;
        }
        
        // 2. Jika mendeteksi 'http', anggap ini URL LENGKAP
        if (text.startsWith('http')) {
            return text;
        }
        
        // 3. Jika user lupa nulis 'https://' (misal cuma 'www.google.com')
        return `https://${text}`;
    };
    
    // Helper untuk cek apakah ini email (buat ganti teks tombol)
    const isEmail = (text) => {
        return text && text.includes('@') && !text.includes('http');
    };
    // ----------------------------------

    const handleDelete = async () => {
        if (!window.confirm("Yakin ingin menghapus lowongan ini?")) return;

        try {
            await axios.delete(`http://localhost:8000/api/v1/alumni/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
            });
            alert("Lowongan berhasil dihapus");
            navigate('/jobs');
        } catch (error) {
            alert("Gagal menghapus lowongan");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading detail...</div>;
    if (!job) return <div className="p-8 text-center text-red-500">Lowongan tidak ditemukan.</div>;

    // Cek apakah user yang login adalah pemilik postingan
    const isOwner = currentUser.id === job.user_id;

    return (
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
            {/* Kolom Kiri: Konten Utama */}
            <div className="space-y-6 md:col-span-2">
                <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <h1 className="mb-2 text-3xl font-bold text-gray-800">{job.title}</h1>
                    <div className="mb-4 text-xl font-medium text-gray-600">{job.company}</div>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1 text-sm font-semibold text-blue-700 rounded-full bg-blue-50">{job.job_type}</span>
                        <span className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                            📍 {job.location}
                        </span>
                    </div>

                    <h3 className="pb-2 mb-3 text-lg font-bold text-gray-800 border-b">Deskripsi Pekerjaan</h3>
                    {/* whitespace-pre-line agar enter/paragraf dari textarea terbaca */}
                    <div className="prose text-gray-600 whitespace-pre-line max-w-none">
                        {job.description}
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Sidebar Info */}
            <div className="space-y-6">
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <h3 className="mb-4 font-bold text-gray-800">Informasi Tambahan</h3>
                    
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-500">Gaji</p>
                            <p className="font-semibold text-gray-800">{job.salary_range ? `Rp ${job.salary_range}` : 'Disembunyikan'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Diposting Oleh</p>
                            <p className="font-semibold text-gray-800">{job.user?.name || 'Alumni'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Batas Lamaran</p>
                            <p className="font-semibold text-red-600">
                                {job.closing_date ? new Date(job.closing_date).toLocaleDateString('id-ID') : 'Secepatnya'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {/* --- TOMBOL PINTAR --- */}
                        {job.application_url ? (
                            <a 
                                href={getApplyLink(job.application_url)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="block w-full py-3 font-bold text-center text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
                            >
                                {/* Ubah teks tombol sesuai jenis input */}
                                {isEmail(job.application_url) ? 'Kirim Lamaran via Email 📧' : 'Lamar via Website ↗'}
                            </a>
                        ) : (
                            <button disabled className="block w-full py-3 font-bold text-center text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed">
                                Info via Email (TBA)
                            </button>
                        )}
                        
                        <Link to="/jobs" className="block w-full py-2 text-center text-gray-500 hover:text-gray-800">
                            &larr; Kembali ke List
                        </Link>
                    </div>
                </div>

                {/* Tombol Hapus (Khusus Owner) */}
                {isOwner && (
                    <div className="p-4 border border-red-100 bg-red-50 rounded-xl animate-fade-in">
                        <p className="mb-2 text-xs font-semibold text-red-600">Area Pemilik Postingan</p>
                        <button 
                            onClick={handleDelete} 
                            className="flex items-center justify-center w-full gap-2 py-2 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded hover:bg-red-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Hapus Lowongan Ini
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetailPage;