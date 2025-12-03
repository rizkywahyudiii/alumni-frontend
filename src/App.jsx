import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/alumni/ProfilePage';
import EmploymentPage from './pages/alumni/EmploymentPage';
import InternshipPage from './pages/alumni/InternshipPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<DashboardLayout />}>
           <Route index element={<Navigate to="/dashboard" replace />} />
           <Route path="dashboard" element={<DashboardPage />} />
           <Route path="alumni/profile" element={<ProfilePage />} />
           <Route path="alumni/employments" element={<EmploymentPage />} />
           <Route path="alumni/internships" element={<InternshipPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;