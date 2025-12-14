import React, { useState } from 'react';
import { Users, Database, UserCog } from 'lucide-react';

// Import 2 komponen yang sudah kita pisah tadi
// Sesuaikan path import-nya ya!
import UserListManager from './components/UserListManager'; 
import CandidateManager from './components/CandidateManager';

export default function AdminUserPage() {
    // State untuk Tab Aktif (Default: 'users')
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* HEADER HALAMAN */}
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                    <div className="p-2 rounded-lg bg-emerald-100">
                        <UserCog className="text-emerald-600" size={28} /> 
                    </div>
                    Manajemen Pengguna & Data
                </h1>
                <p className="ml-12 text-gray-500">
                    Kelola akun pengguna aplikasi dan master data alumni untuk validasi.
                </p>
            </div>

            {/* NAVIGASI TAB */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`group flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium transition-all duration-200 ${
                            activeTab === 'users' 
                                ? 'border-emerald-600 text-emerald-700' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Users size={18} className={activeTab === 'users' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Daftar Akun User
                    </button>

                    <button
                        onClick={() => setActiveTab('candidates')}
                        className={`group flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium transition-all duration-200 ${
                            activeTab === 'candidates' 
                                ? 'border-emerald-600 text-emerald-700' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Database size={18} className={activeTab === 'candidates' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'} />
                        Master Data Alumni (Import)
                    </button>
                </div>
            </div>

            {/* KONTEN TAB (Switching Components) */}
            <div className="min-h-[500px]">
                {activeTab === 'users' ? (
                    <UserListManager />
                ) : (
                    <CandidateManager />
                )}
            </div>
        </div>
    );
}