import { useEffect, useState, useRef } from 'react'; // Import disatukan
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // State loading khusus upload
  const fileInputRef = useRef(null); // Ref untuk input file tersembunyi
  
  // State untuk Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Lengkap
  const [formData, setFormData] = useState({
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

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/v1/alumni/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Gagal ambil profil', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    const profile = user?.alumni_profile || {};
    const privacy = profile.privacy_settings || {};

    setFormData({
      phone: profile.phone || '',
      address: profile.address || '',
      linkedin_url: profile.linkedin_url || '',
      gender: profile.gender || '', 
      date_of_birth: profile.date_of_birth || '', 
      privacy_settings: {
        show_in_directory: privacy.show_in_directory ?? true,
        allow_contact: privacy.allow_contact ?? false,
        show_email: privacy.show_email ?? false
      }
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrivacyChange = (e) => {
    setFormData({
      ...formData,
      privacy_settings: {
        ...formData.privacy_settings,
        [e.target.name]: e.target.checked
      }
    });
  };

  // Helper: Dapatkan URL Foto
  const getAvatarUrl = (user) => {
    if (user?.avatar) {
      return `http://localhost:8000/storage/${user.avatar}`;
    }
    return null;
  };

  // Logic: Saat file dipilih (Upload Foto)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB!');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);
    formDataUpload.append('_method', 'PUT'); 

    setIsUploading(true);
    try {
      await api.post('/api/v1/alumni/profile', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Foto profil berhasil diupdate!');
      await fetchProfile(); // Refresh tampilan
      
      // Update localStorage agar navbar berubah (butuh refresh atau event listener)
      const freshUser = await api.get('/api/user');
      localStorage.setItem('user', JSON.stringify(freshUser.data.data));
      window.dispatchEvent(new Event("storage")); // Trigger event storage

    } catch (error) {
      alert('Gagal upload: ' + (error.response?.data?.message || 'Error'));
    } finally {
      setIsUploading(false);
    }
  };

  // Logic: Submit Edit Profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/api/v1/alumni/profile', formData);
      alert('Profil berhasil diperbarui!');
      await fetchProfile();
      setIsModalOpen(false);
    } catch (error) {
      alert('Gagal update: ' + (error.response?.data?.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profil...</div>;

  return (
    <div className="max-w-4xl mx-auto">
       {/* Input File Tersembunyi */}
       <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/png, image/jpeg, image/jpg"
       />

      {/* Header Profile */}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
          <button 
            onClick={handleEditClick}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Profil
          </button>
      </div>
      
      {/* Card Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          
          {/* --- AREA FOTO PROFIL (Klik untuk Ganti) --- */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
             <div className="h-24 w-24 rounded-full overflow-hidden shadow-md ring-4 ring-white group-hover:ring-primary-100 transition-all">
                {getAvatarUrl(user) ? (
                    <img 
                        src={getAvatarUrl(user)} 
                        alt="Profile" 
                        className="h-full w-full object-cover" 
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl font-bold text-primary-600">
                        {user?.name?.[0]}
                    </div>
                )}
                
                {/* Overlay saat hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
             </div>
             
             {/* Loading Indicator */}
             {isUploading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                    <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 </div>
             )}

             <div className="flex justify-end">
                <Pencil className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
             <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
             <p className="text-gray-500 font-medium">{user?.email}</p>
             <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold capitalize border border-primary-100">
                {user?.role}
                </span>
                {user?.alumni_profile?.privacy_settings?.show_in_directory ? (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                        Visible in Directory
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                        Hidden from Directory
                    </span>
                )}
             </div>
          </div>
        </div>

        {/* Grid Informasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">NIM</label>
                <div className="text-lg text-gray-900 font-medium font-mono">
                    {user?.nim || '-'}
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Angkatan / Tahun Lulus</label>
                <div className="text-lg text-gray-900 font-medium">
                    {user?.angkatan || '?'} / <span className={user?.tahun_lulus ? "text-gray-900" : "text-green-600 font-semibold"}>
                        {user?.tahun_lulus ? user.tahun_lulus : 'On-going'}
                    </span>
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Jenis Kelamin</label>
                <div className="text-lg text-gray-900 font-medium">
                    {user?.alumni_profile?.gender === 'L' ? 'Laki-laki' : (user?.alumni_profile?.gender === 'P' ? 'Perempuan' : '-')}
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tanggal Lahir</label>
                <div className="text-lg text-gray-900 font-medium">
                    {user?.alumni_profile?.date_of_birth ? new Date(user.alumni_profile.date_of_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}) : '-'}
                </div>
            </div>

             <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">No. Handphone</label>
                <div className="text-lg text-gray-900 font-medium">{user?.alumni_profile?.phone || '-'}</div>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">LinkedIn URL</label>
                <div className="text-lg text-blue-600 font-medium truncate">
                    {user?.alumni_profile?.linkedin_url ? (
                        <a href={user.alumni_profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline">
                            {user.alumni_profile.linkedin_url}
                        </a>
                    ) : '-'}
                </div>
            </div>
            <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Alamat Domisili</label>
                <div className="text-lg text-gray-900 font-medium">{user?.alumni_profile?.address || '-'}</div>
            </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Profil & Privasi">
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Fields */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase border-b pb-1">Biodata & Kontak</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                            <option value="">- Pilih -</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="08..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 mb-2">Pengaturan Privasi</h4>
                
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="show_in_directory" checked={formData.privacy_settings.show_in_directory} onChange={handlePrivacyChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Tampilkan profil saya di Direktori Alumni</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="show_email" checked={formData.privacy_settings.show_email} onChange={handlePrivacyChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Tampilkan email ke publik</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="allow_contact" checked={formData.privacy_settings.allow_contact} onChange={handlePrivacyChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Izinkan adik tingkat menghubungi saya (Mentoring)</span>
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
}