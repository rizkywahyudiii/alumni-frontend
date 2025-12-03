import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

export default function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    is_public: true
  });

  const fetchInternships = async () => {
    try {
      const response = await api.get('/api/v1/alumni/internships');
      setInternships(response.data);
    } catch (error) {
      console.error('Gagal ambil data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      company_name: item.company_name,
      title: item.title,
      start_date: item.start_date ? item.start_date.substring(0, 10) : '',
      end_date: item.end_date ? item.end_date.substring(0, 10) : '',
      description: item.description || '',
      is_public: item.is_public
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      company_name: '', title: '', 
      start_date: '', end_date: '', description: '', is_public: true
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await api.put(`/api/v1/alumni/internships/${editId}`, formData);
        alert('Data berhasil diperbarui!');
      } else {
        await api.post('/api/v1/alumni/internships', formData);
        alert('Data berhasil disimpan!');
      }
      await fetchInternships();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await api.delete(`/api/v1/alumni/internships/${id}`);
      setInternships(internships.filter(item => item.id !== id));
    } catch (error) {
      alert('Gagal menghapus data');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Magang</h1>
          <p className="text-gray-500 text-sm mt-1">Catat pengalaman magang/internship kamu.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Magang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {internships.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 text-4xl">🎓</div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada data magang</h3>
            <p className="text-gray-500">Mulai bangun portofolio karirmu dari sekarang.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perusahaan / Posisi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Visibilitas</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {internships.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.company_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} 
                      {' - '}
                      {item.end_date 
                        ? new Date(item.end_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) 
                        : <span className="text-primary-600 font-medium">Sekarang</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-center">
                        {item.is_public ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Public</span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Private</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editId ? "Edit Riwayat Magang" : "Tambah Riwayat Magang"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Magang</label>
             <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label><input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /><p className="text-xs text-gray-500 mt-1">*Kosongkan jika masih berlangsung</p></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea></div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
             <div className="flex items-center h-5">
               <input id="is_public" name="is_public" type="checkbox" checked={formData.is_public} onChange={handleChange} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded cursor-pointer" />
             </div>
             <div className="ml-3 text-sm">
               <label htmlFor="is_public" className="font-medium text-gray-700 cursor-pointer">Tampilkan ke Publik</label>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">{isSubmitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Data')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}