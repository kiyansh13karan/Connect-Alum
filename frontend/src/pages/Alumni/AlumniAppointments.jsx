import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

/* ── Status config ─────────────────────────────────────────── */
const STATUS = {
    pending:  { label: 'Pending',  bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' },
    approved: { label: 'Approved', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
    rejected: { label: 'Rejected', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
    completed:{ label: 'Completed',bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', dot: '#64748b' },
};

/* ── Helper: format date ─────────────────────────────────────── */
const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ── Avatar initials ─────────────────────────────────────────── */
const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_PALETTE = ['#6366f1','#8b5cf6','#0ea5e9','#10b981','#f59e0b','#ef4444'];
const avatarColor = (name = '') =>
    AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];

/* ══════════════════════════════════════════════════════════════ */
const AlumniAppointments = () => {
    const { url, token } = useContext(StoreContext);
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // appointmentId
    const [activeCall, setActiveCall] = useState(null); // meetingLink for in-page call

    useEffect(() => { fetchAppointments(); }, [url, token]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/alumni-role/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) setAppointments(res.data.appointments);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            setActionLoading(id + status);
            const res = await axios.patch(
                `${url}/api/alumni-role/appointments/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setAppointments(prev =>
                    prev.map(a => a._id === id ? { ...a, ...res.data.appointment } : a)
                );
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed.');
        } finally {
            setActionLoading(null);
        }
    };

    /* ── Filtered list ── */
    const filtered = filter === 'all'
        ? appointments
        : appointments.filter(a => a.status === filter);

    const counts = {
        all: appointments.length,
        pending:  appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
        rejected: appointments.filter(a => a.status === 'rejected').length,
    };

    /* ──────────────────────────────────────────────────────────── */
    return (
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                    }}>📅</div>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Student Appointments
                        </h1>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '3px 0 0 0' }}>
                            Manage your upcoming sessions &amp; video calls
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchAppointments}
                    style={{
                        padding: '9px 18px', borderRadius: '10px',
                        backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0',
                        fontSize: '13px', fontWeight: 600, color: '#475569',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ── Filter Tabs ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button
                        key={f}
                        id={`appt-filter-${f}`}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 18px', borderRadius: '999px',
                            border: filter === f ? '2px solid #6366f1' : '2px solid #e5e7eb',
                            backgroundColor: filter === f ? '#6366f1' : '#fff',
                            color: filter === f ? '#fff' : '#374151',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span style={{
                            padding: '1px 8px', borderRadius: '999px',
                            backgroundColor: filter === f ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                            fontSize: '11px', fontWeight: 700,
                        }}>
                            {counts[f] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                    <p style={{ fontWeight: 600 }}>Loading appointments…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '80px 24px',
                    backgroundColor: '#f9fafb', borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#374151', margin: 0 }}>
                        No {filter === 'all' ? '' : filter} appointments
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>
                        {filter === 'all'
                            ? 'When students book sessions with you, they will appear here.'
                            : `No appointments with status "${filter}" yet.`}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filtered.map(app => {
                        const badge = STATUS[app.status] || STATUS.pending;
                        const studentName = app.studentId?.name || 'Unknown Student';
                        const isLoading = actionLoading === app._id + 'approved' || actionLoading === app._id + 'rejected';

                        return (
                            <div
                                key={app._id}
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    padding: '22px 24px',
                                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    display: 'flex', flexDirection: 'column', gap: '14px',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'}
                            >
                                {/* ── Card Top ── */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                    {/* Student info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            backgroundColor: avatarColor(studentName),
                                            color: '#fff', fontSize: '16px', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {initials(studentName)}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                                                {studentName}
                                            </h3>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                                                {app.studentId?.email || ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 12px', borderRadius: '999px',
                                        backgroundColor: badge.bg, color: badge.color,
                                        border: `1px solid ${badge.border}`,
                                        fontSize: '12px', fontWeight: 700, flexShrink: 0,
                                    }}>
                                        <span style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            backgroundColor: badge.dot, display: 'inline-block',
                                        }} />
                                        {badge.label}
                                    </span>
                                </div>

                                {/* ── Topic + Details ── */}
                                <div style={{
                                    backgroundColor: '#f8fafc', borderRadius: '12px',
                                    padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '16px' }}>💡</span>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                                            {app.topic}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            📅 <strong>{fmtDate(app.date)}</strong>
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            🕐 <strong>{app.time}</strong>
                                        </span>
                                    </div>
                                    {app.description && (
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                            📝 {app.description}
                                        </p>
                                    )}

                                    {/* ── Resume attached by student ── */}
                                    {app.resumeUrl && (
                                        <div style={{
                                            marginTop: '4px',
                                            padding: '10px 14px',
                                            backgroundColor: '#eff6ff',
                                            border: '1px solid #bfdbfe',
                                            borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                        }}>
                                            <span style={{ fontSize: '20px', flexShrink: 0 }}>
                                                {app.resumeName?.endsWith('.pdf') ? '📄' : '📝'}
                                            </span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1d4ed8' }}>
                                                    Student's Resume
                                                </p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {app.resumeName || 'resume'}
                                                </p>
                                            </div>
                                            <a
                                                href={app.resumeUrl}
                                                download={app.resumeName || 'resume'}
                                                style={{
                                                    padding: '6px 14px',
                                                    backgroundColor: '#2563eb',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    fontSize: '12px', fontWeight: 700,
                                                    textDecoration: 'none',
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    flexShrink: 0,
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                                            >
                                                ⬇️ Download
                                            </a>
                                        </div>
                                    )}

                                    {/* ── Passport Photo attached by student ── */}
                                    {app.passportPhotoUrl && (
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '10px 14px',
                                            backgroundColor: '#f0fdf4',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                        }}>
                                            {/* Thumbnail */}
                                            <img
                                                src={app.passportPhotoUrl}
                                                alt="passport"
                                                style={{
                                                    width: '52px', height: '52px',
                                                    borderRadius: '8px', objectFit: 'cover',
                                                    flexShrink: 0,
                                                    border: '2px solid #86efac',
                                                }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#15803d' }}>
                                                    Student's Passport Photo
                                                </p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {app.passportPhotoName || 'photo'}
                                                </p>
                                            </div>
                                            <a
                                                href={app.passportPhotoUrl}
                                                download={app.passportPhotoName || 'passport-photo'}
                                                style={{
                                                    padding: '6px 14px',
                                                    backgroundColor: '#16a34a',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    fontSize: '12px', fontWeight: 700,
                                                    textDecoration: 'none',
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    flexShrink: 0,
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#15803d'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#16a34a'}
                                            >
                                                ⬇️ Download
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* ── Actions ── */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {app.status === 'pending' && (
                                        <>
                                            <button
                                                id={`approve-appt-${app._id}`}
                                                disabled={isLoading}
                                                onClick={() => handleAction(app._id, 'approved')}
                                                style={{
                                                    padding: '9px 20px', borderRadius: '10px',
                                                    backgroundColor: '#22c55e', color: '#fff',
                                                    border: 'none', fontSize: '13px', fontWeight: 700,
                                                    cursor: isLoading ? 'wait' : 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    opacity: isLoading ? 0.7 : 1,
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#16a34a'; }}
                                                onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#22c55e'; }}
                                            >
                                                ✓ Approve &amp; Generate Call Link
                                            </button>
                                            <button
                                                id={`reject-appt-${app._id}`}
                                                disabled={isLoading}
                                                onClick={() => handleAction(app._id, 'rejected')}
                                                style={{
                                                    padding: '9px 20px', borderRadius: '10px',
                                                    backgroundColor: '#fff', color: '#ef4444',
                                                    border: '1px solid #fca5a5', fontSize: '13px', fontWeight: 700,
                                                    cursor: isLoading ? 'wait' : 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    opacity: isLoading ? 0.7 : 1,
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                                onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#fff'; }}
                                            >
                                                ✕ Decline
                                            </button>
                                        </>
                                    )}

                                    {app.status === 'approved' && app.meetingLink && (
                                        <>
                                            <button
                                                id={`join-call-alumni-${app._id}`}
                                                onClick={() => setActiveCall(app.meetingLink)}
                                                style={{
                                                    padding: '9px 20px', borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                    color: '#fff', border: 'none',
                                                    fontSize: '13px', fontWeight: 700,
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    boxShadow: '0 3px 10px rgba(99,102,241,0.4)',
                                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.5)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(99,102,241,0.4)'; }}
                                            >
                                                🎥 Join Video Call
                                            </button>
                                            <a
                                                href={app.meetingLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    fontSize: '12px', color: '#6b7280',
                                                    textDecoration: 'underline', wordBreak: 'break-all',
                                                }}
                                            >
                                                {app.meetingLink}
                                            </a>
                                        </>
                                    )}

                                    {app.status === 'rejected' && (
                                        <button
                                            onClick={() => handleAction(app._id, 'pending')}
                                            style={{
                                                padding: '7px 16px', borderRadius: '8px',
                                                backgroundColor: '#f1f5f9', color: '#475569',
                                                border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            ↩ Undo Rejection
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── In-page Jitsi Video Call Modal ── */}
            {activeCall && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        width: '92vw', maxWidth: '1100px',
                        backgroundColor: '#111827', borderRadius: '20px',
                        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Modal header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 20px',
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <span style={{ fontSize: '20px' }}>🎥</span>
                                <span style={{ fontWeight: 700, fontSize: '15px' }}>Live Video Call — ConnectAlum</span>
                            </div>
                            <button
                                id="close-video-call"
                                onClick={() => setActiveCall(null)}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
                                    border: 'none', borderRadius: '8px', padding: '6px 14px',
                                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                }}
                            >
                                ✕ End &amp; Close
                            </button>
                        </div>
                        {/* Jitsi iFrame */}
                        <iframe
                            src={activeCall + '?minimal=1'}
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            style={{ width: '100%', height: '75vh', border: 'none' }}
                            title="Video Call"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniAppointments;
