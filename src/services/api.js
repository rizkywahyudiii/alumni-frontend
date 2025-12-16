
// ===============LOCALHOST===========================

// import axios from 'axios';

// const api = axios.create({
//   // PENTING: baseURL harus mengarah ke /api
//   baseURL: 'http://localhost:8000/api', 
//   headers: {
//     'Content-Type': 'application/json',
//     // PENTING: Header ini memaksa Laravel merespon dengan JSON, bukan Redirect HTML
//     'Accept': 'application/json', 
//   },
//   // withCredentials: true, // Hapus atau set false jika menggunakan Token-based auth murni (bukan sanctum cookie)
// });

// // Interceptor untuk menyisipkan token secara otomatis
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;



// ===============PRAKTIK DEPLOYMENT===========================

import axios from 'axios';

// 1. Ambil URL dasar (Domain saja)
// Jika di Vercel, dia pakai VITE_API_URL. Jika di local, dia pakai localhost:8000
const domain = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 2. Gabungkan dengan '/api'
// Hasilnya jadi: "https://backend-kamu.railway.app/api" atau "http://localhost:8000/api"
const baseURL = `${domain}/api`;

const api = axios.create({
  baseURL: baseURL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', 
  },
});

// Interceptor (Tetap sama seperti kodemu)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;