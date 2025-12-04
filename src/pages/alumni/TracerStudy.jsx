import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan axios sudah terinstall
import Toast from '../../components/common/Toast';

const TracerStudy = () => {
    // State untuk form data
    const [formData, setFormData] = useState({
        tahun_lulus: '',
        status_pekerjaan: '',
        nama_instansi: '',
        jabatan: '',
        jenis_instansi: '',
        pendapatan: '',
        relevansi_studi: '3' // Default nilai tengah
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Ambil token dari localStorage (sesuaikan dengan cara kamu simpan token)
    const token = localStorage.getItem('token'); 

    // Config Axios Header
    const axiosConfig = {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    // 1. Fetch Data Saat Load (Cek kalau user sudah pernah isi)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Sesuaikan URL dengan route di api.php
                const response = await axios.get('http://localhost:8000/api/v1/alumni/tracer-study/me', axiosConfig);
                if (response.data.data) {
                    setFormData(response.data.data);
                }
            } catch (error) {
                console.log("Belum ada data tracer study, silakan isi.");
            }
        };
        fetchData();
    }, []);

    // 2. Handle Perubahan Input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Hapus setMessage(null) yang lama

        try {
            await axios.post('http://localhost:8000/api/v1/alumni/tracer-study', formData, axiosConfig);
            
            // 3. TAMPILKAN TOAST SUKSES
            setToast({ 
                show: true, 
                message: 'Data berhasil disimpan!', 
                type: 'success' 
            });

        } catch (error) {
            console.error(error);
            // TAMPILKAN TOAST ERROR
            setToast({ 
                show: true, 
                message: error.response?.data?.message || 'Gagal menyimpan data.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const showJobDetails = ['Bekerja', 'Wirausaha'].includes(formData.status_pekerjaan);
    
    // --- MULAI AREA TAMPILAN (UI) ---
    return (
        <div className="max-w-4xl mx-auto">

            {/* PASANG KOMPONEN TOAST DI SINI (Paling Atas) */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            {/* 1. Header Halaman */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">📝 Tracer Study Alumni</h1>
                <p className="mt-1 text-gray-500">Lengkapi data karir Anda untuk kemajuan almamater kita.</p>
            </div>

            {/* 2. INFO BLOCK BARU (PENJELASAN) */}
            <div className="p-5 mb-8 border-l-4 border-blue-500 rounded-r-lg shadow-sm bg-blue-50">
                <div className="flex">
                    <div className="flex-shrink-0">
                        {/* Icon Info Biru */}
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-bold text-blue-800 text-md">Mengapa data ini penting?</h3>
                        <div className="mt-2 space-y-2 text-sm text-blue-700">
                            <p>
                                Data yang Anda isikan sangat berharga bagi Universitas untuk:
                            </p>
                            <ul className="pl-5 space-y-1 list-disc">
                                <li>Meningkatkan <b>nilai Akreditasi</b> kampus & program studi.</li>
                                <li>Mengevaluasi kurikulum agar lulusan lebih <b>siap kerja</b>.</li>
                                <li>Membangun jejaring alumni yang kuat.</li>
                            </ul>
                            <p className="mt-2 text-xs italic font-semibold text-blue-600">
                                *Data privasi (Gaji/Pendapatan) bersifat rahasia dan hanya digunakan untuk rekapitulasi statistik (rata-rata).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Form Input */}
            <div className="p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Baris 1: Tahun & Status */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Tahun Lulus</label>
                            <input 
                                type="number" 
                                name="tahun_lulus"
                                value={formData.tahun_lulus}
                                onChange={handleChange}
                                required
                                min="2000"
                                className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Contoh: 2023"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Status Saat Ini</label>
                            <div className="relative">
                                <select 
                                    name="status_pekerjaan" 
                                    value={formData.status_pekerjaan}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Pilih Status --</option>
                                    <option value="Bekerja">🏢 Bekerja (Full Time/Part Time)</option>
                                    <option value="Wirausaha">🏪 Wirausaha</option>
                                    <option value="Lanjut Studi">🎓 Lanjut Studi</option>
                                    <option value="Mencari Kerja">🔍 Sedang Mencari Kerja</option>
                                    <option value="Tidak Bekerja">🏠 Belum Memungkinkan Bekerja</option>
                                </select>
                                {/* Custom Arrow Icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering: Form Detail Pekerjaan */}
                    {showJobDetails && (
                        <div className="p-6 space-y-5 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in-down">
                            <h3 className="flex items-center gap-2 pb-2 font-bold text-gray-800 border-b">
                                💼 Detail Pekerjaan / Usaha
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Nama Instansi / Perusahaan</label>
                                    <input 
                                        type="text" 
                                        name="nama_instansi" 
                                        value={formData.nama_instansi || ''} 
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500" 
                                        placeholder="PT. Mencari Cinta Sejati"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Posisi / Jabatan</label>
                                    <input 
                                        type="text" 
                                        name="jabatan" 
                                        value={formData.jabatan || ''} 
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500" 
                                        placeholder="Staff IT / Founder"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Jenis Instansi</label>
                                    <select 
                                        name="jenis_instansi" 
                                        value={formData.jenis_instansi || ''} 
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">- Pilih -</option>
                                        <option value="Pemerintah">Pemerintah / BUMN</option>
                                        <option value="Swasta">Swasta</option>
                                        <option value="Wirausaha">Milik Sendiri</option>
                                        <option value="Multinational">Multinational</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm text-gray-600">Pendapatan Bulanan (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">Rp</span>
                                        <input 
                                            type="number" 
                                            name="pendapatan" 
                                            value={formData.pendapatan || ''} 
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500" 
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">*Hanya angka, tanpa titik/koma</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block mb-2 text-sm text-gray-600">Seberapa erat hubungan studi dengan pekerjaan Anda?</label>
                                <div className="flex items-center p-3 space-x-4 bg-white border border-gray-200 rounded">
                                    <span className="text-xs font-medium text-gray-500">Sangat Tidak Erat</span>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="5" 
                                        name="relevansi_studi"
                                        value={formData.relevansi_studi || 3}
                                        onChange={handleChange}
                                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <span className="text-xs font-medium text-gray-500">Sangat Erat</span>
                                </div>
                                <div className="mt-2 text-sm font-bold text-center text-blue-600">
                                    Skala Pilihan: {formData.relevansi_studi} / 5
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                '💾 Simpan Data Tracer Study'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TracerStudy;