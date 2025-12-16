import React, { useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Panggil API Laravel
            await api.post('/forgot-password', { email });
            setMessage("Link reset password telah dikirim ke email Anda. Silakan cek Inbox/Spam.");
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan. Pastikan email terdaftar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 font-sans bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Lupa Password?</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Masukkan email yang terdaftar untuk menerima instruksi reset password.
                    </p>
                </div>

                {message ? (
                    <div className="text-center">
                        <div className="flex items-center gap-3 p-4 mb-6 text-left text-green-700 bg-green-50 rounded-xl">
                            <CheckCircle className="shrink-0" />
                            <p className="text-sm">{message}</p>
                        </div>
                        <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                            Kembali ke Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-center text-red-600 rounded-lg bg-red-50">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-emerald-500/30"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Kirim Link Reset'}
                        </button>

                        <Link 
                            to="/login" 
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-emerald-600"
                        >
                            <ArrowLeft size={16} /> Kembali ke Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}