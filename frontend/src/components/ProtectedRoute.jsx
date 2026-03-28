import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (role === 'alumni') return <Navigate to="/alumni/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    // Role is allowed, render child routes
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
