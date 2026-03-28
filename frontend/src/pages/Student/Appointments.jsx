import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck, faCalendarPlus, faUserTie,
    faCalendarAlt, faClock, faLink, faCheckCircle,
    faHourglassHalf, faTimesCircle, faVideo,
} from '@fortawesome/free-solid-svg-icons';

/* ── Status badge config ─────────────────────────────────── */
const statusBadge = {
    approved: { label: 'Approved', icon: faCheckCircle,    bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    pending:  { label: 'Pending',  icon: faHourglassHalf, bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    rejected: { label: 'Rejected', icon: faTimesCircle,   bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
};

/* ── Input style helper ──────────────────────────────────── */
const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.15s, background 0.15s',
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
};

/* ── Main Component ──────────────────────────────────────── */
const Appointments = () => {
    const { url, token } = useContext(StoreContext);
    const [appointments, setAppointments] = useState([]);
    const [connectedMentors, setConnectedMentors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        alumniId: '', date: '', time: '', topic: '', description: '',
    });

    useEffect(() => {
        fetchAppointments();
        fetchConnectedMentors();
    }, [url, token]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(url + '/api/student/appointments', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setAppointments(res.data.appointments);
        } catch (err) { console.error('Error fetching appointments:', err); }
    };

    const fetchConnectedMentors = async () => {
        try {
            const res = await axios.get(url + '/api/student/connections', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const accepted = res.data.requests.filter(r => r.status === 'accepted');
                setConnectedMentors(accepted.map(r => r.alumniId));
            }
        } catch (err) { console.error('Error fetching mentors:', err); }
    };

    const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(url + '/api/student/book-appointment', formData, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setSubmitted(true);
                setFormData({ alumniId: '', date: '', time: '', topic: '', description: '' });
                fetchAppointments();
                setTimeout(() => setSubmitted(false), 4000);
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    const noMentors = connectedMentors.length === 0;

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: '#eff6ff', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                    <FontAwesomeIcon icon={faVideo} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Voice Calls &amp; Appointments
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Book 1-on-1 sessions with your connected mentors.
                    </p>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

                {/* ── Left: Booking Form ── */}
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    padding: '28px',
                }}>
                    {/* Form header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                            <FontAwesomeIcon icon={faCalendarPlus} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Book New Appointment</h2>
                    </div>

                    {/* Success toast */}
                    {submitted && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
                            fontSize: '13px', fontWeight: 600, color: '#15803d',
                        }}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Appointment request sent! Email notification dispatched.
                        </div>
                    )}

                    <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                        {/* Mentor select */}
                        <div>
                            <label style={labelStyle}>
                                <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '6px', color: '#9ca3af' }} />
                                Select Connected Mentor *
                            </label>
                            <select
                                name="alumniId"
                                value={formData.alumniId}
                                onChange={handleInputChange}
                                required
                                style={{ ...inputStyle, cursor: noMentors ? 'not-allowed' : 'pointer' }}
                                disabled={noMentors}
                                onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                            >
                                <option value="" disabled>
                                    {noMentors ? 'No connected mentors yet' : 'Choose a mentor'}
                                </option>
                                {connectedMentors.map((m, i) => (
                                    <option key={i} value={m._id}>{m.name} — {m.company || 'Alumni'}</option>
                                ))}
                            </select>
                            {noMentors && (
                                <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FontAwesomeIcon icon={faUserTie} style={{ fontSize: '11px' }} />
                                    Connect with a mentor first from the <strong style={{ marginLeft: '4px' }}>Mentors</strong> page.
                                </p>
                            )}
                        </div>

                        {/* Date + Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '6px', color: '#9ca3af' }} />
                                    Date *
                                </label>
                                <input
                                    type="date" name="date" required
                                    value={formData.date} onChange={handleInputChange}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px', color: '#9ca3af' }} />
                                    Time *
                                </label>
                                <input
                                    type="time" name="time" required
                                    value={formData.time} onChange={handleInputChange}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                                />
                            </div>
                        </div>

                        {/* Topic */}
                        <div>
                            <label style={labelStyle}>Topic *</label>
                            <input
                                type="text" name="topic" required
                                value={formData.topic} onChange={handleInputChange}
                                placeholder="E.g., Resume Review, Mock Interview, Career Advice"
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>Agenda / Description *</label>
                            <textarea
                                name="description" required rows={4}
                                value={formData.description} onChange={handleInputChange}
                                placeholder="Briefly describe what you'd like to discuss in this session..."
                                style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                                onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={noMentors}
                            style={{
                                padding: '12px 0',
                                backgroundColor: noMentors ? '#e5e7eb' : '#2563eb',
                                color: noMentors ? '#9ca3af' : '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: noMentors ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (!noMentors) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                            onMouseLeave={e => { if (!noMentors) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                        >
                            <FontAwesomeIcon icon={faCalendarPlus} />
                            {noMentors ? 'Connect with a Mentor First' : 'Request Appointment'}
                        </button>
                    </form>
                </div>

                {/* ── Right: Appointment History ── */}
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                            </div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>My Appointments</h2>
                        </div>
                        {appointments.length > 0 && (
                            <span style={{ fontSize: '12px', fontWeight: 600, backgroundColor: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '999px' }}>
                                {appointments.length} total
                            </span>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '460px' }}>
                        {appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '32px', color: '#d1d5db', marginBottom: '12px' }} />
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>No appointments yet</p>
                                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                                    Book your first session using the form on the left.
                                </p>
                            </div>
                        ) : appointments.map(app => {
                            const badge = statusBadge[app.status] || statusBadge.pending;
                            return (
                                <div key={app._id} style={{
                                    padding: '16px',
                                    border: '1px solid #f3f4f6',
                                    borderRadius: '12px',
                                    backgroundColor: '#fafafa',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    transition: 'border 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#f3f4f6'}
                                >
                                    {/* Topic + status */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{app.topic}</h3>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            fontSize: '11px', fontWeight: 700,
                                            backgroundColor: badge.bg, color: badge.color,
                                            border: `1px solid ${badge.border}`,
                                            padding: '3px 10px', borderRadius: '999px',
                                            whiteSpace: 'nowrap', flexShrink: 0,
                                        }}>
                                            <FontAwesomeIcon icon={badge.icon} style={{ fontSize: '10px' }} />
                                            {badge.label}
                                        </span>
                                    </div>

                                    {/* Mentor */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                                        <FontAwesomeIcon icon={faUserTie} style={{ fontSize: '11px', color: '#9ca3af' }} />
                                        <span><strong style={{ color: '#374151' }}>Mentor:</strong> {app.alumniId?.name || 'Unknown'}</span>
                                    </div>

                                    {/* Date/time */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                                        <FontAwesomeIcon icon={faClock} style={{ fontSize: '11px', color: '#9ca3af' }} />
                                        <span>
                                            <strong style={{ color: '#374151' }}>When:</strong>{' '}
                                            {new Date(app.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {app.time}
                                        </span>
                                    </div>

                                    {/* Meeting link */}
                                    {app.meetingLink && (
                                        <a
                                            href={app.meetingLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                fontSize: '13px', fontWeight: 600, color: '#2563eb',
                                                textDecoration: 'none', marginTop: '4px',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faLink} style={{ fontSize: '11px' }} />
                                            Join Meeting
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
