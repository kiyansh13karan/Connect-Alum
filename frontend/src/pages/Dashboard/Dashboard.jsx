import React, { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBriefcase, faComments, faBell, faCheckCircle, faClock, faRocket } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { url, token } = useContext(StoreContext);
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({ requests: 0, posts: 0, notifications: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const profileRes = await axios.get(`${url}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(profileRes.data.user);

            // Fetch mentorship requests count
            const mentorRes = await axios.get(`${url}/api/mentorship/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch user's forum posts for stats (simplified)
            const forumRes = await axios.get(`${url}/api/forum`);
            const myPosts = forumRes.data.posts.filter(p => p.authorId._id === profileRes.data.user._id);

            const notifRes = await axios.get(`${url}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifRes.data.notifications);

            setStats({
                requests: mentorRes.data.requests.length,
                posts: myPosts.length,
                notifications: notifRes.data.notifications.filter(n => !n.isRead).length
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await axios.post(`${url}/api/notifications/read`, { notificationId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboardData();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    useEffect(() => {
        if (token) fetchDashboardData();
    }, [token, url]);

    if (loading) return <div className="p-20 text-center">Loading your workspace...</div>;

    return (
        <div className="dashboard-page animate-fade-in">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome back, <span className="highlight">{userData?.name}</span>!</h1>
                    <p>Here's what's happening in your network today.</p>
                </div>
                <div className="quick-stats">
                    <div className="stat-card glass">
                        <FontAwesomeIcon icon={faRocket} className="stat-icon" />
                        <div>
                            <span>My Requests</span>
                            <h3>{stats.requests}</h3>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <FontAwesomeIcon icon={faComments} className="stat-icon" />
                        <div>
                            <span>Posts</span>
                            <h3>{stats.posts}</h3>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <FontAwesomeIcon icon={faBell} className="stat-icon" />
                        <div>
                            <span>Alerts</span>
                            <h3>{stats.notifications}</h3>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid">
                <section className="widget glass mentorship-widget">
                    <div className="widget-header">
                        <h3><FontAwesomeIcon icon={faUserGraduate} /> Mentorship Status</h3>
                        <button onClick={() => window.location.href = '/mentorship'}>View All</button>
                    </div>
                    <div className="widget-body">
                        <p>You have <strong>{stats.requests}</strong> active mentorship interactions.</p>
                        <div className="progress-list">
                            <div className="progress-item">
                                <span>Completed Sessions</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '60%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="widget glass jobs-widget">
                    <div className="widget-header">
                        <h3><FontAwesomeIcon icon={faBriefcase} /> Recommended Jobs</h3>
                        <button onClick={() => window.location.href = '/jobs'}>Explore</button>
                    </div>
                    <div className="widget-body">
                        <div className="mini-job-list">
                            <div className="mini-job">
                                <h4>Software Engineer</h4>
                                <span>Google • Remote</span>
                            </div>
                            <div className="mini-job">
                                <h4>Product Designer</h4>
                                <span>Meta • NYC</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="widget glass profile-widget">
                    <div className="widget-header">
                        <h3>Professional Identity</h3>
                        <button onClick={() => window.location.href = '/profile'}>Edit</button>
                    </div>
                    <div className="widget-body">
                        <div className="profile-summary">
                            <div className="avatar-large">{userData?.name.charAt(0)}</div>
                            <h4>{userData?.name}</h4>
                            <p>{userData?.currentRole || userData?.role}</p>
                            <div className="completion-tag">
                                <FontAwesomeIcon icon={faCheckCircle} /> 85% Profile Complete
                            </div>
                        </div>
                    </div>
                </section>

                <section className="widget glass notifications-widget">
                    <div className="widget-header">
                        <h3><FontAwesomeIcon icon={faBell} /> Recent Alerts</h3>
                        <span>{stats.notifications} New</span>
                    </div>
                    <div className="widget-body">
                        <div className="notif-list">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div key={n._id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`} onClick={() => handleMarkRead(n._id)}>
                                        <div className="notif-point"></div>
                                        <p>{n.message}</p>
                                        <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-notif" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>All caught up!</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
