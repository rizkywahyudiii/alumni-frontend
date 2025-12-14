import React, { useState } from 'react';
import axios from 'axios';
import { FileDown, Loader2 } from 'lucide-react'; // Pastikan install lucide-react

export default function ExportButton() {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Request ke Backend dengan responseType 'blob' (PENTING!)
            const response = await axios.get('http://localhost:8000/api/v1/alumni/admin/tracer-study/export', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Wajib ada agar file tidak rusak
            });

            // --- Logic Browser untuk Download File ---
            // 1. Buat URL objek dari blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // 2. Buat elemen <a> sementara
            const link = document.createElement('a');
            link.href = url;
            
            // 3. Set nama file (bisa hardcode atau ambil dari header response)
            link.setAttribute('download', `Laporan_Tracer_Study_${new Date().toISOString().slice(0,10)}.xlsx`);
            
            // 4. Tempel ke body, klik, lalu hapus
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Bersihkan memori

        } catch (error) {
            console.error("Gagal download laporan:", error);
            alert("Gagal mengunduh laporan. Pastikan Anda memiliki akses Admin/Kaprodi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sedang Mengunduh...
                </>
            ) : (
                <>
                    <FileDown className="w-5 h-5" />
                    Export Laporan Excel
                </>
            )}
        </button>
    );
}