import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        salary_range: '',
        application_url: '',
        closing_date: '',
        description: ''
    });

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/v1/alumni/jobs', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            navigate('/jobs');
        } catch (err) {
            console.error("Full Error:", err);
            
            // LOGIC MENANGKAP ERROR VALIDASI LARAVEL (Sama kayak Tracer Study)
            if (err.response && err.response.status === 422) {
                const errorData = err.response.data.errors;
                // Ambil pesan error pertama
                const firstError = Object.values(errorData)[0][0];
                setError(`Gagal: ${firstError}`);
            } else {
                setError(err.response?.data?.message || 'Gagal memposting lowongan.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl p-8 mx-auto bg-white border border-gray-100 shadow-sm rounded-xl">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">✍️ Pasang Lowongan Baru</h1>

            {error && (
                <div className="p-3 mb-6 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Judul & Perusahaan */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Posisi / Judul Pekerjaan</label>
                        <input type="text" name="title" required onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Senior React Developer" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Nama Perusahaan</label>
                        <input type="text" name="company" required onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: PT. Teknologi Maju" />
                    </div>
                </div>

                {/* Lokasi & Tipe */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Lokasi</label>
                        <input type="text" name="location" required onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jakarta / Remote / Bandung" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Tipe Pekerjaan</label>
                        <select name="job_type" onChange={handleChange} className="w-full p-2 bg-white border rounded outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>

                {/* Gaji & Link */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Kisaran Gaji (Opsional)</label>
                        <input type="text" name="salary_range" onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 8.000.000" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Link Lamaran / Email</label>
                        {/* Gunakan type="text" agar fleksibel */}
                        <input 
                            type="text" 
                            name="application_url" 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="hrd@company.com atau https://linkedin.com/..." 
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi Pekerjaan</label>
                    <textarea name="description" required rows="6" onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tuliskan kualifikasi, tanggung jawab, dan detail lainnya..."></textarea>
                </div>

                {/* Closing Date */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Batas Akhir Lamaran</label>
                    <input type="date" name="closing_date" onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={() => navigate('/jobs')} className="px-5 py-2 text-gray-600 rounded hover:bg-gray-100">Batal</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Memposting...' : 'Posting Lowongan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJobPage;