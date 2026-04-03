import React, { useState } from 'react';
import './AlumniPages.css';

const INITIAL_REQUESTS = [
    {
        id: 1, name: 'Ananya Singh', course: 'B.Tech CSE – 3rd Year', avatar: 'A',
        message: 'Hi! I admire your journey at Google. I\'d love guidance on cracking SWE interviews and building a strong profile.',
        college: 'IIIT Delhi', status: 'pending',
    },
    {
        id: 2, name: 'Rahul Sharma', course: 'MBA – 1st Year', avatar: 'R',
        message: 'I am transitioning from engineering to product management. Would love to understand your experience and get some advice.',
        college: 'IIM Ahmedabad', status: 'pending',
    },
    {
        id: 3, name: 'Priya Mehta', course: 'M.Tech AI – 2nd Year', avatar: 'P',
        message: 'Your work in ML at Google is inspiring. Could you spare some time to review my research direction?',
        college: 'IIT Bombay', status: 'accepted',
    },
    {
        id: 4, name: 'Varun Kapoor', course: 'B.Tech IT – 4th Year', avatar: 'V',
        message: 'Looking for guidance on open source contributions and landing a top-tier internship.',
        college: 'DTU Delhi', status: 'pending',
    },
    {
        id: 5, name: 'Sneha Roy', course: 'B.Sc CS – 2nd Year', avatar: 'S',
        message: 'I am exploring career paths in data science. Would really appreciate a 30-min conversation.',
        college: 'Jadavpur University', status: 'rejected',
    },
];

const STATUS_META = {
    pending:  { label: 'Pending',  cls: 'ap-status-pending'  },
    accepted: { label: 'Accepted', cls: 'ap-status-accepted' },
    rejected: { label: 'Rejected', cls: 'ap-status-rejected' },
};

const AVATAR_COLORS = ['ap-av-blue', 'ap-av-violet', 'ap-av-green', 'ap-av-amber', 'ap-av-rose'];

const StudentRequests = () => {
    const [requests, setRequests] = useState(INITIAL_REQUESTS);
    const [filter, setFilter] = useState('all');

    const update = (id, status) => setRequests(r => r.map(x => x.id === id ? { ...x, status } : x));

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    const counts = {
        all: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        accepted: requests.filter(r => r.status === 'accepted').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Student Requests</h1>
                    <p className="ap-page-sub">Students requesting your mentorship</p>
                </div>
                <div className="ap-badge-count">{counts.pending} pending</div>
            </div>

            {/* Filter tabs */}
            <div className="ap-filter-tabs">
                {['all', 'pending', 'accepted', 'rejected'].map(f => (
                    <button
                        key={f}
                        id={`req-filter-${f}`}
                        onClick={() => setFilter(f)}
                        className={`ap-filter-tab ${filter === f ? 'ap-filter-active' : ''}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="ap-filter-count">{counts[f]}</span>
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="ap-requests-grid">
                {filtered.length === 0 && (
                    <div className="ap-empty-card">
                        <p className="ap-empty-icon">📭</p>
                        <p className="ap-empty-title">No {filter === 'all' ? '' : filter} requests</p>
                        <p className="ap-empty-sub">Check back later</p>
                    </div>
                )}

                {filtered.map((req, i) => (
                    <div key={req.id} className="ap-req-card">
                        <div className="ap-req-top">
                            <div className={`ap-req-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                {req.avatar}
                            </div>
                            <div className="ap-req-info">
                                <h4 className="ap-req-name">{req.name}</h4>
                                <p className="ap-req-course">{req.course}</p>
                                <p className="ap-req-college">🏫 {req.college}</p>
                            </div>
                            <span className={`ap-status-badge ${STATUS_META[req.status].cls}`}>
                                {STATUS_META[req.status].label}
                            </span>
                        </div>

                        <div className="ap-req-message">
                            <p className="ap-req-msg-label">Message</p>
                            <p className="ap-req-msg-text">"{req.message}"</p>
                        </div>

                        {req.status === 'pending' && (
                            <div className="ap-req-actions">
                                <button
                                    id={`accept-${req.id}`}
                                    className="ap-btn-accept"
                                    onClick={() => update(req.id, 'accepted')}
                                >
                                    ✓ Accept
                                </button>
                                <button
                                    id={`reject-${req.id}`}
                                    className="ap-btn-reject"
                                    onClick={() => update(req.id, 'rejected')}
                                >
                                    ✕ Reject
                                </button>
                            </div>
                        )}

                        {req.status === 'accepted' && (
                            <div className="ap-req-accepted-msg">
                                ✅ You accepted this request. Student will be notified.
                            </div>
                        )}

                        {req.status === 'rejected' && (
                            <div className="ap-req-rejected-msg">
                                You declined this request.
                                <button
                                    className="ap-undo-btn"
                                    onClick={() => update(req.id, 'pending')}
                                >
                                    Undo
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentRequests;
