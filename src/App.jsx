import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import RegisterSuccessPage from './pages/auth/RegisterSuccessPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage';

// Layouts & Guards
import DashboardLayout from './components/layout/DashboardLayout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import RoleRoute from './components/RoleRoute';

import EmploymentPage from './pages/alumni/EmploymentPage';
import InternshipPage from './pages/alumni/InternshipPage';
import TracerStudy from './pages/alumni/TracerStudy';
import AlumniDirectoryPage from './pages/alumni/AlumniDirectoryPage';
import AlumniDetailPage from './pages/alumni/AlumniDetailPage';
import JobsPage from './pages/jobs/JobsPage';
import CreateJobPage from './pages/jobs/CreateJobPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import AdminUserPage from './pages/admin/AdminUserPage';

function App() {
  const VerifiedRoute = () => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const location = useLocation();

      // Cek Login
      if (!token || !user) {
          return <Navigate to="/login" replace />;
      }

      // Cek Verifikasi Email
      // Pastikan backend mengirim field 'email_verified_at' saat login
      if (user.email_verified_at === null) {
          return <Navigate to="/register-success" state={{ email: user.email }} replace />;
      }

      // Ini artinya: "Silakan lanjut render route anak-anak di dalamnya"
      return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />

        {/* --- PROTECTED ROUTES --- */}
        {/* Layer 1: Harus Login (Punya Token) */}
        <Route element={<ProtectedRoute />}>
          
          {/* 👇 Layer 2: Harus Verified Email (PASANG DISINI) */}
          <Route element={<VerifiedRoute />}>

              {/* Layer 3: Layout Dashboard */}
              <Route element={<DashboardLayout />}>
                
                {/* 1. Routes untuk SEMUA user */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/directory" element={<AlumniDirectoryPage />} />
                <Route path="/directory/:id" element={<AlumniDetailPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />

                {/* 2. Routes Khusus ALUMNI */}
                <Route element={<RoleRoute allowedRoles={['alumni']} />}>
                    <Route path="/alumni/employments" element={<EmploymentPage />} />
                    <Route path="/alumni/internships" element={<InternshipPage />} />
                    <Route path="/tracer-study" element={<TracerStudy />} />
                </Route>

                {/* 3. Routes Job Posting */}
                <Route element={<RoleRoute allowedRoles={['alumni', 'admin', 'super_admin']} />}>
                    <Route path="/jobs/create" element={<CreateJobPage />} />
                </Route>

                {/* 4. Area Admin */}
                <Route element={<RoleRoute allowedRoles={['admin', 'super_admin']} />}>
                    <Route path="/admin/users" element={<AdminUserPage />} />
                </Route>

              </Route> {/* End DashboardLayout */}
          
          </Route> {/* End VerifiedRoute */}

        </Route> {/* End ProtectedRoute */}

        {/* --- CATCH ALL (404) --- */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;