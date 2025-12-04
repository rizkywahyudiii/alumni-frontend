import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EmploymentPage from './pages/alumni/EmploymentPage';
import InternshipPage from './pages/alumni/InternshipPage';
import TracerStudy from './pages/alumni/TracerStudy';
import JobsPage from './pages/jobs/JobsPage';
import CreateJobPage from './pages/jobs/CreateJobPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import AlumniDirectoryPage from './pages/alumni/AlumniDirectoryPage';
import AlumniDetailPage from './pages/alumni/AlumniDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="alumni/employments" element={<EmploymentPage />} />
          <Route path="alumni/internships" element={<InternshipPage />} />
          <Route path="/tracer-study" element={<TracerStudy />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/create" element={<CreateJobPage />} /> {/* Create HARUS diatas :id */}
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/directory" element={<AlumniDirectoryPage />} />
          <Route path="/directory/:id" element={<AlumniDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;