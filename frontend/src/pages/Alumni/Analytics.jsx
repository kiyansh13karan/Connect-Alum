import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './AlumniPages.css';

/* ── Animated counter hook ───────────────────────────── */
const useCountUp = (target, duration = 1200) => {
    const [value, setValue] = useState(0);
    const startTime = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (target === 0) { setValue(0); return; }
        startTime.current = null;
        const step = (ts) => {
            if (!startTime.current) startTime.current = ts;
            const progress = Math.min((ts - startTime.current) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(Math.round(eased * target));
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);

    return value;
};

/* ── Stat Card with animated number ──────────────────── */
const StatCard = ({ icon, label, value, color, delay = 0 }) => {
    const animated = useCountUp(value);
    return (
        <div
            className={`ap-analytics-card ${color}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="ap-analytics-icon">{icon}</div>
            <div className="ap-analytics-body">
                <p className="ap-analytics-label">{label}</p>
                <h3 className="ap-analytics-value">{animated}</h3>
            </div>
            <div className="ap-analytics-shine" />
        </div>
    );
};

/* ── Time formatter ──────────────────────────────────── */
const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/* ── Skeleton loader ──────────────────────────────────── */
const Skeleton = ({ height = 100, radius = 16 }) => (
    <div style={{
        height, borderRadius: radius,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'apShimmer 1.5s infinite',
    }} />
);

/* ── Main Analytics Component ────────────────────────── */
const Analytics = () => {
    const { url, token } = useContext(StoreContext);
    const [stats, setStats] = useState({ studentsConnected: 0, pendingRequests: 0, messagesCount: 0, opportunitiesCount: 0, appointmentsCount: 0 });
    const [activity, setActivity] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    const fetchAnalytics = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${url}/api/alumni-role/analytics`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setStats(res.data.stats);
                setActivity(res.data.recentActivity || []);
                setWeeklyData(res.data.weeklyData || []);
                setLastRefresh(new Date());
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnalytics(); }, [url, token]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const maxBar = Math.max(...weeklyData.map(d => d.messages + d.requests), 1);

    const statCards = [
        { icon: '🎓', label: 'Students Connected', value: stats.studentsConnected, color: 'ap-analytics-blue',   delay: 0   },
        { icon: '🤝', label: 'Mentorship Requests',value: stats.pendingRequests,   color: 'ap-analytics-violet', delay: 80  },
        { icon: '💬', label: 'Total Messages',      value: stats.messagesCount,     color: 'ap-analytics-amber',  delay: 160 },
        { icon: '📢', label: 'Opportunities Posted',value: stats.opportunitiesCount,color: 'ap-analytics-green',  delay: 240 },
    ];

    return (
        <div className="ap-page">
            {/* Header */}
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Analytics</h1>
                    <p className="ap-page-sub">Your real impact at a glance</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefresh && (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Updated {timeAgo(lastRefresh)}
                        </span>
                    )}
                    <button
                        className="ap-btn-ghost"
                        onClick={() => { setLoading(true); fetchAnalytics(); }}
                        id="analytics-refresh-btn"
                    >
                        🔄 Refresh
                    </button>
                    <span className="ap-period-badge">Live Data</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="ap-analytics-grid">
                {loading
                    ? [0,1,2,3].map(i => <Skeleton key={i} height={110} />)
                    : statCards.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))
                }
            </div>

            {/* Additional stat strip */}
            {!loading && (
                <div className="ap-analytics-strip ap-mt-sm" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="ap-analytics-mini-card">
                        <span className="ap-analytics-mini-icon">📅</span>
                        <div>
                            <p className="ap-analytics-mini-val">{stats.appointmentsCount}</p>
                            <p className="ap-analytics-mini-lbl">Appointments</p>
                        </div>
                    </div>
                    <div className="ap-analytics-mini-card">
                        <span className="ap-analytics-mini-icon">🌐</span>
                        <div>
                            <p className="ap-analytics-mini-val">{stats.studentsConnected + stats.pendingRequests}</p>
                            <p className="ap-analytics-mini-lbl">Total Interactions</p>
                        </div>
                    </div>
                    <div className="ap-analytics-mini-card">
                        <span className="ap-analytics-mini-icon">📈</span>
                        <div>
                            <p className="ap-analytics-mini-val">
                                {stats.studentsConnected + stats.pendingRequests > 0
                                    ? Math.round((stats.studentsConnected / (stats.studentsConnected + stats.pendingRequests)) * 100)
                                    : 0}%
                            </p>
                            <p className="ap-analytics-mini-lbl">Acceptance Rate</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Activity Bar Chart */}
            <div className="ap-card ap-mt">
                <h3 className="ap-card-title">📈 Weekly Activity (Last 7 Days)</h3>
                {loading ? (
                    <Skeleton height={180} radius={12} />
                ) : (
                    <>
                        <div className="ap-bar-legend">
                            <span className="ap-legend-dot ap-legend-violet" /> Requests
                            <span className="ap-legend-dot ap-legend-blue" style={{ marginLeft: '1rem' }} /> Messages
                        </div>
                        <div className="ap-bar-chart">
                            {weeklyData.map((d, i) => (
                                <div key={i} className="ap-bar-col">
                                    <div className="ap-bar-stack" style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                                        <div
                                            className="ap-bar ap-bar-blue"
                                            style={{
                                                height: `${(d.messages / maxBar) * 120}px`,
                                                minHeight: d.messages > 0 ? '4px' : '0',
                                                animationDelay: `${i * 80}ms`
                                            }}
                                            title={`${d.messages} messages`}
                                        />
                                        <div
                                            className="ap-bar ap-bar-violet"
                                            style={{
                                                height: `${(d.requests / maxBar) * 120}px`,
                                                minHeight: d.requests > 0 ? '4px' : '0',
                                                animationDelay: `${i * 80 + 40}ms`
                                            }}
                                            title={`${d.requests} requests`}
                                        />
                                    </div>
                                    <span className="ap-bar-day">{d.day}</span>
                                </div>
                            ))}
                        </div>
                        {weeklyData.every(d => d.messages === 0 && d.requests === 0) && (
                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>
                                No activity this week yet. Connect with more students!
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Recent Activity Feed */}
            <div className="ap-card ap-mt">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 className="ap-card-title" style={{ margin: 0 }}>🕐 Recent Activity</h3>
                    {activity.length > 0 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
                            {activity.length} events
                        </span>
                    )}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[0,1,2,3].map(i => <Skeleton key={i} height={60} radius={12} />)}
                    </div>
                ) : activity.length === 0 ? (
                    <div className="ap-empty-card">
                        <p className="ap-empty-icon">📊</p>
                        <p className="ap-empty-title">No activity yet</p>
                        <p className="ap-empty-sub">Accept mentorship requests and start conversations to see activity here.</p>
                    </div>
                ) : (
                    <div className="ap-activity-list">
                        {activity.map((a, i) => (
                            <div
                                key={i}
                                className="ap-activity-item"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div
                                    className="ap-activity-icon"
                                    style={{ background: `${a.color}18`, color: a.color }}
                                >
                                    {a.icon}
                                </div>
                                <div className="ap-activity-text">
                                    <p>{a.text}</p>
                                    <span className="ap-activity-time">{timeAgo(a.time)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
