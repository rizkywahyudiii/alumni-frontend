import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from "lucide-react"; // Pastikan install lucide-react

export default function Toast({ message, type = 'success', onClose, duration = 2000 }) {
  
  useEffect(() => {
    // Timer untuk auto-close
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Bersihkan timer jika komponen di-unmount sebelum waktu habis
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Styling berdasarkan Tipe
  const styles = type === 'success' 
    ? "bg-emerald-600 text-white border-emerald-700"
    : "bg-red-600 text-white border-red-700";

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed z-50 top-24 right-4 animate-fade-in-left">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${styles} min-w-[300px]`}>
        
        {/* Icon Status */}
        <Icon size={20} className="text-white/90" />
        
        {/* Pesan */}
        <p className="flex-1 text-sm font-medium">{message}</p>
        
        {/* Tombol Close Manual (X kecil) */}
        <button onClick={onClose} className="transition-colors text-white/70 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}