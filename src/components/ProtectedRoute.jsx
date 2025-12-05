import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Jika tidak ada token, redirect ke login
  // 'replace' digunakan agar user tidak bisa back ke halaman sebelumnya
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render halaman yang diminta (Outlet)
  return <Outlet />;
}