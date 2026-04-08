import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbars';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import './AlumniLayout.css';

const AlumniLayout = () => {
    const { setShowLogin, setToken, url, token } = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [badges, setBadges] = useState({ requests: 0, messages: 0, appointments: 0 });

    /* ── Fetch live badge counts ───────────────────────── */
    const fetchBadges = async () => {
        if (!token) return;
        try {
            const [reqRes, apptRes] = await Promise.all([
                axios.get(`${url}/api/alumni-role/student-requests`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${url}/api/alumni-role/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const pendingReqs = reqRes.data.success
                ? reqRes.data.requests.filter(r => r.status === 'pending').length : 0;
            const pendingAppts = apptRes.data.success
                ? apptRes.data.appointments.filter(a => a.status === 'pending').length : 0;
            setBadges(prev => ({ ...prev, requests: pendingReqs, appointments: pendingAppts }));
        } catch { /* silent */ }
    };

    useEffect(() => {
        fetchBadges();
        const interval = setInterval(fetchBadges, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, [token, url]);

    const handleLogout = () => {
        if (typeof setToken === 'function') setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navLinks = [
        { to: '/alumni/dashboard',     label: 'Dashboard',        icon: '⚡',  badge: 0 },
        { to: '/alumni/profile',       label: 'My Profile',        icon: '👤',  badge: 0 },
        { to: '/alumni/requests',      label: 'Student Requests',  icon: '🤝',  badge: badges.requests },
        { to: '/alumni/appointments',  label: 'Appointments',      icon: '📅',  badge: badges.appointments },
        { to: '/alumni/opportunities', label: 'Opportunities',     icon: '📢',  badge: 0 },
        { to: '/alumni/messages',      label: 'Messages',          icon: '💬',  badge: 0 },
        { to: '/alumni/events',        label: 'Events',            icon: '🗓️',  badge: 0 },
        { to: '/alumni/analytics',     label: 'Analytics',         icon: '📊',  badge: 0 },
        { to: '/alumni/settings',      label: 'Settings',          icon: '⚙️',  badge: 0 },
    ];

    return (
        <div className="flex flex-col min-h-screen pt-20">
            <Navbar setShowLogin={setShowLogin} />
            <div className="flex flex-1">
                {/* Premium Sidebar */}
                <aside className="alumni-sidebar">
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <span className="logo-icon">🎓</span>
                        </div>
                        <div>
                            <h2 className="sidebar-title">Alumni Portal</h2>
                            <p className="sidebar-subtitle">Your gateway to connect</p>
                        </div>
                    </div>

                    <div className="sidebar-divider" />

                    <nav className="sidebar-nav">
                        {navLinks.map(({ to, label, icon, badge }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
                            >
                                <span className="link-icon">{icon}</span>
                                <span className="link-label">{label}</span>
                                {badge > 0 ? (
                                    <span className="link-badge">{badge > 99 ? '99+' : badge}</span>
                                ) : (
                                    <span className="link-indicator" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button
                            className="sidebar-logout"
                            onClick={handleLogout}
                            id="sidebar-logout-btn"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                        <div className="sidebar-badge">✨ Alumni Member</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="alumni-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AlumniLayout;
