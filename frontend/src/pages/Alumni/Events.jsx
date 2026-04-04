import React, { useState, useEffect, useContext } from 'react';
import './AlumniPages.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const EVENT_TYPES = [
    { id: 'webinar', label: 'Webinar',     icon: '🖥️' },
    { id: 'career',  label: 'Career Talk', icon: '🎤' },
    { id: 'ama',     label: 'AMA Session', icon: '💬' },
];

const TYPE_ICONS      = { webinar: '🖥️', career: '🎤', ama: '💬' };
const TYPE_COLORS_MAP = { webinar: 'ap-tag-job', career: 'ap-tag-intern', ama: 'ap-tag-referral' };

const EMPTY_FORM = { title: '', date: '', time: '', desc: '', registerLink: '' };

const Events = () => {
    const { url, token } = useContext(StoreContext);

    const [activeType,   setActiveType]   = useState('webinar');
    const [form,         setForm]         = useState(EMPTY_FORM);
    const [events,       setEvents]       = useState([]);
    const [showForm,     setShowForm]     = useState(false);
    const [success,      setSuccess]      = useState(false);
    const [error,        setError]        = useState('');
    const [loading,      setLoading]      = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    // ── Fetch only this alumni's events ──────────────────────
    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/events`);
            const data = res.data;
            // Support both {success, events} and bare array responses
            const allEvents = data.success ? data.events : (Array.isArray(data) ? data : []);
            const userId = JSON.parse(atob(token.split('.')[1])).id;
            const mine   = allEvents.filter(e => e.postedBy?._id === userId || e.postedBy === userId);
            setEvents(mine);
        } catch (err) {
            console.error('Error loading events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchMyEvents();
    }, [token]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // ── Create event ─────────────────────────────────────────
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.date) return;
        setError('');
        try {
            const res = await axios.post(
                `${url}/api/events/alumni-post`,
                { ...form, type: activeType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setEvents(prev => [res.data.event, ...prev]);
                setForm(EMPTY_FORM);
                setSuccess(true);
                setShowForm(false);
                setTimeout(() => setSuccess(false), 3500);
            }
        } catch (err) {
            console.error('Error creating event:', err);
            setError(err.response?.data?.message || 'Failed to create event. Try again.');
        }
    };

    // ── Cancel / delete event ────────────────────────────────
    const handleCancel = async (id) => {
        try {
            await axios.delete(`${url}/api/events/alumni-post/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            console.error('Error removing event:', err);
        }
    };

    const filtered    = filterStatus === 'all' ? events : events.filter(e => e.status === filterStatus);
    const formatDate  = (d) => {
        if (!d) return '';
        try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return d; }
    };

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Events</h1>
                    <p className="ap-page-sub">Create and manage webinars, career talks &amp; AMA sessions</p>
                </div>
                <button className="ap-btn-primary" onClick={() => setShowForm(!showForm)} id="create-event-btn">
                    {showForm ? '✕ Cancel' : '+ Create Event'}
                </button>
            </div>

            {success && (
                <div className="ap-success-toast">
                    ✅ Event created! Students can now see it in their Events section.
                </div>
            )}
            {error && <div className="ap-error-toast">⚠️ {error}</div>}

            {/* Create Form */}
            {showForm && (
                <div className="ap-card ap-mb">
                    <h3 className="ap-card-title">📅 New Event</h3>

                    <div className="ap-type-tabs">
                        {EVENT_TYPES.map(t => (
                            <button
                                key={t.id}
                                id={`event-type-${t.id}`}
                                className={`ap-type-tab ${activeType === t.id ? 'ap-type-active' : ''}`}
                                onClick={() => setActiveType(t.id)}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    <form className="ap-form-grid" onSubmit={handleCreate}>
                        <div className="ap-form-group ap-full-row">
                            <label className="ap-label">Event Title</label>
                            <input className="ap-input" placeholder="e.g. Cracking FAANG Interviews" value={form.title} onChange={e => set('title', e.target.value)} required />
                        </div>
                        <div className="ap-form-group">
                            <label className="ap-label">Date</label>
                            <input type="date" className="ap-input" value={form.date} onChange={e => set('date', e.target.value)} required />
                        </div>
                        <div className="ap-form-group">
                            <label className="ap-label">Time</label>
                            <input type="time" className="ap-input" value={form.time} onChange={e => set('time', e.target.value)} />
                        </div>
                        <div className="ap-form-group ap-full-row">
                            <label className="ap-label">Register / Join Link</label>
                            <input type="text" className="ap-input" placeholder="https://zoom.us/..." value={form.registerLink} onChange={e => set('registerLink', e.target.value)} />
                        </div>
                        <div className="ap-form-group ap-full-row">
                            <label className="ap-label">Description</label>
                            <textarea className="ap-input ap-textarea" rows={3} placeholder="What will this session cover?" value={form.desc} onChange={e => set('desc', e.target.value)} />
                        </div>
                        <div className="ap-full-row">
                            <button type="submit" className="ap-btn-primary" id="submit-event-btn">
                                🚀 Create Event
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="ap-filter-tabs">
                {['all', 'upcoming', 'completed'].map(f => (
                    <button
                        key={f}
                        className={`ap-filter-tab ${filterStatus === f ? 'ap-filter-active' : ''}`}
                        onClick={() => setFilterStatus(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="ap-events-grid">
                {loading ? (
                    <div className="ap-empty-card">
                        <p className="ap-empty-icon">⏳</p>
                        <p className="ap-empty-title">Loading your events...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ap-empty-card">
                        <p className="ap-empty-icon">📭</p>
                        <p className="ap-empty-title">No events found</p>
                        <p className="ap-empty-sub">Click "Create Event" to schedule your first session.</p>
                    </div>
                ) : (
                    filtered.map(ev => (
                        <div key={ev._id} className={`ap-event-card ${ev.status === 'completed' ? 'ap-event-done' : ''}`}>
                            <div className="ap-event-top">
                                <span className={`ap-tag ${TYPE_COLORS_MAP[ev.type] || 'ap-tag-job'}`}>
                                    {TYPE_ICONS[ev.type] || '📅'} {ev.type?.charAt(0).toUpperCase() + ev.type?.slice(1)}
                                </span>
                                <span className={`ap-status-badge ${ev.status === 'upcoming' ? 'ap-status-accepted' : 'ap-status-pending'}`}>
                                    {ev.status === 'upcoming' ? '🕐 Upcoming' : '✅ Completed'}
                                </span>
                            </div>
                            <h4 className="ap-event-title">{ev.title}</h4>
                            <p className="ap-event-desc">{ev.desc || ev.description}</p>
                            <div className="ap-event-meta">
                                <span>📅 {formatDate(ev.date || ev.updatedOn)}</span>
                                {ev.time && <span>🕒 {ev.time}</span>}
                                <span>👥 {ev.attendees ?? 0} registered</span>
                            </div>
                            {ev.status === 'upcoming' && (
                                <div className="ap-event-actions">
                                    {ev.registerLink && (
                                        <a
                                            href={ev.registerLink.startsWith('http') ? ev.registerLink : `https://${ev.registerLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ap-btn-ghost"
                                        >
                                            Share Link
                                        </a>
                                    )}
                                    <button
                                        className="ap-btn-danger-ghost"
                                        onClick={() => handleCancel(ev._id)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;
