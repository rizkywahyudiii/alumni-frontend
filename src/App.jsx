import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/auth/LoginPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage'; // <--- Import 404

// Layouts & Guards
import DashboardLayout from './components/layout/DashboardLayout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import RoleRoute from './components/RoleRoute';

// ... Import halaman Alumni/Jobs lainnya (sama seperti sebelumnya) ...
// (Saya singkat agar tidak kepanjangan, pastikan import employment, tracer study dll tetap ada)
import EmploymentPage from './pages/alumni/EmploymentPage';
import InternshipPage from './pages/alumni/InternshipPage';
import TracerStudy from './pages/alumni/TracerStudy';
import AlumniDirectoryPage from './pages/alumni/AlumniDirectoryPage';
import AlumniDetailPage from './pages/alumni/AlumniDetailPage';
import JobsPage from './pages/jobs/JobsPage';
import CreateJobPage from './pages/jobs/CreateJobPage';
import JobDetailPage from './pages/jobs/JobDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          
          <Route element={<DashboardLayout />}>
            
            {/* 1. Routes untuk SEMUA user yang login */}
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

            {/* 3. Routes Khusus Posting Job (Alumni & Admin) */}
            <Route element={<RoleRoute allowedRoles={['alumni', 'admin', 'super_admin']} />}>
                <Route path="/jobs/create" element={<CreateJobPage />} />
            </Route>

          </Route>

        </Route>

        {/* --- CATCH ALL (404) --- */}
        {/* Ditaruh di luar DashboardLayout agar full screen */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;