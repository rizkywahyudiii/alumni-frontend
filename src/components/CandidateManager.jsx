import { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Download, Search, FileSpreadsheet, AlertCircle } from 'lucide-react';

export default function CandidateManager() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [search, setSearch] = useState('');
    
    // Auth Header Manual
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch Data
    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/v1/alumni/admin/candidates?q=${search}`, { headers });
            setCandidates(res.data.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [search]);

    // Handle Download Template
    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/v1/alumni/admin/candidates/template', {
                headers,
                responseType: 'blob', // Penting untuk download file
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_alumni.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert("Gagal download template");
        }
    };

    // Handle Import
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        try {
            await api.post('/v1/alumni/admin/candidates/import', formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            alert('Import Berhasil!');
            fetchCandidates(); // Refresh table
        } catch (error) {
            alert('Gagal import: ' + (error.response?.data?.message || error.message));
        } finally {
            setImporting(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border border-gray-100 shadow-sm md:flex-row rounded-xl">
                
                {/* Kiri: Download & Import */}
                <div className="flex gap-3">
                    <button 
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                    >
                        <Download size={18} /> Template CSV
                    </button>
                    
                    <label className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-all ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {importing ? <span className="animate-spin">⌛</span> : <Upload size={18} />}
                        {importing ? 'Mengimport...' : 'Import Data Excel/CSV'}
                        <input type="file" className="hidden" accept=".csv, .xlsx" onChange={handleFileUpload} disabled={importing} />
                    </label>
                </div>

                {/* Kanan: Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari NIM / Nama..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Penting:</p>
                    <ul className="mt-1 ml-4 space-y-1 list-disc">
                        <li>Data ini digunakan untuk validasi saat Alumni mendaftar.</li>
                        <li>Pastikan format tanggal di Excel adalah <strong>YYYY-MM-DD</strong>.</li>
                        <li>NIM harus unik. Jika NIM sudah ada, data akan diupdate.</li>
                    </ul>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white border shadow-sm rounded-xl">
                <table className="w-full text-sm text-left">
                    <thead className="font-semibold text-gray-700 border-b bg-gray-50">
                        <tr>
                            <th className="px-6 py-4">NIM</th>
                            <th className="px-6 py-4">Nama Lengkap</th>
                            <th className="px-6 py-4">Prodi</th>
                            <th className="px-6 py-4">Angkatan</th>
                            <th className="px-6 py-4">Tgl Lahir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : candidates.length > 0 ? (
                            candidates.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.nim}</td>
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{item.prodi}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold bg-gray-100 rounded">{item.angkatan}</span></td>
                                    <td className="px-6 py-4 text-gray-500">{item.date_of_birth}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data candidate. Silakan import.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}