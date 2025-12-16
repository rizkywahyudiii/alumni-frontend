import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Tambah useLocation
import api from '../../services/api'; // Tambah api
import { MailCheck, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

export default function RegisterSuccessPage() {
    const location = useLocation();
    // Ambil email dari State (Redirect) ATAU LocalStorage (User Session)
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};
    
    // Prioritas: State > User Login > Default String
    const email = location.state?.email || user.email;

    // State Timer (60 detik)
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Logic Hitung Mundur
    useEffect(() => {
        let interval = null;
        
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true); // Waktu habis, tombol aktif
        }

        return () => clearInterval(interval);
    }, [timer]);

    // Fungsi Kirim Ulang Email
    const handleResendEmail = async () => {
        // Safety check: Kalo email ga ada (karena refresh), ga bisa kirim
        if (!email) {
            setMessage("Email tidak terdeteksi. Silakan coba login ulang.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // 👇 PERBAIKAN: Tembak Route Public Baru
            // Kita kirim { email } di body
            await api.post('/resend-verification', 
                { email: email }, 
                {
                    // Kita tetap pasang ini jaga-jaga kalau config CORS butuh
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            setMessage('Email verifikasi baru telah dikirim!');
            setTimer(60); 
            setCanResend(false); 

        } catch (error) {
            console.error(error);
            // Pesan error lebih sopan
            setMessage('Gagal mengirim request. Silakan coba login manual.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-sans bg-gray-50 animate-fade-in">
            <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-xl rounded-2xl">
                
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 text-emerald-600">
                    <MailCheck size={40} strokeWidth={1.5} />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Registrasi Berhasil!
                </h2>

                <p className="mb-6 leading-relaxed text-gray-600">
                    NIM Anda terdaftar. Silakan cek inbox/spam email <span className="font-semibold text-gray-900">{email}</span> untuk verifikasi.
                </p>

                {/* Feedback Pesan Sukses Kirim Ulang */}
                {message && (
                    <div className="flex items-center justify-center gap-2 p-3 mb-4 text-sm text-green-700 rounded-lg bg-green-50 animate-fade-in">
                        <CheckCircle size={16} /> {message}
                    </div>
                )}

                {/* --- AREA TOMBOL RESEND --- */}
                <div className="mb-8">
                    <p className="mb-2 text-sm text-gray-500">Belum menerima email?</p>
                    <button
                        onClick={handleResendEmail}
                        disabled={!canResend || loading}
                        className={`flex items-center justify-center gap-2 mx-auto text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                            canResend && !loading
                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer' 
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                    >
                        {loading ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                        
                        {loading ? 'Mengirim...' : canResend ? 'Kirim Ulang Email' : `Kirim Ulang (${timer}s)`}
                    </button>
                </div>
                {/* ------------------------- */}

                <Link 
                    to="/login" 
                    className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-emerald-500/30"
                >
                    Kembali ke Halaman Login <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}