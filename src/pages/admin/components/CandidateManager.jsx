import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Download, Search, AlertCircle, FileSpreadsheet, Trash2, RefreshCw } from 'lucide-react';

export default function CandidateManager() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    
    const token = localStorage.getItem('token');

    // --- 1. FETCH DATA ---
    const fetchCandidates = async (pageNo = 1, query = '') => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/alumni/admin/candidates?page=${pageNo}&q=${query}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setCandidates(res.data.data.data || []);
            setPagination(res.data.data);
            setPage(pageNo);
        } catch (error) {
            console.error("Gagal ambil data", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => { fetchCandidates(1, search); }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // --- 2. DOWNLOAD TEMPLATE ---
    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/alumni/admin/candidates/template', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Wajib blob untuk file binary
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_master_alumni.xlsx'); // Ekstensi .xlsx
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Gagal download template. Pastikan server berjalan.");
        }
    };

    // --- 3. IMPORT EXCEL ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Konfirmasi User
        if (!window.confirm(`Anda akan mengimport file "${file.name}".\nData dengan NIM yang sama akan diperbarui. Lanjutkan?`)) {
            e.target.value = null;
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        try {
            const res = await axios.post('http://localhost:8000/api/v1/alumni/admin/candidates/import', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            alert(res.data.message || 'Data berhasil diimport!');
            fetchCandidates(1, search); // Reset ke halaman 1
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message;
            alert('Gagal Import: ' + msg);
        } finally {
            setImporting(false);
            e.target.value = null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* --- TOP SECTION: ACTION BAR --- */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    
                    {/* Tombol Import/Export */}
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={handleDownloadTemplate}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                            title="Download format Excel untuk diisi"
                        >
                            <Download size={18} /> Download Template .xlsx
                        </button>
                        
                        <label className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-all shadow-sm ${importing ? 'opacity-70 cursor-wait' : ''}`}>
                            {importing ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                            {importing ? 'Sedang Memproses...' : 'Upload Data Excel'}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".xlsx, .xls, .csv" 
                                onChange={handleFileUpload} 
                                disabled={importing} 
                            />
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute text-gray-400 left-3 top-3" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari NIM atau Nama..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Informasi Penting */}
                <div className="flex items-start gap-3 p-4 mt-6 border border-blue-100 rounded-lg bg-blue-50">
                    <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold">Panduan Data Master:</p>
                        <ul className="mt-1 ml-4 list-disc space-y-0.5 opacity-90">
                            <li>Gunakan tombol <b>Download Template</b> untuk mendapatkan format yang benar.</li>
                            <li>Kolom <b>Tanggal Lahir</b> di Excel sebaiknya berformat <i>Text (YYYY-MM-DD)</i> atau <i>Date</i>.</li>
                            <li>Data ini digunakan sistem untuk <b>memvalidasi Alumni/Mahasiswa Aktif</b> saat mereka mendaftar pertama kali.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: DATA TABLE --- */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">NIM</th>
                                <th className="px-6 py-4 whitespace-nowrap">Nama Lengkap</th>
                                <th className="px-6 py-4 whitespace-nowrap">Program Studi</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Angkatan</th>
                                <th className="px-6 py-4 whitespace-nowrap">Tgl Lahir (Verifikator)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCw className="text-blue-500 animate-spin" size={24}/>
                                            <span>Memuat data master...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : candidates.length > 0 ? (
                                candidates.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{item.nim}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700 uppercase">{item.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.prodi}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full border border-gray-200">
                                                {item.angkatan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            {item.date_of_birth}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-3 bg-gray-100 rounded-full">
                                                <FileSpreadsheet size={32} className="text-gray-300"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-600">Belum ada data Master Alumni</p>
                                                <p className="text-xs">Silakan upload data menggunakan template Excel.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-500">
                        Menampilkan Halaman <b>{pagination.current_page || 1}</b> dari <b>{pagination.last_page || 1}</b>
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={!pagination.prev_page_url} 
                            onClick={() => fetchCandidates(page - 1, search)} 
                            className="px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>
                        <button 
                            disabled={!pagination.next_page_url} 
                            onClick={() => fetchCandidates(page + 1, search)} 
                            className="px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}