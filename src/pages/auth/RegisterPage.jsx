import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, Calendar, CreditCard, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nim: '',
        date_of_birth: '' // Field Baru
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Setup Axios Instance
            const api = axios.create({
                baseURL: 'http://localhost:8000',
                withCredentials: true, // Wajib ON
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // 1. Ambil CSRF Cookie dulu
            await api.get('/sanctum/csrf-cookie');

            // 2. Tembak API Register (Perhatikan URL-nya ada /api)
            await api.post('/api/register', formData);
            
            // Sukses
            navigate('/register-success', { state: { email: formData.email } });

        } catch (error) {
            console.error("Debug Error:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                 setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: "Gagal terhubung ke server." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen py-12 font-sans bg-gray-50 sm:px-6 lg:px-8 animate-fade-in">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    Aktivasi Akun Alumni
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Verifikasi data Anda dengan database universitas
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white border border-gray-100 shadow sm:rounded-lg sm:px-10">
                    
                    {/* Error General (Gatekeeper Message) */}
                    {errors.general && (
                        <div className="px-4 py-3 mb-4 text-sm text-center text-red-600 border border-red-200 rounded-lg bg-red-50">
                            {errors.general}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* 1. NIM (Kunci Utama) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">NIM (Nomor Induk Mahasiswa)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="nim"
                                    required
                                    value={formData.nim}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Contoh: 4183311000"
                                />
                            </div>
                            {errors.nim && <p className="mt-1 text-xs text-red-600">{errors.nim[0]}</p>}
                        </div>

                        {/* 2. Tanggal Lahir (Kunci Rahasia) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Lahir (Verifikasi)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    required
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Digunakan untuk mencocokkan data Anda.</p>
                            {errors.date_of_birth && <p className="mt-1 text-xs text-red-600">{errors.date_of_birth[0]}</p>}
                        </div>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-gray-500 bg-white">Buat Kredensial Login</span>
                            </div>
                        </div>

                        {/* 3. Nama (Untuk Konfirmasi visual user, meski di backend ditimpa) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Nama sesuai ijazah"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                        </div>

                        {/* 4. Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Pribadi (Aktif)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="nama@gmail.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                        </div>

                        {/* 5. Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Minimal 8 karakter"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                        </div>

                        {/* 6. Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Ulangi password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Memverifikasi Data...
                                    </>
                                ) : (
                                    'Aktivasi Akun Saya'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-gray-500 bg-white">Sudah punya akun?</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-6">
                            <Link
                                to="/login"
                                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                                Masuk Disini
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}