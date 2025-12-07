import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import StatsBar from './StatsBar';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear admin session
        localStorage.removeItem("lumine_token");
        localStorage.removeItem("lumine_user");
        sessionStorage.removeItem("lumine_token");
        sessionStorage.removeItem("lumine_user");
        
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="admin-dashboard" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AdminHeader onLogout={handleLogout} />
            <div style={{ padding: '20px' }}>
                <StatsBar />
                {/* Add more admin dashboard content here */}
            </div>
        </div>
    );
};

export default AdminDashboard;

