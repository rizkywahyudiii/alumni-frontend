import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobsPage = () => {
    // --- STATE ---
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [onlyMyJobs, setOnlyMyJobs] = useState(false);

    // Data User Login
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Config Axios
    const axiosConfig = {
        headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    };

    // 1. Fetch Data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/alumni/jobs', axiosConfig);
                setJobs(response.data.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // --- LOGIC FILTERING (Client Side) ---
    const filteredJobs = jobs.filter(job => {
        // 1. Filter Search (Judul atau Perusahaan)
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filter Tipe Pekerjaan
        const matchType = filterType ? job.job_type === filterType : true;

        // 3. Filter "Punya Saya"
        const matchOwner = onlyMyJobs ? job.user_id === currentUser.id : true;

        return matchSearch && matchType && matchOwner;
    });

    // Helpers
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatIDR = (value) => {
        if (!value || isNaN(value)) return value; 
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">💼 Lowongan Kerja Alumni</h1>
                    <p className="mt-1 text-gray-500">Temukan peluang karir atau bagikan info loker.</p>
                </div>
                <Link to="/jobs/create" className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all">
                    <span>+</span> Pasang Lowongan
                </Link>
            </div>

            {/* --- SEARCH & FILTER BAR --- */}
            <div className="p-4 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-12">
                    
                    {/* Search Input */}
                    <div className="relative md:col-span-5">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari posisi atau perusahaan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Type Dropdown */}
                    <div className="md:col-span-3">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    {/* Filter "Hanya Punya Saya" */}
                    <div className="flex items-center space-x-2 md:col-span-4">
                        <input 
                            type="checkbox" 
                            id="myJobs"
                            checked={onlyMyJobs}
                            onChange={(e) => setOnlyMyJobs(e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                        />
                        <label htmlFor="myJobs" className="font-medium text-gray-700 cursor-pointer select-none">
                            Hanya Postingan Saya
                        </label>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && <div className="py-10 text-center text-gray-500">Memuat lowongan...</div>}

            {/* Empty State (Jika filter tidak menemukan hasil) */}
            {!loading && filteredJobs.length === 0 && (
                <div className="py-16 text-center bg-white border border-gray-300 border-dashed rounded-xl">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ditemukan</h3>
                    <p className="mt-1 text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
                </div>
            )}

            {/* Job Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => {
                    // Cek apakah ini punya user yang login
                    const isMyJob = job.user_id === currentUser.id;

                    return (
                        <div key={job.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md border p-6 flex flex-col h-full transition-all ${isMyJob ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'}`}>
                            
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 transition-colors line-clamp-1 hover:text-blue-600">
                                        <Link to={`/jobs/${job.id}`}> 
                                            {job.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600">{job.company}</p>
                                </div>
                                
                                {/* BADGE TIPE JOB */}
                                <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded">
                                    {job.job_type}
                                </span>
                            </div>

                            {/* --- BADGE PUNYA SAYA --- */}
                            {isMyJob && (
                                <div className="mb-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        <svg className="mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                                        Postingan Anda
                                    </span>
                                </div>
                            )}

                            <div className="mb-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                                    {job.location}
                                </div>
                                {job.salary_range && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {formatIDR(job.salary_range)}
                                    </div>
                                )}
                            </div>

                            <p className="flex-grow mb-6 text-sm text-gray-500 line-clamp-3">{job.description}</p>

                            <div className="flex items-center justify-between pt-4 mt-auto text-xs text-gray-400 border-t border-gray-100">
                                <span>{isMyJob ? 'Oleh: Anda' : `Oleh: ${job.user?.name}`}</span>
                                <span>{formatDate(job.created_at)}</span>
                            </div>
                            
                            <Link to={`/jobs/${job.id}`} className="block w-full py-2 mt-4 font-semibold text-center text-blue-600 transition-colors border border-gray-200 rounded bg-gray-50 hover:bg-gray-100">
                                Lihat Detail
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobsPage;