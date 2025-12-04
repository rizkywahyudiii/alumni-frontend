import { useEffect } from 'react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  variant = 'primary', // 'primary' (Save/Add) atau 'danger' (Delete/Logout)
  isLoading = false 
}) {
  
  // Mencegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // --- LOGIKA WARNA TOMBOL SESUAI REQUEST ---
  // Warna Solid Navigation (Emerald-600)
  const solidClass = "bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent shadow-md";
  const outlineClass = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
  const dangerOutlineClass = "bg-white text-red-600 border border-red-200 hover:bg-red-50";

  let confirmBtnClass = "";
  let cancelBtnClass = "";
  let iconColor = "";

  if (variant === 'danger') {
    // KONDISI BAHAYA (Logout/Hapus):
    // Tombol True (Confirm) -> Outline (Merah/Danger)
    // Tombol Batal -> Solid (Emerald - biar user cenderung klik ini kalau ragu)
    confirmBtnClass = dangerOutlineClass;
    cancelBtnClass = solidClass;
    iconColor = "text-red-100 bg-red-600";
  } else {
    // KONDISI BIASA (Simpan/Update):
    // Tombol True -> Solid (Emerald)
    // Tombol Batal -> Outline
    confirmBtnClass = solidClass;
    cancelBtnClass = outlineClass;
    iconColor = "text-emerald-100 bg-emerald-600";
  }

  return (
    // 1. Overlay Blur & Gelap
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      
      {/* 2. Kotak Modal Rounded */}
      <div className="w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-2xl animate-scale-up">
        
        <div className="p-6 text-center">
          {/* Icon Header */}
          <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {variant === 'danger' ? (
               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
               <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-800">
            {title}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            {/* Tombol Batal (Urutan kiri) */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex-1 ${cancelBtnClass}`}
            >
              Batal
            </button>

            {/* Tombol Confirm (Urutan kanan) */}
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex-1 flex justify-center items-center gap-2 ${confirmBtnClass}`}
            >
              {isLoading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {variant === 'danger' ? 'Ya, Lanjutkan' : 'Konfirmasi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}