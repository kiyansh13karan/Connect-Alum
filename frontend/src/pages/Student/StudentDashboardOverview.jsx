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
    const [alumniJobCount, setAlumniJobCount]     = useState(0);
    const [alumniInternCount, setAlumniInternCount] = useState(0);
    const [latestAlumniJobs, setLatestAlumniJobs] = useState([]);
    const [upcomingEvents, setUpcomingEvents]     = useState([]);
    const [name, setName] = useState('Student');
    const [notifications, setNotifications] = useState([]);
    const [markingRead, setMarkingRead]     = useState(null);

    /* — Fetch notifications — */
    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await axios.get(url + '/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setNotifications(res.data.notifications || []);
        } catch { /* silent */ }
    };

    const markRead = async (id) => {
        setMarkingRead(id);
        try {
            await axios.post(url + '/api/notifications/read', { notificationId: id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch { /* silent */ } finally { setMarkingRead(null); }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        await Promise.all(unread.map(n =>
            axios.post(url + '/api/notifications/read', { notificationId: n._id }, {
                headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {})
        ));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [token]);

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

                // Fetch alumni-posted jobs — split into Jobs and Internships
                const jobRes = await axios.get(url + '/api/jobs/alumni-posts');
                if (jobRes.data.success) {
                    const allPosts = jobRes.data.posts;
                    const jobPosts    = allPosts.filter(p => p.type !== 'Internship');
                    const internPosts = allPosts.filter(p => p.type === 'Internship');
                    setAlumniJobCount(jobPosts.length);
                    setAlumniInternCount(internPosts.length);
                    setLatestAlumniJobs(jobPosts.slice(0, 3));
                }

                // Fetch alumni-posted events
                const evtRes = await axios.get(url + '/api/events');
                const evtData = evtRes.data;
                const allEvents = evtData.success ? evtData.events : (Array.isArray(evtData) ? evtData : []);
                const upcoming = allEvents.filter(e => e.status !== 'completed').slice(0, 3);
                setUpcomingEvents(upcoming);
            } catch (error) {
                console.error('Error fetching overview:', error);
            }
        };
        if (token) fetchOverview();
    }, [url, token]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

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

            {/* ── Notifications Banner ── */}
            {notifications.filter(n => !n.isRead).length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
                    border: '1px solid #c7d2fe',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔔 Notifications
                            <span style={{ fontSize: '11px', fontWeight: 700, background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '100px' }}>
                                {notifications.filter(n => !n.isRead).length} new
                            </span>
                        </h2>
                        <button
                            onClick={markAllRead}
                            style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Mark all read
                        </button>
                    </div>
                    {notifications.filter(n => !n.isRead).slice(0, 4).map(n => (
                        <div
                            key={n._id}
                            onClick={() => markRead(n._id)}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: '12px',
                                background: 'white', border: '1px solid #e0e7ff',
                                borderRadius: '10px', padding: '12px 14px',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', flexShrink: 0, marginTop: '5px' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 3px 0', lineHeight: 1.4 }}>{n.message}</p>
                                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    {' · '}Click to dismiss
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Stats Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <StatCard to="/student/mentors"      icon={faUserTie}      value={stats.connections}   label="Active Mentors"  iconBg="#eff6ff" iconColor="#2563eb" borderColor="#bfdbfe" />
                <StatCard to="/student/appointments" icon={faCalendarCheck} value={stats.appointments}  label="Appointments"    iconBg="#f0fdf4" iconColor="#16a34a" borderColor="#bbf7d0" />
                <StatCard to="/student/opportunities" icon={faBriefcase}  value={alumniJobCount}       label="Alumni Jobs"     iconBg="#eef2ff" iconColor="#4f46e5" borderColor="#c7d2fe" />
                <StatCard to="/student/internships"  icon={faLaptopCode}   value={alumniInternCount}    label="Internships"     iconBg="#f5f3ff" iconColor="#7c3aed" borderColor="#ddd6fe" />
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
                        <Link to="/student/events" style={pillLink}>View All</Link>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {upcomingEvents.map(evt => {
                                const typeColors = { webinar: '#2563eb', career: '#7c3aed', ama: '#16a34a' };
                                const typeBgs   = { webinar: '#eff6ff', career: '#f5f3ff', ama:  '#f0fdf4' };
                                const typeIcons = { webinar: '🖥️', career: '🎤', ama: '💬' };
                                const c = typeColors[evt.type] || '#4f46e5';
                                const bg = typeBgs[evt.type] || '#eef2ff';
                                const formatDate = (d) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); } catch { return d; } };
                                return (
                                    <div key={evt._id} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 12px',
                                        backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
                                        borderRadius: '10px',
                                    }}>
                                        <div style={{
                                            width: '34px', height: '34px', borderRadius: '8px',
                                            backgroundColor: bg, color: c,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '14px', flexShrink: 0,
                                        }}>
                                            {typeIcons[evt.type] || '📅'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {evt.title}
                                            </p>
                                            <p style={{ fontSize: '10px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                                                {formatDate(evt.date || evt.updatedOn)}{evt.time ? ' · ' + evt.time : ''}
                                            </p>
                                        </div>
                                        <span style={{
                                            fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                                            background: bg, color: c, flexShrink: 0,
                                        }}>
                                            {evt.type || 'Event'}
                                        </span>
                                    </div>
                                );
                            })}
                            <Link to="/student/events" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '8px', marginTop: '2px',
                                backgroundColor: '#eff6ff', color: '#2563eb',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '11px', fontWeight: 600,
                            }}>
                                View All Events <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '9px' }} />
                            </Link>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '24px 16px',
                            backgroundColor: '#f9fafb', borderRadius: '12px',
                            border: '1px solid #f3f4f6',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 10px auto', color: '#2563eb', fontSize: '16px',
                            }}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <p style={{ fontSize: '13px', color: '#4b5563', fontWeight: 500, margin: 0 }}>
                                No upcoming events yet.
                            </p>
                            <Link to="/student/events" style={{
                                display: 'inline-block', marginTop: '10px',
                                padding: '6px 16px', backgroundColor: '#2563eb', color: '#fff',
                                borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 600,
                            }}>
                                Browse Events
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Row 4: Latest Opportunities (from Alumni) ── */}
            <div style={card}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Latest Alumni Opportunities</h2>
                    <Link to="/student/opportunities" style={pillLink}>View All Jobs</Link>
                </div>
                {latestAlumniJobs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {latestAlumniJobs.map(job => (
                            <div key={job._id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 16px',
                                backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
                                borderRadius: '12px', gap: '12px', flexWrap: 'wrap',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        backgroundColor: '#eef2ff', color: '#4f46e5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', flexShrink: 0,
                                    }}>
                                        <FontAwesomeIcon icon={faBriefcase} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.title}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>
                                            {job.company} · {job.location}
                                        </p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700,
                                    padding: '3px 10px', borderRadius: '100px',
                                    backgroundColor: job.type === 'Job' ? '#eff6ff' : job.type === 'Internship' ? '#f5f3ff' : '#f0fdf4',
                                    color: job.type === 'Job' ? '#2563eb' : job.type === 'Internship' ? '#7c3aed' : '#16a34a',
                                    border: `1px solid ${job.type === 'Job' ? '#bfdbfe' : job.type === 'Internship' ? '#ddd6fe' : '#bbf7d0'}`,
                                    flexShrink: 0,
                                }}>
                                    {job.type}
                                </span>
                            </div>
                        ))}
                        <Link
                            to="/student/opportunities"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '10px', marginTop: '4px',
                                backgroundColor: '#eff6ff', color: '#2563eb',
                                borderRadius: '10px', textDecoration: 'none',
                                fontSize: '12px', fontWeight: 600,
                            }}
                        >
                            View All Opportunities <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px' }} />
                        </Link>
                    </div>
                ) : (
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
                                    No Alumni Posts Yet
                                </p>
                                <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '4px', marginBottom: 0 }}>
                                    Check the Jobs section for external listings.
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
                )}
            </div>

        </div>
    );
};

export default StudentDashboardOverview;
