import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './AlumniPages.css';

const STATUS_META = {
    pending:  { label: 'Pending',  cls: 'ap-status-pending'  },
    accepted: { label: 'Accepted', cls: 'ap-status-accepted' },
    rejected: { label: 'Rejected', cls: 'ap-status-rejected' },
};

const AVATAR_COLORS = ['ap-av-blue', 'ap-av-violet', 'ap-av-green', 'ap-av-amber', 'ap-av-rose'];

/* ── Initials helper ── */
const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

/* ── Format date ── */
const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const StudentRequests = () => {
    const { url, token } = useContext(StoreContext);
    const [requests, setRequests]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [filter, setFilter]       = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => { fetchRequests(); }, [url, token]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/alumni-role/student-requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) setRequests(res.data.requests);
        } catch (err) {
            console.error('Error fetching student requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setActionLoading(id + status);
            const res = await axios.patch(
                `${url}/api/alumni-role/student-requests/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed.');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    const counts = {
        all:      requests.length,
        pending:  requests.filter(r => r.status === 'pending').length,
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="ap-badge-count">{counts.pending} pending</div>
                    <button
                        onClick={fetchRequests}
                        style={{
                            padding: '8px 16px', borderRadius: '8px',
                            backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0',
                            fontSize: '13px', fontWeight: 600, color: '#475569',
                            cursor: 'pointer',
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>
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

            {/* Loading state */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>⏳</div>
                    <p style={{ fontWeight: 600 }}>Loading requests…</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="ap-empty-card">
                    <p className="ap-empty-icon">📭</p>
                    <p className="ap-empty-title">No {filter === 'all' ? '' : filter} requests</p>
                    <p className="ap-empty-sub">
                        {filter === 'all'
                            ? 'When students send you connection requests, they will appear here.'
                            : 'Check back later'}
                    </p>
                </div>
            )}

            {/* Cards */}
            {!loading && (
                <div className="ap-requests-grid">
                    {filtered.map((req, i) => {
                        const studentName = req.studentId?.name || 'Unknown Student';
                        const isLoading = actionLoading === req._id + 'accepted' || actionLoading === req._id + 'rejected';

                        return (
                            <div key={req._id} className="ap-req-card">
                                <div className="ap-req-top">
                                    <div className={`ap-req-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                        {initials(studentName)}
                                    </div>
                                    <div className="ap-req-info">
                                        <h4 className="ap-req-name">{studentName}</h4>
                                        <p className="ap-req-course">
                                            {req.studentId?.currentRole || req.studentId?.email || '—'}
                                        </p>
                                        {req.studentId?.company && (
                                            <p className="ap-req-college">🏢 {req.studentId.company}</p>
                                        )}
                                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                                            📅 {fmtDate(req.createdAt)}
                                        </p>
                                    </div>
                                    <span className={`ap-status-badge ${STATUS_META[req.status]?.cls || 'ap-status-pending'}`}>
                                        {STATUS_META[req.status]?.label || req.status}
                                    </span>
                                </div>

                                {req.message && (
                                    <div className="ap-req-message">
                                        <p className="ap-req-msg-label">Message</p>
                                        <p className="ap-req-msg-text">"{req.message}"</p>
                                    </div>
                                )}

                                {req.status === 'pending' && (
                                    <div className="ap-req-actions">
                                        <button
                                            id={`accept-${req._id}`}
                                            className="ap-btn-accept"
                                            disabled={isLoading}
                                            style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                                            onClick={() => updateStatus(req._id, 'accepted')}
                                        >
                                            ✓ Accept
                                        </button>
                                        <button
                                            id={`reject-${req._id}`}
                                            className="ap-btn-reject"
                                            disabled={isLoading}
                                            style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                                            onClick={() => updateStatus(req._id, 'rejected')}
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}

                                {req.status === 'accepted' && (
                                    <div className="ap-req-accepted-msg">
                                        ✅ You accepted this request. Student can now book appointments with you.
                                    </div>
                                )}

                                {req.status === 'rejected' && (
                                    <div className="ap-req-rejected-msg">
                                        You declined this request.
                                        <button
                                            className="ap-undo-btn"
                                            onClick={() => updateStatus(req._id, 'pending')}
                                        >
                                            Undo
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentRequests;
