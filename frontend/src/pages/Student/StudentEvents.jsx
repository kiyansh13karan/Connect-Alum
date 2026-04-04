import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faMapMarkerAlt, faTags, faVideo,
    faGlobe, faSearch, faStar, faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

/* ── Type config ─────────────────────────────────────────── */
const TYPE_META = {
    webinar: { icon: '🖥️', label: 'Webinar',     color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    career:  { icon: '🎤', label: 'Career Talk', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    ama:     { icon: '💬', label: 'AMA Session', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
};

/* ── Alumni Event Card ───────────────────────────────────── */
const AlumniEventCard = ({ evt }) => {
    const meta = TYPE_META[evt.type] || TYPE_META.webinar;
    const formatDate = (d) => {
        if (!d) return '';
        try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return d; }
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '18px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.25s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.10)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Top accent bar */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${meta.color}, ${meta.bg})` }} />

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Type badge + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        fontSize: '0.72rem', fontWeight: 700,
                        color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`,
                        padding: '0.2rem 0.65rem', borderRadius: '100px',
                    }}>
                        {meta.icon} {meta.label}
                    </span>
                    <span style={{
                        fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                        borderRadius: '100px',
                        background: evt.status === 'upcoming' ? '#f0fdf4' : '#f8fafc',
                        color: evt.status === 'upcoming' ? '#16a34a' : '#94a3b8',
                        border: `1px solid ${evt.status === 'upcoming' ? '#bbf7d0' : '#e2e8f0'}`,
                    }}>
                        {evt.status === 'upcoming' ? '🕐 Upcoming' : '✅ Done'}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '0.95rem', fontWeight: 800, color: '#0f172a',
                    margin: 0, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {evt.title}
                </h3>

                {/* Description */}
                {(evt.desc || evt.description) && (
                    <p style={{
                        fontSize: '0.8rem', color: '#6b7280', margin: 0, lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {evt.desc || evt.description}
                    </p>
                )}

                {/* Meta row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                    {(evt.date || evt.updatedOn) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#4b5563' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#93c5fd', width: '14px' }} />
                            <span>{formatDate(evt.date || evt.updatedOn)}</span>
                            {evt.time && <span>· {evt.time}</span>}
                        </div>
                    )}
                    {/* Poster info */}
                    {(evt.posterName || evt.postedBy?.name) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                color: '#fff', fontSize: '0.6rem', fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                {(evt.posterName || evt.postedBy?.name)?.[0]?.toUpperCase()}
                            </div>
                            <span>{evt.posterName || evt.postedBy?.name}</span>
                            {evt.postedBy?.currentRole && <span style={{ color: '#94a3b8' }}>· {evt.postedBy.currentRole}</span>}
                        </div>
                    )}
                </div>

                {/* Tags */}
                {evt.tags && evt.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {evt.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                fontSize: '11px', backgroundColor: '#f3f4f6',
                                color: '#6b7280', padding: '3px 9px', borderRadius: '999px',
                            }}>
                                <FontAwesomeIcon icon={faTags} style={{ fontSize: '9px' }} />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
                    🎟 Free
                </span>
                {(evt.registerLink || evt.meetingLink) ? (
                    <a
                        href={(() => {
                            const link = evt.registerLink || evt.meetingLink;
                            return link.startsWith('http') ? link : `https://${link}`;
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '7px 15px',
                            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                            color: '#fff', border: 'none', borderRadius: '8px',
                            fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                            boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 5px 16px rgba(99,102,241,0.45)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 3px 10px rgba(99,102,241,0.3)'}
                    >
                        <FontAwesomeIcon icon={faVideo} style={{ fontSize: '11px' }} />
                        Join Event
                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '9px' }} />
                    </a>
                ) : (
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 15px',
                        backgroundColor: '#4f46e5', color: '#fff',
                        border: 'none', borderRadius: '8px',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338ca'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                    >
                        <FontAwesomeIcon icon={faVideo} style={{ fontSize: '11px' }} />
                        Join Event
                    </button>
                )}
            </div>
        </div>
    );
};

/* ── Main Component ──────────────────────────────────────── */
const StudentEvents = () => {
    const { url, token } = useContext(StoreContext);
    const [events,   setEvents]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${url}/api/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Handle both {success, events} and bare array
                const data = res.data;
                const list = data.success ? data.events : (Array.isArray(data) ? data : []);
                // Show only upcoming events on student side
                setEvents(list.filter(e => e.status !== 'completed'));
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [url, token]);

    const filtered = events.filter(e => {
        const matchSearch = !search
            || e.title?.toLowerCase().includes(search.toLowerCase())
            || e.desc?.toLowerCase().includes(search.toLowerCase())
            || e.description?.toLowerCase().includes(search.toLowerCase())
            || e.type?.toLowerCase().includes(search.toLowerCase())
            || e.posterName?.toLowerCase().includes(search.toLowerCase())
            || e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchType = typeFilter === 'all' || e.type === typeFilter;
        return matchSearch && matchType;
    });

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: '#eef2ff', color: '#4f46e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                    <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Seminars &amp; Webinars
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Exclusive events hosted by alumni — webinars, career talks &amp; AMA sessions.
                    </p>
                </div>
            </div>

            {/* ── Controls row ── */}
            {!loading && events.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Count pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#eef2ff', color: '#4338ca',
                        padding: '8px 16px', borderRadius: '999px',
                        fontSize: '13px', fontWeight: 600,
                    }}>
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '11px' }} />
                        {events.length} upcoming event{events.length > 1 ? 's' : ''}
                    </div>

                    {/* Type filter pills */}
                    {['all', 'webinar', 'career', 'ama'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            style={{
                                padding: '7px 14px', borderRadius: '100px',
                                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit',
                                border: `1.5px solid ${typeFilter === t ? '#818cf8' : '#e2e8f0'}`,
                                background: typeFilter === t ? 'rgba(99,102,241,0.1)' : 'white',
                                color: typeFilter === t ? '#4f46e5' : '#64748b',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {t === 'all' ? 'All' : TYPE_META[t].icon + ' ' + TYPE_META[t].label}
                        </button>
                    ))}

                    {/* Search */}
                    <div style={{
                        flex: 1, minWidth: '200px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backgroundColor: '#fff', border: '1px solid #e5e7eb',
                        borderRadius: '10px', padding: '9px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <FontAwesomeIcon icon={faSearch} style={{ color: '#9ca3af', fontSize: '13px' }} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#374151', backgroundColor: 'transparent' }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}>×</button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Content ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '3px solid #e5e7eb', borderTopColor: '#4f46e5',
                        margin: '0 auto 16px',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading events...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 24px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '16px', border: '1px dashed #d1d5db',
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#eef2ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '26px', color: '#a5b4fc',
                    }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: 0 }}>
                        {search || typeFilter !== 'all' ? 'No events match your filters' : 'No upcoming events'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                        {search || typeFilter !== 'all'
                            ? 'Try clearing your filters.'
                            : 'Exciting seminars and webinars are coming soon. Check back later!'}
                    </p>
                    {(search || typeFilter !== 'all') && (
                        <button
                            onClick={() => { setSearch(''); setTypeFilter('all'); }}
                            style={{
                                marginTop: '16px', padding: '8px 20px',
                                backgroundColor: '#eef2ff', color: '#4338ca',
                                border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {(search || typeFilter !== 'all') && (
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '-12px 0 0 0' }}>
                            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {filtered.map(evt => <AlumniEventCard key={evt._id} evt={evt} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentEvents;
