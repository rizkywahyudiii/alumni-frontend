import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const { id, hash } = useParams(); // Ambil ID dan Hash dari URL Path
    const [searchParams] = useSearchParams(); // Ambil query params (?expires=...&signature=...)
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Memverifikasi email Anda...');

    useEffect(() => {
        const verify = async () => {
            try {
                // Rakit URL Backend lengkap dengan query string signature
                const backendUrl = `http://localhost:8000/api/email/verify/${id}/${hash}?${searchParams.toString()}`;

                // Tembak API
                await axios.get(backendUrl);

                setStatus('success');
                setMessage('Email berhasil diverifikasi! Anda akan diarahkan dalam 3 detik...');
                
                // Redirect otomatis ke login/dashboard
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Link verifikasi kadaluarsa atau tidak valid.');
            }
        };

        // Jalankan verifikasi sekali saat komponen mount
        verify();
    }, [id, hash, searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-sans bg-gray-50">
            <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-xl rounded-2xl">
                
                {status === 'loading' && (
                    <>
                        <Loader2 size={48} className="mx-auto mb-4 animate-spin text-emerald-600" />
                        <h2 className="text-xl font-bold text-gray-800">Memproses...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-green-600 bg-green-100 rounded-full animate-fade-in">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Verifikasi Berhasil!</h2>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-red-600 bg-red-100 rounded-full animate-fade-in">
                            <XCircle size={40} />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Verifikasi Gagal</h2>
                    </>
                )}

                <p className="mt-2 mb-8 text-gray-600">{message}</p>

                {status === 'error' && (
                    <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
                        Kembali ke Login
                    </Link>
                )}
            </div>
        </div>
    );
}