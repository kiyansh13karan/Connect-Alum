import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserGraduate, faBriefcase, faComments, faBell,
    faCheckCircle, faRocket, faArrowRight, faChartPie,
    faFire, faStar, faNetworkWired, faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

/* ── Reusable Quick Stat Card ────────────────── */
const StatCard = ({ icon, label, value, colorClass, glowClass }) => (
    <div className={`db-stat-card ${colorClass}`}>
        <div className={`db-stat-icon-wrap ${glowClass}`}>
            <FontAwesomeIcon icon={icon} />
        </div>
        <div className="db-stat-body">
            <p className="db-stat-label">{label}</p>
            <h3 className="db-stat-value">{value}</h3>
        </div>
        <div className="db-stat-shine" />
    </div>
);

/* ── Quick Action Card ───────────────────────── */
const ActionCard = ({ icon, title, desc, href, color }) => (
    <a href={href} className={`db-action-card ${color}`}>
        <div className="db-action-icon">
            <FontAwesomeIcon icon={icon} />
        </div>
        <div>
            <p className="db-action-title">{title}</p>
            <p className="db-action-desc">{desc}</p>
        </div>
        <FontAwesomeIcon icon={faArrowRight} className="db-action-arrow" />
    </a>
);

const Dashboard = () => {
    const { url, token } = useContext(StoreContext);
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({ requests: 0, posts: 0, notifications: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const profileRes = await axios.get(`${url}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(profileRes.data.user);

            try {
                const mentorRes = await axios.get(`${url}/api/mentorship/my-requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(prev => ({ ...prev, requests: mentorRes.data.requests?.length || 0 }));
            } catch { }

            try {
                const forumRes = await axios.get(`${url}/api/forum`);
                const myPosts = forumRes.data.posts?.filter(p => p.authorId._id === profileRes.data.user._id) || [];
                setStats(prev => ({ ...prev, posts: myPosts.length }));
            } catch { }

            try {
                const notifRes = await axios.get(`${url}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(notifRes.data.notifications || []);
                setStats(prev => ({ ...prev, notifications: (notifRes.data.notifications || []).filter(n => !n.isRead).length }));
            } catch { }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, [url, token]);

    const handleMarkRead = async (id) => {
        try {
            await axios.post(`${url}/api/notifications/read`, { notificationId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    useEffect(() => {
        if (token) fetchDashboardData();
    }, [token, url, fetchDashboardData]);

    if (loading) return (
        <div className="db-loading">
            <div className="db-spinner">
                <div className="db-spinner-ring" />
                <div className="db-spinner-ring db-spinner-ring-2" />
            </div>
            <p className="db-loading-text">Loading your dashboard...</p>
        </div>
    );

    const initials = userData?.name ? userData.name.charAt(0).toUpperCase() : 'A';

    return (
        <div className="db-root animate-fade-in">

            {/* ── HEADER ─────────────────────────────── */}
            <header className="db-header">
                {/* Welcome block */}
                <div className="db-welcome">
                    <div className="db-welcome-badge">
                        <FontAwesomeIcon icon={faFire} />
                        <span>Dashboard Overview</span>
                    </div>
                    <h1 className="db-welcome-heading">
                        Welcome back,&nbsp;
                        <span className="db-name-gradient">{userData?.name || 'Alumni'}!</span>
                    </h1>
                    <p className="db-welcome-sub">
                        Here's what's happening in your network today.
                    </p>
                </div>

                {/* Quick Stats strip */}
                <div className="db-stats-strip">
                    <StatCard icon={faRocket}   label="My Requests" value={stats.requests}      colorClass="db-sc-blue"   glowClass="db-glow-blue"   />
                    <StatCard icon={faComments} label="Posts"        value={stats.posts}         colorClass="db-sc-indigo" glowClass="db-glow-indigo" />
                    <StatCard icon={faBell}     label="Alerts"       value={stats.notifications} colorClass="db-sc-rose"   glowClass="db-glow-rose"   />
                </div>
            </header>

            {/* ── MAIN GRID ───────────────────────────── */}
            <div className="db-main-grid">

                {/* ── LEFT COLUMN ── */}
                <div className="db-col-left">

                    {/* Quick Actions Row */}
                    <section className="db-section">
                        <h2 className="db-section-title">
                            <span className="db-section-icon db-icon-violet"><FontAwesomeIcon icon={faLightbulb} /></span>
                            Quick Actions
                        </h2>
                        <div className="db-actions-grid">
                            <ActionCard icon={faUserGraduate} title="Browse Mentors"   desc="Find your next mentor"         href="/mentorship" color="db-ac-blue"   />
                            <ActionCard icon={faBriefcase}    title="Explore Jobs"     desc="Latest opportunities"          href="/jobs"       color="db-ac-green"  />
                            <ActionCard icon={faComments}     title="Community"        desc="Join the conversation"         href="/"           color="db-ac-violet" />
                            <ActionCard icon={faNetworkWired} title="Alumni Network"   desc="Expand your connections"       href="/"           color="db-ac-amber"  />
                        </div>
                    </section>

                    {/* Mentorship Status Widget */}
                    <section className="db-widget db-widget-mentorship">
                        {/* Decorative blob */}
                        <div className="db-widget-blob" />

                        <div className="relative z-10">
                            <div className="db-widget-header">
                                <h3 className="db-widget-title">
                                    <span className="db-wt-icon db-icon-blue">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                    </span>
                                    Mentorship Status
                                </h3>
                                <button
                                    onClick={() => window.location.href = '/mentorship'}
                                    className="db-widget-action db-action-blue"
                                    id="view-mentorship-btn"
                                >
                                    View All <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>

                            <p className="db-widget-desc">
                                You have{' '}
                                <strong className="db-highlight">{stats.requests}</strong>{' '}
                                active mentorship interactions.
                            </p>

                            {/* Progress bars */}
                            <div className="db-progress-panel">
                                <div className="db-progress-row">
                                    <div className="db-progress-meta">
                                        <span>Completed Sessions</span>
                                        <span className="db-progress-pct">60%</span>
                                    </div>
                                    <div className="db-progress-track">
                                        <div className="db-progress-fill db-fill-blue" style={{ width: '60%' }} />
                                    </div>
                                </div>
                                <div className="db-progress-row">
                                    <div className="db-progress-meta">
                                        <span>Profile Strength</span>
                                        <span className="db-progress-pct">85%</span>
                                    </div>
                                    <div className="db-progress-track">
                                        <div className="db-progress-fill db-fill-emerald" style={{ width: '85%' }} />
                                    </div>
                                </div>
                                <div className="db-progress-row">
                                    <div className="db-progress-meta">
                                        <span>Network Engagement</span>
                                        <span className="db-progress-pct">42%</span>
                                    </div>
                                    <div className="db-progress-track">
                                        <div className="db-progress-fill db-fill-violet" style={{ width: '42%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Alerts Widget */}
                    <section className="db-widget">
                        <div className="db-widget-header">
                            <h3 className="db-widget-title">
                                <span className="db-wt-icon db-icon-rose">
                                    <FontAwesomeIcon icon={faBell} />
                                </span>
                                Recent Alerts
                            </h3>
                            {stats.notifications > 0 && (
                                <span className="db-badge-rose">{stats.notifications} New</span>
                            )}
                        </div>

                        <div className="db-notif-list">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 4).map(n => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleMarkRead(n._id)}
                                        className={`db-notif-item ${n.isRead ? 'db-notif-read' : 'db-notif-unread'}`}
                                    >
                                        <div className="db-notif-content">
                                            {!n.isRead && <div className="db-notif-dot" />}
                                            <p className="db-notif-text">{n.message}</p>
                                            <span className="db-notif-time">
                                                {new Date(n.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="db-empty-state">
                                    <div className="db-empty-icon">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    </div>
                                    <p className="db-empty-title">You're all caught up!</p>
                                    <p className="db-empty-sub">No new alerts at the moment.</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 4 && (
                            <button className="db-view-all-btn">
                                View all notifications <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )}
                    </section>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="db-col-right">

                    {/* Profile Widget */}
                    <section className="db-profile-card">
                        {/* Animated orbs */}
                        <div className="db-profile-orb db-orb-1" />
                        <div className="db-profile-orb db-orb-2" />

                        <div className="db-profile-inner">
                            <div className="db-profile-topbar">
                                <span className="db-profile-label">
                                    <FontAwesomeIcon icon={faStar} /> Profile
                                </span>
                                <button
                                    onClick={() => window.location.href = '/profile'}
                                    className="db-profile-edit-btn"
                                    id="edit-profile-btn"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="db-avatar-wrap">
                                <div className="db-avatar">
                                    {initials}
                                </div>
                                <div className="db-avatar-ring" />
                            </div>

                            <h4 className="db-profile-name">{userData?.name || 'Alumni User'}</h4>
                            <p className="db-profile-role">
                                {userData?.currentRole || userData?.role || 'ConnectAlum Member'}
                            </p>

                            <div className="db-profile-completion">
                                <div className="db-completion-label">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400" />
                                    <span>85% Profile Complete</span>
                                </div>
                                <div className="db-completion-track">
                                    <div className="db-completion-fill" style={{ width: '85%' }} />
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="db-profile-mini-stats">
                                <div className="db-mini-stat">
                                    <span className="db-mini-stat-val">{stats.requests}</span>
                                    <span className="db-mini-stat-lbl">Mentees</span>
                                </div>
                                <div className="db-mini-divider" />
                                <div className="db-mini-stat">
                                    <span className="db-mini-stat-val">{stats.posts}</span>
                                    <span className="db-mini-stat-lbl">Posts</span>
                                </div>
                                <div className="db-mini-divider" />
                                <div className="db-mini-stat">
                                    <span className="db-mini-stat-val">4.9</span>
                                    <span className="db-mini-stat-lbl">Rating</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Match Jobs Widget */}
                    <section className="db-widget">
                        <div className="db-widget-header">
                            <h3 className="db-widget-title">
                                <span className="db-wt-icon db-icon-emerald">
                                    <FontAwesomeIcon icon={faBriefcase} />
                                </span>
                                Match Jobs
                            </h3>
                            <button
                                onClick={() => window.location.href = '/jobs'}
                                className="db-widget-action db-action-slate"
                                id="explore-jobs-btn"
                            >
                                Explore <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>

                        <div className="db-job-list">
                            {[
                                { letter: 'G', title: 'Software Engineer', sub: 'Google • Remote',   color: 'db-job-g' },
                                { letter: 'M', title: 'Product Designer',  sub: 'Meta • NYC',        color: 'db-job-m' },
                                { letter: 'A', title: 'Data Scientist',    sub: 'Amazon • Hybrid',   color: 'db-job-a' },
                            ].map((job, i) => (
                                <div key={i} className="db-job-item">
                                    <div className={`db-job-logo ${job.color}`}>{job.letter}</div>
                                    <div className="db-job-info">
                                        <h4 className="db-job-title">{job.title}</h4>
                                        <span className="db-job-sub">{job.sub}</span>
                                    </div>
                                    <button className="db-job-apply-btn">Apply</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Network Highlights */}
                    <section className="db-widget db-network-widget">
                        <div className="db-widget-header">
                            <h3 className="db-widget-title">
                                <span className="db-wt-icon db-icon-amber">
                                    <FontAwesomeIcon icon={faChartPie} />
                                </span>
                                Network Stats
                            </h3>
                        </div>
                        <div className="db-network-grid">
                            {[
                                { value: '1,500+', label: 'Alumni Connected', icon: '🎓' },
                                { value: '200+',   label: 'Startups Founded', icon: '🚀' },
                                { value: '85%',    label: 'Career Growth',    icon: '📈' },
                                { value: '4.9★',   label: 'Network Rating',   icon: '⭐' },
                            ].map((item, i) => (
                                <div key={i} className="db-network-stat">
                                    <span className="db-network-icon">{item.icon}</span>
                                    <span className="db-network-val">{item.value}</span>
                                    <span className="db-network-lbl">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
