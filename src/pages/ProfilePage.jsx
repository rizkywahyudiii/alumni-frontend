import { useEffect, useState, useRef } from 'react';
import api from '../services/api'; // Pastikan path ini sesuai
import { Camera, Save, User, Lock, Shield, IdCard } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // State User (untuk tampilan statis di sidebar kiri)
  const [userDisplay, setUserDisplay] = useState(null);

  // State Form (untuk input data)
  const [formData, setFormData] = useState({
    // Data Akun (Table Users)
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',

    // Data Alumni (Table AlumniProfiles)
    phone: '',
    address: '',
    linkedin_url: '',
    gender: '',
    date_of_birth: '',
    privacy_settings: {
      show_in_directory: true,
      allow_contact: false,
      show_email: false
    }
  });

  // State Tab Aktif (Agar form tidak kepanjangan)
  const [activeTab, setActiveTab] = useState('biodata'); // biodata | account | privacy

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/v1/alumni/profile');
      const data = response.data.data;
      
      setUserDisplay(data);

      // Mapping data backend ke state form
      const profile = data.alumni_profile || {};
      const privacy = profile.privacy_settings || {};

      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        email: data.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        linkedin_url: profile.linkedin_url || '',
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
        privacy_settings: {
          show_in_directory: privacy.show_in_directory ?? true,
          allow_contact: privacy.allow_contact ?? false,
          show_email: privacy.show_email ?? false
        },
        // Reset password fields
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }));

    } catch (error) {
      console.error('Gagal ambil profil', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [name]: checked
      }
    }));
  };

  // Helper: Get Avatar URL
  const getAvatarUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
  };

  // 1. Handle Upload Avatar (Langsung Upload saat pilih file)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB!');
      return;
    }

    // Gunakan FormData untuk file
    const uploadData = new FormData();
    uploadData.append('avatar', file);
    
    // Backend kita butuh data lain agar tidak null? 
    // Tidak, karena di controller kita pakai $request->hasFile('avatar') terpisah.
    // Tapi karena method kita PUT, kita butuh trik untuk Laravel menangkap file:
    // Gunakan POST dengan _method: PUT
    uploadData.append('_method', 'PUT'); 
    
    // Kita kirim nama & email juga karena validasi 'required' di controller
    uploadData.append('name', formData.name);
    uploadData.append('email', formData.email);

    setIsUploading(true);
    try {
      const res = await api.post('/api/v1/alumni/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Foto profil berhasil diperbarui!');
      
      // Update display user
      setUserDisplay(res.data.data);
      
      // Update Navbar (LocalStorage)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...userData, avatar: res.data.data.avatar }));
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error(error);
      alert('Gagal upload: ' + (error.response?.data?.message || 'Error server'));
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Handle Submit Form Data (Text)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Bersihkan password jika kosong (agar tidak kena validasi backend)
      const payload = { ...formData };
      if (!payload.current_password) {
        delete payload.current_password;
        delete payload.new_password;
        delete payload.new_password_confirmation;
      }

      const res = await api.put('/api/v1/alumni/profile', payload);
      
      alert('Profil berhasil disimpan!');
      
      // Refresh data display
      setUserDisplay(res.data.data);
      
      // Update Navbar nama/email jika berubah
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...userData, name: res.data.data.name, email: res.data.data.email }));
      window.dispatchEvent(new Event("storage"));

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }));

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal menyimpan perubahan.';
      // Jika ada error spesifik (misal password salah)
      if (error.response?.data?.errors) {
         const firstErr = Object.values(error.response.data.errors)[0][0];
         alert(`${msg}: ${firstErr}`);
      } else {
         alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat profil...</div>;

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Pengaturan Profil</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        
        {/* === SIDEBAR KIRI: Avatar & Navigasi === */}
        <div className="space-y-6 md:col-span-4 lg:col-span-3">
            
            {/* Card Avatar */}
            <div className="flex flex-col items-center p-6 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="relative group">
                    <div className="w-32 h-32 mb-4 overflow-hidden bg-gray-100 border-4 border-white rounded-full shadow-md">
                        {getAvatarUrl(userDisplay?.avatar) ? (
                            <img src={getAvatarUrl(userDisplay?.avatar)} alt="Avatar" className="object-cover w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-gray-400 bg-gray-200">
                                {userDisplay?.name?.[0]}
                            </div>
                        )}
                    </div>
                    
                    {/* Tombol Upload Overlay */}
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute right-0 p-2 text-white transition-all bg-blue-600 rounded-full shadow-lg bottom-4 hover:bg-blue-700"
                        title="Ganti Foto"
                    >
                        {isUploading ? <span className="block w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></span> : <Camera size={18} />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-800">{userDisplay?.name}</h2>
                <p className="text-sm text-gray-500">{userDisplay?.email}</p>
                <div className="px-3 py-1 mt-3 text-xs font-semibold tracking-wide text-blue-700 uppercase rounded-full bg-blue-50">
                    {userDisplay?.role || 'Alumni'}
                </div>
            </div>

            {/* Navigasi Tab (Vertical) */}
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                <button 
                    onClick={() => setActiveTab('biodata')}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${activeTab === 'biodata' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <User size={18} />
                    <span className="font-medium">Biodata Diri</span>
                </button>
                <button 
                    onClick={() => setActiveTab('account')}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${activeTab === 'account' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Lock size={18} />
                    <span className="font-medium">Akun & Keamanan</span>
                </button>
                <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${activeTab === 'privacy' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Shield size={18} />
                    <span className="font-medium">Privasi</span>
                </button>
            </div>
        </div>

        {/* === KONTEN KANAN: Form Input === */}
        <div className="md:col-span-8 lg:col-span-9">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl md:p-8">
                <form onSubmit={handleSubmit}>
                    
                    {/* --- TAB 1: BIODATA --- */}
                    {activeTab === 'biodata' && (
                        <div className="space-y-8 animate-fade-in">
                            
                            {/* BAGIAN 1: DATA AKADEMIK (READ ONLY) */}
                            <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                                <h3 className="flex items-center gap-2 pb-3 mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase border-b border-gray-200">
                                    <Shield size={16} className="text-gray-500" /> 
                                    Data Akademik <span className="ml-auto text-xs font-normal text-gray-500 normal-case">(Read Only)</span>
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-500">NIM</label>
                                        <input 
                                            type="text" 
                                            value={userDisplay?.nim || '-'} // Ambil langsung dari userDisplay (Source of Truth)
                                            disabled 
                                            className="w-full px-4 py-2 font-mono font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-500">Angkatan</label>
                                        <input 
                                            type="text" 
                                            value={userDisplay?.angkatan || '-'} 
                                            disabled 
                                            className="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-500">Tahun Lulus</label>
                                        <input 
                                            type="text" 
                                            value={userDisplay?.tahun_lulus || 'Masih Kuliah'} 
                                            disabled 
                                            className="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" 
                                        />
                                    </div>
                                </div>
                                {/* Alert kecil info */}
                                <div className="flex items-start gap-2 p-3 mt-4 text-xs text-gray-500 bg-white border border-gray-200 rounded">
                                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>

                                  <p>
                                      Data akademik dikelola oleh Administrator. Jika terdapat kesalahan data (salah NIM/Tahun), silakan hubungi{" "}
                                      <a 
                                          href="#" 
                                          className="text-blue-600 underline hover:text-blue-800"
                                      >
                                          Admin
                                      </a>.
                                  </p>
                              </div>
                            </div>

                            {/* BAGIAN 2: DATA PRIBADI (EDITABLE) */}
                            <div>
                                <h3 className="flex items-center gap-2 pb-4 mb-4 text-lg font-bold text-gray-800 border-b">
                                    <IdCard size={20} className="text-blue-500" /> Informasi Pribadi
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">- Pilih -</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">No. Handphone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="08..." className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">LinkedIn URL</label>
                                        <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Alamat Domisili</label>
                                        <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: AKUN --- */}
                    {activeTab === 'account' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="flex items-center gap-2 pb-4 mb-4 text-lg font-bold text-gray-800 border-b">
                                <Lock size={20} className="text-blue-500" /> Akun & Keamanan
                            </h3>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div className="p-5 mt-6 border border-yellow-100 rounded-lg bg-yellow-50">
                                <h4 className="mb-3 text-sm font-bold text-yellow-800">Ganti Password (Opsional)</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Password Saat Ini</label>
                                        <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Isi jika ingin mengganti password" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700">Password Baru</label>
                                            <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Min. 8 karakter" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                            <input type="password" name="new_password_confirmation" value={formData.new_password_confirmation} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: PRIVASI --- */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="flex items-center gap-2 pb-4 mb-4 text-lg font-bold text-gray-800 border-b">
                                <Shield size={20} className="text-blue-500" /> Pengaturan Privasi
                            </h3>
                            
                            <div className="p-5 space-y-4 border border-gray-200 bg-gray-50 rounded-xl">
                                <label className="flex items-center gap-4 p-2 transition rounded cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" name="show_in_directory" checked={formData.privacy_settings.show_in_directory} onChange={handlePrivacyChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Tampilkan profil di Direktori Alumni</span>
                                        <span className="text-xs text-gray-500">Profil Anda bisa dicari oleh sesama alumni.</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-2 transition rounded cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" name="show_email" checked={formData.privacy_settings.show_email} onChange={handlePrivacyChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Tampilkan email ke publik</span>
                                        <span className="text-xs text-gray-500">Email Anda akan terlihat di halaman profil publik.</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-2 transition rounded cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" name="allow_contact" checked={formData.privacy_settings.allow_contact} onChange={handlePrivacyChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Buka kesempatan mentoring</span>
                                        <span className="text-xs text-gray-500">Izinkan adik tingkat menghubungi Anda untuk diskusi karir.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    <div className="flex justify-end gap-3 pt-6 mt-8 border-t">
                        <button 
                            type="button" 
                            onClick={() => window.location.reload()} // Reset simpel
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                        >
                            Reset
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex items-center gap-2 px-8 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Menyimpan...' : (
                                <>
                                    <Save size={18} />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </div>
    </div>
  );
}