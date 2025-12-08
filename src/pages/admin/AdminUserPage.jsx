import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, Edit, Save, X, UserCog } from 'lucide-react';

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    
    // State untuk Edit Mode (Inline Edit)
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}'); // <--- Tambahkan ini

    // 1. Fetch Users
    const fetchUsers = async (pageNo = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/alumni/admin/users?page=${pageNo}&search=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data.data);
            setPagination(res.data.data);
            setPage(pageNo);
        } catch (error) {
            console.error("Gagal ambil data user", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search agar tidak request tiap ketik
        const timer = setTimeout(() => {
            fetchUsers(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // 2. Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini? Data tidak bisa dikembalikan!")) return;

        try {
            await axios.delete(`http://localhost:8000/api/v1/alumni/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers(page, search); // Refresh table
            alert("User berhasil dihapus.");
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menghapus user");
        }
    };

    // 3. Handle Edit (Start Editing)
    const startEdit = (user) => {
        setEditingId(user.id);
        setEditForm({
            name: user.name,
            nim: user.nim || '',
            role: user.role
        });
    };

    // 4. Handle Save (Update)
    const handleSave = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/alumni/admin/users/${id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchUsers(page, search); // Refresh
            alert("Data user berhasil diperbarui!");
        } catch (error) {
            alert("Gagal update user.");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                        <UserCog className="text-emerald-600" /> Manajemen Pengguna
                    </h1>
                    <p className="text-gray-500">Kelola akun alumni, mahasiswa, dan dosen.</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input 
                        type="text" 
                        placeholder="Cari Nama / NIM..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 md:w-64"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm tracking-wider text-gray-600 uppercase bg-gray-50">
                                <th className="p-4 border-b">Nama User</th>
                                <th className="p-4 border-b">NIM / Identitas</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 text-center border-b">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">Memuat data...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">Tidak ada user ditemukan.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="transition-colors hover:bg-gray-50">
                                        {/* Kolom Nama */}
                                        <td className="p-4">
                                            {editingId === user.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editForm.name} 
                                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            ) : (
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            )}
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </td>

                                        {/* Kolom NIM */}
                                        <td className="p-4 text-sm text-gray-600">
                                            {editingId === user.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editForm.nim} 
                                                    onChange={e => setEditForm({...editForm, nim: e.target.value})}
                                                    className="w-24 px-2 py-1 border rounded"
                                                    placeholder="NIM"
                                                />
                                            ) : (
                                                user.nim || '-'
                                            )}
                                        </td>

                                        {/* Kolom Role */}
                                        <td className="p-4">
                                            {editingId === user.id ? (
                                                <select 
                                                    value={editForm.role}
                                                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                                                    className="px-2 py-1 text-sm bg-white border rounded"
                                                >
                                                    <option value="mahasiswa">Mahasiswa</option>
                                                    <option value="alumni">Alumni</option>
                                                    <option value="dosen">Dosen</option>
                                                    <option value="admin">Admin</option>

                                                    {/* Hanya tampilkan opsi ini jika yang login adalah Super Admin */}
                                                    {currentUser.role === 'super_admin' && (
                                                        <option value="super_admin">Super Admin</option>
                                                    )}
                                                </select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                    ${user.role === 'admin' || user.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                                                      user.role === 'alumni' ? 'bg-blue-100 text-blue-700' : 
                                                      user.role === 'dosen' ? 'bg-purple-100 text-purple-700' :
                                                      'bg-emerald-100 text-emerald-700'}`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>

                                        {/* Kolom Aksi */}
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {editingId === user.id ? (
                                                    <>
                                                        <button onClick={() => handleSave(user.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Simpan">
                                                            <Save size={18} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Batal">
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Simple */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                        Hal {pagination.current_page} dari {pagination.last_page}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={!pagination.prev_page_url}
                            onClick={() => fetchUsers(page - 1, search)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button 
                            disabled={!pagination.next_page_url}
                            onClick={() => fetchUsers(page + 1, search)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}