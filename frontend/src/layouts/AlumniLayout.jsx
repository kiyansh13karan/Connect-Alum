import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbars';
import { StoreContext } from '../context/StoreContext';
import './AlumniLayout.css';

const navLinks = [
    { to: '/alumni/dashboard',      label: 'Dashboard',           icon: '⚡' },
    { to: '/alumni/profile',        label: 'My Profile',           icon: '👤' },
    { to: '/alumni/requests',       label: 'Student Requests',     icon: '🤝' },
    { to: '/alumni/appointments',   label: 'Appointments',         icon: '📅' },
    { to: '/alumni/opportunities',  label: 'Opportunities',        icon: '📢' },
    { to: '/alumni/messages',       label: 'Messages',             icon: '💬' },
    { to: '/alumni/events',         label: 'Events',               icon: '🗓️' },
    { to: '/alumni/analytics',      label: 'Analytics',            icon: '📊' },
    { to: '/alumni/settings',       label: 'Settings',             icon: '⚙️' },
];

const AlumniLayout = () => {
    const { setShowLogin, setToken } = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (typeof setToken === 'function') setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    };

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
                        {navLinks.map(({ to, label, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
                            >
                                <span className="link-icon">{icon}</span>
                                <span className="link-label">{label}</span>
                                <span className="link-indicator" />
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
