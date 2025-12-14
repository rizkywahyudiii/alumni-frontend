import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Ambil token & email dari URL
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Redirect jika tidak ada token (akses ilegal)
    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== passwordConfirmation) {
            setError("Password konfirmasi tidak cocok.");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                token,
                email: emailParam,
                password,
                password_confirmation: passwordConfirmation
            });
            setMessage("Password berhasil diubah! Mengalihkan ke halaman login...");
            
            // Redirect otomatis setelah 3 detik
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.email?.[0] || "Gagal reset password. Token mungkin sudah kadaluarsa.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 font-sans bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Set Password Baru</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Silakan masukkan password baru untuk akun {emailParam}
                    </p>
                </div>

                {message ? (
                    <div className="p-4 text-center text-green-700 bg-green-50 rounded-xl">
                        <CheckCircle className="mx-auto mb-2" />
                        <p>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-center text-red-600 rounded-lg bg-red-50">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Password Baru</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Minimal 8 karakter"
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <input
                                type="password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Ulangi password baru"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-emerald-500/30"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Simpan Password Baru'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}