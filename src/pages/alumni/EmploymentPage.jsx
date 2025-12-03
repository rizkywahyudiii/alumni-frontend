import { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function EmploymentPage() {
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    employment_type: 'full_time',
    start_date: '',
    end_date: '',
    description: '',
    is_public: true // Default True
  });

  const fetchEmployments = async () => {
    try {
      const response = await api.get('/api/v1/alumni/employments');
      setEmployments(response.data);
    } catch (error) {
      console.error('Gagal ambil data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployments();
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
      employment_type: item.employment_type,
      // FIX: Ambil 10 karakter pertama saja (YYYY-MM-DD)
      // Ini aman menangani format "2024-01-01" maupun "2024-01-01T00:00:00.000Z"
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
      company_name: '', title: '', employment_type: 'full_time', 
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
        await api.put(`/api/v1/alumni/employments/${editId}`, formData);
        alert('Data berhasil diperbarui!');
      } else {
        await api.post('/api/v1/alumni/employments', formData);
        alert('Data berhasil disimpan!');
      }
      await fetchEmployments();
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
      await api.delete(`/api/v1/alumni/employments/${id}`);
      setEmployments(employments.filter(item => item.id !== id));
    } catch (error) {
      alert('Gagal menghapus data');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
        case 'full_time': return 'green';
        case 'part_time': return 'blue';
        case 'freelance': return 'purple';
        case 'entrepreneur': return 'yellow';
        default: return 'gray';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Pekerjaan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data pengalaman kerjamu di sini.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Pekerjaan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {employments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 text-4xl">💼</div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada data</h3>
            <p className="text-gray-500">Tambahkan pengalaman kerjamu sekarang.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perusahaan / Posisi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Periode</th>
                  {/* Tambah Header Visibilitas */}
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Visibilitas</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employments.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type={getTypeColor(job.employment_type)}>
                        {job.employment_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(job.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} 
                      {' - '}
                      {job.end_date 
                        ? new Date(job.end_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) 
                        : <span className="text-primary-600 font-medium">Sekarang</span>
                      }
                    </td>
                    {/* Kolom Visibilitas Baru */}
                    <td className="px-6 py-4 text-center">
                        {job.is_public ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Public
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 011.591-3.07m1.591-1.591M21 21l-9-9m9 9l-2.09-2.09M3 3l9 9m0 0l-2.09-2.09m0 0L3 3" /></svg>
                                Private
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(job)} className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">Hapus</button>
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
        title={editId ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           
          {/* ... Input field lainnya (Company, Title, dll) TETAP SAMA seperti sebelumnya ... */}
          {/* Copy paste input form sebelumnya di sini */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Posisi / Jabatan</label><input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pekerjaan</label><select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"><option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="freelance">Freelance</option><option value="contract">Contract</option><option value="entrepreneur">Wirausaha</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label><input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /><p className="text-xs text-gray-500 mt-1">*Kosongkan jika masih bekerja</p></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea></div>

          {/* Toggle Visibilitas Baru */}
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
             <div className="flex items-center h-5">
               <input
                 id="is_public"
                 name="is_public"
                 type="checkbox"
                 checked={formData.is_public}
                 onChange={handleChange}
                 className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded cursor-pointer"
               />
             </div>
             <div className="ml-3 text-sm">
               <label htmlFor="is_public" className="font-medium text-gray-700 cursor-pointer">Tampilkan ke Publik</label>
               <p className="text-gray-500 text-xs">Jika dicentang, mahasiswa on-going dapat melihat riwayat ini.</p>
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