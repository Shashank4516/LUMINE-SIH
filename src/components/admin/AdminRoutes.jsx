import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../../pages/AdminDashboard';
import AdminHeatmap from '../../pages/AdminHeatmap';
import AdminGuardTeams from '../../pages/AdminGuardTeams';
import AdminLaneControl from '../../pages/AdminLaneControl';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="heatmap" element={<AdminHeatmap />} />
            <Route path="guard" element={<AdminGuardTeams />} />
            <Route path="lane" element={<AdminLaneControl />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
};

export default AdminRoutes;

