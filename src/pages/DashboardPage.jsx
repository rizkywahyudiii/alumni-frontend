import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ExportButton from '../components/common/ExportButton';
// Import komponen Chart dari Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total_responden: 0,
        status_distribution: [],
        active_jobs: 0
    });
    const [hasTracerData, setHasTracerData] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    // ✅ Logic Baru: Cek apakah user adalah Alumni
    const isAlumni = user.role === 'alumni';

    // Warna untuk Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6b6b'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cek User sudah isi tracer belum (Hanya jika role == alumni)
                // Kita hindari request yang tidak perlu jika user bukan alumni
                if (isAlumni) {
                    try {
                        const tracerRes = await api.get('/v1/alumni/tracer-study/me', {
                            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                        });
                        // Jika ada data (tidak null), berarti sudah isi
                        if (tracerRes.data.data) setHasTracerData(true);
                    } catch (err) {
                        // Jika 404 not found, berarti belum isi (wajar)
                        // Jangan log error ke console agar bersih
                    }
                }

                // 2. Ambil Statistik Dashboard (Shared Data)
                const dashboardRes = await api.get('/v1/alumni/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                });
                setStats(dashboardRes.data.data);

            } catch (error) {
                console.log("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token, isAlumni]);

    // Cek Permission Admin
    const isAdmin = ['admin', 'super_admin'].includes(user.role);
    

    return (
        <div className="space-y-8 animate-fade-in">
             {/* Header Sapaan */}
             <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Statistik</h1>
                    <p className="mt-1 text-gray-500">Selamat datang, {user.name}!</p>
                    
                    {/* Badge Role (Opsional, agar user sadar login sebagai apa) */}
                    <span className="inline-block px-2 py-0.5 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100 uppercase tracking-wider">
                        {user.role}
                    </span>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0 md:flex-row md:items-center">
                    
                    {/* TOMBOL EXPORT (HANYA MUNCUL UNTUK ADMIN) */}
                    {isAdmin && (
                        <div className="mr-2">
                            <ExportButton />
                        </div>
                    )}

                    {/* --- LOGIC PERINGATAN TRACER STUDY --- */}
                    {/* Hanya muncul jika:
                        1. Tidak loading
                        2. User adalah ALUMNI (isAlumni == true)
                        3. Belum isi tracer study (hasTracerData == false)
                    */}
                    {!loading && isAlumni && !hasTracerData && (
                        <Link 
                            to="/tracer-study" 
                            className="flex items-center gap-2 px-4 py-3 mt-4 text-sm font-bold text-yellow-900 transition-all bg-yellow-400 shadow-lg rounded-xl shadow-yellow-400/20 md:mt-0 hover:bg-yellow-500 hover:-translate-y-1"
                        >
                            <span className="relative flex w-3 h-3">
                                <span className="absolute inline-flex w-full h-full bg-yellow-900 rounded-full opacity-75 animate-ping"></span>
                                <span className="relative inline-flex w-3 h-3 bg-yellow-900 rounded-full"></span>
                            </span>
                            ⚠️ Anda Belum Mengisi Tracer Study!
                        </Link>
                    )}
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Card 1 */}
                <div className="flex items-center p-6 space-x-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl group hover:shadow-md">
                    <div className="p-3 text-blue-600 transition-colors rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Alumni Terdata</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.total_responden}</h3>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="flex items-center p-6 space-x-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl group hover:shadow-md">
                    <div className="p-3 text-green-600 transition-colors rounded-full bg-green-50 group-hover:bg-green-600 group-hover:text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Lowongan Aktif</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.active_jobs}</h3>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="flex items-center p-6 space-x-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl group hover:shadow-md">
                    <div className="p-3 text-purple-600 transition-colors rounded-full bg-purple-50 group-hover:bg-purple-600 group-hover:text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Partisipasi</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                           {stats.total_responden > 0 ? 'High' : '-'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- CHARTS SECTION --- */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                
                {/* Chart 1 */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Sebaran Karir Alumni</h3>
                    <div className="h-64">
                        {stats.status_distribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.status_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="status_pekerjaan"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {stats.status_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                Belum ada data visualisasi
                            </div>
                        )}
                    </div>
                </div>

                {/* Chart 2 */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Statistik Jumlah per Status</h3>
                    <div className="h-64">
                         {stats.status_distribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.status_distribution}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="status_pekerjaan" tick={{fontSize: 12}} interval={0} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                Belum ada data visualisasi
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
}