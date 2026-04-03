import React, { useState } from 'react';
import './AlumniPages.css';

const EVENT_TYPES = [
    { id: 'webinar',  label: 'Webinar',     icon: '🖥️' },
    { id: 'career',   label: 'Career Talk',  icon: '🎤' },
    { id: 'ama',      label: 'AMA Session',  icon: '💬' },
];

const INITIAL_EVENTS = [
    { id: 1, type: 'webinar',  title: 'Cracking FAANG Interviews', date: '2026-04-10', time: '18:00', desc: 'Deep-dive into coding rounds, system design, and behaviorals.',         attendees: 45, status: 'upcoming' },
    { id: 2, type: 'career',   title: 'From College to Google',     date: '2026-04-18', time: '19:00', desc: 'My personal journey from tier-2 college to Google SWE.',            attendees: 72, status: 'upcoming' },
    { id: 3, type: 'ama',      title: 'Ask Me Anything – SWE Life', date: '2026-03-28', time: '20:00', desc: 'Open floor for any questions about the tech industry or my career.', attendees: 38, status: 'completed' },
];

const TYPE_ICONS = { webinar: '🖥️', career: '🎤', ama: '💬' };
const TYPE_COLORS_MAP = { webinar: 'ap-tag-job', career: 'ap-tag-intern', ama: 'ap-tag-referral' };

const EMPTY_FORM = { title: '', date: '', time: '', desc: '' };

const Events = () => {
    const [activeType, setActiveType] = useState('webinar');
    const [form, setForm] = useState(EMPTY_FORM);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.title || !form.date) return;
        setEvents(ev => [{
            id: Date.now(), type: activeType, title: form.title,
            date: form.date, time: form.time, desc: form.desc,
            attendees: 0, status: 'upcoming',
        }, ...ev]);
        setForm(EMPTY_FORM);
        setSuccess(true);
        setShowForm(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    const filtered = filterStatus === 'all' ? events : events.filter(e => e.status === filterStatus);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Events</h1>
                    <p className="ap-page-sub">Create and manage webinars, career talks & AMA sessions</p>
                </div>
                <button className="ap-btn-primary" onClick={() => setShowForm(!showForm)} id="create-event-btn">
                    {showForm ? '✕ Cancel' : '+ Create Event'}
                </button>
            </div>

            {success && <div className="ap-success-toast">✅ Event created successfully!</div>}

            {/* Create Form */}
            {showForm && (
                <div className="ap-card ap-mb">
                    <h3 className="ap-card-title">📅 New Event</h3>

                    {/* Event Type */}
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

            {/* Events filter */}
            <div className="ap-filter-tabs">
                {['all', 'upcoming', 'completed'].map(f => (
                    <button key={f} className={`ap-filter-tab ${filterStatus === f ? 'ap-filter-active' : ''}`} onClick={() => setFilterStatus(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="ap-events-grid">
                {filtered.length === 0 && (
                    <div className="ap-empty-card">
                        <p className="ap-empty-icon">📭</p>
                        <p className="ap-empty-title">No events found</p>
                    </div>
                )}
                {filtered.map(ev => (
                    <div key={ev.id} className={`ap-event-card ${ev.status === 'completed' ? 'ap-event-done' : ''}`}>
                        <div className="ap-event-top">
                            <span className={`ap-tag ${TYPE_COLORS_MAP[ev.type]}`}>{TYPE_ICONS[ev.type]} {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                            <span className={`ap-status-badge ${ev.status === 'upcoming' ? 'ap-status-accepted' : 'ap-status-pending'}`}>
                                {ev.status === 'upcoming' ? '🕐 Upcoming' : '✅ Completed'}
                            </span>
                        </div>
                        <h4 className="ap-event-title">{ev.title}</h4>
                        <p className="ap-event-desc">{ev.desc}</p>
                        <div className="ap-event-meta">
                            <span>📅 {formatDate(ev.date)}</span>
                            {ev.time && <span>🕒 {ev.time}</span>}
                            <span>👥 {ev.attendees} registered</span>
                        </div>
                        {ev.status === 'upcoming' && (
                            <div className="ap-event-actions">
                                <button className="ap-btn-ghost">Edit</button>
                                <button className="ap-btn-ghost">Share Link</button>
                                <button
                                    className="ap-btn-danger-ghost"
                                    onClick={() => setEvents(evs => evs.filter(x => x.id !== ev.id))}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
