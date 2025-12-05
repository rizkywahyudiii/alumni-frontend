import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Import Layouts & Components
import DashboardLayout from './components/layout/DashboardLayout'; 
import ProtectedRoute from './components/ProtectedRoute'; // <--- SATPAM

// Alumni Pages
import EmploymentPage from './pages/alumni/EmploymentPage';
import InternshipPage from './pages/alumni/InternshipPage';
import TracerStudy from './pages/alumni/TracerStudy';
import AlumniDirectoryPage from './pages/alumni/AlumniDirectoryPage';
import AlumniDetailPage from './pages/alumni/AlumniDetailPage';

// Jobs Pages
import JobsPage from './pages/jobs/JobsPage';
import CreateJobPage from './pages/jobs/CreateJobPage';
import JobDetailPage from './pages/jobs/JobDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --- Public Routes --- */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- PROTECTED ROUTES (Harus Login) --- */}
        {/* Kita bungkus DashboardLayout dengan ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          
          <Route element={<DashboardLayout />}>
            
            {/* Dashboard Utama */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Modul Alumni */}
            <Route path="/alumni/employments" element={<EmploymentPage />} />
            <Route path="/alumni/internships" element={<InternshipPage />} />
            <Route path="/directory" element={<AlumniDirectoryPage />} />
            <Route path="/directory/:id" element={<AlumniDetailPage />} />

            {/* Modul Tracer Study */}
            <Route path="/tracer-study" element={<TracerStudy />} />

            {/* Modul Lowongan Kerja */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/create" element={<CreateJobPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;