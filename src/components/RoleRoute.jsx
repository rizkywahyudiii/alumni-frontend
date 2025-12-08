import { Navigate, Outlet } from 'react-router-dom';
import ForbiddenPage from '../pages/error/ForbiddenPage';

const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};

const RoleRoute = ({ allowedRoles }) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // --- ⚡ GOD MODE SUPER ADMIN ⚡ ---
    // 👇 Comment blok IF di bawah ini jika ingin membatasi akses super_admin sesuai rules
    if (user.role === 'super_admin') {
        return <Outlet />;
    }
    // --------------------------------

    // Cek Role Normal
    if (!allowedRoles.includes(user.role)) {
        return <ForbiddenPage />;
    }

    return <Outlet />;
};

export default RoleRoute;