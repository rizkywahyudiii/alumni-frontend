import axios from 'axios';

const api = axios.create({
  // PENTING: baseURL harus mengarah ke /api
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    // PENTING: Header ini memaksa Laravel merespon dengan JSON, bukan Redirect HTML
    'Accept': 'application/json', 
  },
  // withCredentials: true, // Hapus atau set false jika menggunakan Token-based auth murni (bukan sanctum cookie)
});

// Interceptor untuk menyisipkan token secara otomatis
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