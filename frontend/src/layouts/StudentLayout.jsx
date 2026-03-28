import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbars';
import { StoreContext } from '../context/StoreContext';

const StudentLayout = () => {
    const { setShowLogin } = useContext(StoreContext);
    const location = useLocation();

    const navItems = [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/internships', label: 'Internships' },
        { to: '/student/opportunities', label: 'Jobs' },
        { to: '/student/mentors', label: 'Mentors' },
        { to: '/student/messages', label: 'Messages' },
        { to: '/student/appointments', label: 'Appointments' },
        { to: '/student/events', label: 'Events' },
        { to: '/student/feed', label: 'LinkedIn Feed' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Navbar setShowLogin={setShowLogin} />
            {/* Flex row body pushed below fixed navbar */}
            <div style={{ display: 'flex', flex: 1, paddingTop: '72px' }}>
                {/* Sidebar — sticky so it scrolls naturally but stays in view */}
                <aside style={{
                    width: '240px',
                    minWidth: '240px',
                    flexShrink: 0,
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e5e7eb',
                    padding: '24px 12px',
                    position: 'sticky',
                    top: '72px',
                    height: 'calc(100vh - 72px)',
                    overflowY: 'auto',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
                }}>
                    <p style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        padding: '0 12px',
                        marginBottom: '12px',
                    }}>
                        Student Portal
                    </p>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {navItems.map(item => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    style={{
                                        display: 'block',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                        color: isActive ? '#2563eb' : '#374151',
                                        transition: 'background-color 0.15s ease, color 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                            e.currentTarget.style.color = '#2563eb';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#374151';
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content — takes remaining width */}
                <main style={{
                    flex: 1,
                    minWidth: 0,
                    backgroundColor: '#f9fafb',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
