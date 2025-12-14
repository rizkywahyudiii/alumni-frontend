import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios'; // Import Axios

import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import App from './App.jsx';

// =========================================
// 🌐 GLOBAL AXIOS SETUP (SAFE MODE)
// =========================================

// 1. KITA TIDAK SET BaseURL
// Biarkan kosong, supaya Full URL (http://localhost:8000/...) di halamanmu tetap jalan.
// axios.defaults.baseURL = ...; // JANGAN DIPAKAI

// 2. TAPI KITA PASANG "SATPAM TOKEN"
// Supaya Dashboard, Jobs, dll otomatis bawa token tanpa diedit satu-satu.
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// =========================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);