import React from 'react';
import './AlumniPages.css';

const STAT_CARDS = [
    { icon: '🎓', label: 'Students Connected', value: '24', delta: '+3 this week',  color: 'ap-analytics-blue' },
    { icon: '🤝', label: 'Mentorship Requests', value: '11', delta: '+2 this week',  color: 'ap-analytics-violet' },
    { icon: '👁️', label: 'Profile Views',       value: '186', delta: '+28 this week', color: 'ap-analytics-amber' },
    { icon: '📢', label: 'Posted Opportunities', value: '7',  delta: '+1 this week',  color: 'ap-analytics-green' },
];

const ACTIVITY = [
    { icon: '✅', text: 'Ananya Singh accepted your mentorship', time: '2 hours ago',  color: '#10b981' },
    { icon: '🆕', text: 'New request from Varun Kapoor',         time: '5 hours ago',  color: '#6366f1' },
    { icon: '📢', text: 'Your "Frontend Engineer" post got 14 applicants', time: '1 day ago', color: '#f59e0b' },
    { icon: '🖥️', text: '"Cracking FAANG" webinar got 45 RSVPs', time: '2 days ago',  color: '#3b82f6' },
    { icon: '💬', text: 'Priya Mehta sent you a message',        time: '3 days ago',  color: '#8b5cf6' },
    { icon: '👁️', text: 'Your profile was viewed 28 times',      time: 'This week',   color: '#f97316' },
];

const BAR_DATA = [
    { day: 'Mon', views: 22, requests: 1 },
    { day: 'Tue', views: 38, requests: 2 },
    { day: 'Wed', views: 30, requests: 0 },
    { day: 'Thu', views: 45, requests: 3 },
    { day: 'Fri', views: 28, requests: 1 },
    { day: 'Sat', views: 15, requests: 0 },
    { day: 'Sun', views: 8,  requests: 1 },
];

const MAX_VIEWS = 50;

const Analytics = () => (
    <div className="ap-page">
        <div className="ap-page-header">
            <div>
                <h1 className="ap-page-title">Analytics</h1>
                <p className="ap-page-sub">Your impact at a glance</p>
            </div>
            <span className="ap-period-badge">Last 7 days</span>
        </div>

        {/* Stat Cards */}
        <div className="ap-analytics-grid">
            {STAT_CARDS.map((s, i) => (
                <div key={i} className={`ap-analytics-card ${s.color}`}>
                    <div className="ap-analytics-icon">{s.icon}</div>
                    <div className="ap-analytics-body">
                        <p className="ap-analytics-label">{s.label}</p>
                        <h3 className="ap-analytics-value">{s.value}</h3>
                        <span className="ap-analytics-delta">{s.delta}</span>
                    </div>
                    <div className="ap-analytics-shine" />
                </div>
            ))}
        </div>

        {/* Engagement Trend Chart */}
        <div className="ap-card ap-mt">
            <h3 className="ap-card-title">📈 Weekly Engagement</h3>
            <div className="ap-bar-legend">
                <span className="ap-legend-dot ap-legend-blue" /> Profile Views
                <span className="ap-legend-dot ap-legend-violet" style={{ marginLeft: '1rem' }} /> Requests
            </div>
            <div className="ap-bar-chart">
                {BAR_DATA.map((d, i) => (
                    <div key={i} className="ap-bar-col">
                        <div className="ap-bar-stack">
                            <div
                                className="ap-bar ap-bar-blue"
                                style={{ height: `${(d.views / MAX_VIEWS) * 140}px` }}
                                title={`${d.views} views`}
                            />
                            <div
                                className="ap-bar ap-bar-violet"
                                style={{ height: `${d.requests * 20}px` }}
                                title={`${d.requests} requests`}
                            />
                        </div>
                        <span className="ap-bar-day">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="ap-card ap-mt">
            <h3 className="ap-card-title">🕐 Recent Activity</h3>
            <div className="ap-activity-list">
                {ACTIVITY.map((a, i) => (
                    <div key={i} className="ap-activity-item">
                        <div className="ap-activity-icon" style={{ background: `${a.color}18`, color: a.color }}>
                            {a.icon}
                        </div>
                        <div className="ap-activity-text">
                            <p>{a.text}</p>
                            <span className="ap-activity-time">{a.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Analytics;
