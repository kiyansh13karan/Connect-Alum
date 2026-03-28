import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserTie,
    faCalendarCheck,
    faBriefcase,
    faLaptopCode,
    faChevronRight,
    faSearch,
    faComments,
    faNewspaper,
    faCalendarAlt,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

/* ─── Reusable style tokens ─────────────────────────────── */
const card = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    padding: '24px',
};

const sectionHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
};

const sectionTitle = {
    fontSize: '15px',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
};

const pillLink = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    padding: '4px 12px',
    borderRadius: '999px',
    textDecoration: 'none',
};

const emptyBox = {
    textAlign: 'center',
    padding: '32px 16px',
    backgroundColor: '#f9fafb',
    border: '1px dashed #d1d5db',
    borderRadius: '12px',
};

/* ─── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ to, icon, value, label, iconBg, iconColor, borderColor }) => (
    <Link
        to={to}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            padding: '20px',
            textDecoration: 'none',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
        <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: iconBg, color: iconColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
        }}>
            <FontAwesomeIcon icon={icon} />
        </div>
        <div>
            <p style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', margin: '4px 0 0 0' }}>{label}</p>
        </div>
    </Link>
);

/* ─── Action Row ─────────────────────────────────────────── */
const ActionRow = ({ to, icon, title, subtitle }) => (
    <Link
        to={to}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280', fontSize: '14px', flexShrink: 0,
            }}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>{title}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>{subtitle}</p>
            </div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#d1d5db', fontSize: '11px' }} />
    </Link>
);

/* ─── Mentor Row ─────────────────────────────────────────── */
const MentorRow = ({ icon, iconBg, iconColor, title, subtitle }) => (
    <div
        onClick={() => window.location.href = '/student/mentors'}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#f3f4f6'; }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: iconBg, color: iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0,
            }}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>{title}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '3px 0 0 0' }}>{subtitle}</p>
            </div>
        </div>
        <button style={{
            fontSize: '11px', fontWeight: 600, color: '#2563eb',
            backgroundColor: '#eff6ff', border: 'none',
            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
        }}>
            Connect
        </button>
    </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const StudentDashboardOverview = () => {
    const { url, token } = useContext(StoreContext);
    const [stats, setStats] = useState({ connections: 0, appointments: 0 });
    const [name, setName] = useState('Student');

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const profileRes = await axios.get(url + '/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
                if (profileRes.data.success) setName(profileRes.data.user.name);

                const connRes = await axios.get(url + '/api/student/connections', { headers: { Authorization: `Bearer ${token}` } });
                const accepted = connRes.data.requests ? connRes.data.requests.filter(r => r.status === 'accepted') : [];

                const appRes = await axios.get(url + '/api/student/appointments', { headers: { Authorization: `Bearer ${token}` } });
                setStats({
                    connections: accepted.length,
                    appointments: appRes.data.appointments ? appRes.data.appointments.length : 0,
                });
            } catch (error) {
                console.error('Error fetching overview:', error);
            }
        };
        if (token) fetchOverview();
    }, [url, token]);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Welcome Header ── */}
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Welcome back, {name} 👋
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px', marginBottom: 0 }}>
                    Here's your career progress overview for today.
                </p>
            </div>

            {/* ── Stats Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <StatCard to="/student/mentors"      icon={faUserTie}      value={stats.connections}   label="Active Mentors"  iconBg="#eff6ff" iconColor="#2563eb" borderColor="#bfdbfe" />
                <StatCard to="/student/appointments" icon={faCalendarCheck} value={stats.appointments}  label="Appointments"    iconBg="#f0fdf4" iconColor="#16a34a" borderColor="#bbf7d0" />
                <StatCard to="/student/opportunities" icon={faBriefcase}  value={4}                    label="Open Jobs"       iconBg="#eef2ff" iconColor="#4f46e5" borderColor="#c7d2fe" />
                <StatCard to="/student/internships"  icon={faLaptopCode}   value={2}                   label="Internships"     iconBg="#fffbeb" iconColor="#d97706" borderColor="#fde68a" />
            </div>

            {/* ── Row 2: Quick Actions | Upcoming Appointments ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Quick Actions */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Quick Actions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <ActionRow to="/student/mentors"  icon={faSearch}    title="Find a Mentor"  subtitle="Browse alumni network" />
                        <ActionRow to="/student/messages" icon={faComments}  title="Messages"        subtitle="Chat with connections" />
                        <ActionRow to="/student/feed"     icon={faNewspaper} title="LinkedIn Feed"   subtitle="Latest alumni updates" />
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Upcoming Appointments</h2>
                        <Link to="/student/appointments" style={pillLink}>View All</Link>
                    </div>
                    {stats.appointments > 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                You have <strong>{stats.appointments}</strong> appointment(s) scheduled.
                            </p>
                            <button
                                onClick={() => window.location.href = '/student/appointments'}
                                style={{
                                    marginTop: '12px', padding: '8px 20px',
                                    backgroundColor: '#eff6ff', color: '#2563eb',
                                    border: 'none', borderRadius: '8px',
                                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Go to Appointments
                            </button>
                        </div>
                    ) : (
                        <div style={emptyBox}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '50%',
                                backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px auto', color: '#9ca3af', fontSize: '18px',
                            }}>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>No appointments yet</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                                Book a session with an alumni mentor to get started.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Row 3: Recommended Mentors | Upcoming Events ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Recommended Mentors */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Recommended Mentors</h2>
                        <Link to="/student/mentors" style={pillLink}>Browse Directory</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <MentorRow icon={faUserTie} iconBg="#dbeafe" iconColor="#2563eb" title="Discover Alumni"   subtitle="Based on your major" />
                        <MentorRow icon={faUserTie} iconBg="#ede9fe" iconColor="#7c3aed" title="Expand Network"    subtitle="Based on your interests" />
                    </div>
                </div>

                {/* Upcoming Events */}
                <div style={card}>
                    <div style={sectionHeader}>
                        <h2 style={sectionTitle}>Upcoming Events</h2>
                        <Link to="/student/events" style={pillLink}>View Calendar</Link>
                    </div>
                    <div style={{
                        textAlign: 'center', padding: '28px 16px',
                        backgroundColor: '#f9fafb', borderRadius: '12px',
                        border: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px auto', color: '#2563eb', fontSize: '18px',
                        }}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500, margin: 0 }}>
                            Join seminars, AMAs, and networking events.
                        </p>
                        <Link
                            to="/student/events"
                            style={{
                                display: 'inline-block', marginTop: '14px',
                                padding: '8px 20px',
                                backgroundColor: '#2563eb', color: '#fff',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '12px', fontWeight: 600,
                            }}
                        >
                            View Events
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Row 4: Latest Opportunities ── */}
            <div style={card}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Latest Opportunities</h2>
                    <Link to="/student/opportunities" style={pillLink}>View Jobs</Link>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '16px',
                    backgroundColor: '#eef2ff', border: '1px solid #c7d2fe',
                    borderRadius: '12px', padding: '20px 24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            backgroundColor: '#dbeafe', color: '#4f46e5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', flexShrink: 0,
                        }}>
                            <FontAwesomeIcon icon={faBriefcase} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>
                                Software Engineering Roles
                            </p>
                            <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '4px', marginBottom: 0 }}>
                                Multiple companies actively recruiting.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/student/opportunities"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 22px',
                            backgroundColor: '#1e1b4b', color: '#fff',
                            borderRadius: '8px', textDecoration: 'none',
                            fontSize: '13px', fontWeight: 600,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Explore Openings <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '11px' }} />
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default StudentDashboardOverview;
