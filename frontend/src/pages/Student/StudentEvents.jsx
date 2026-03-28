import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faMapMarkerAlt, faTags, faVideo,
    faGlobe, faSearch, faFilter, faStar,
} from '@fortawesome/free-solid-svg-icons';

/* ── Department badge colors ─────────────────────────────── */
const deptColors = {
    default:    ['#eef2ff', '#4338ca'],
    Technology: ['#eff6ff', '#1d4ed8'],
    Business:   ['#f0fdf4', '#15803d'],
    Design:     ['#fdf4ff', '#9333ea'],
    Marketing:  ['#fff7ed', '#c2410c'],
    Finance:    ['#fffbeb', '#b45309'],
};
const getDeptStyle = (dept = '') => deptColors[dept] || deptColors.default;

/* ── Event Card ──────────────────────────────────────────── */
const EventCard = ({ evt }) => {
    const [deptBg, deptColor] = getDeptStyle(evt.department);
    const isFree = evt.price === 0;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Color accent bar */}
            <div style={{ height: '4px', backgroundColor: deptColor, opacity: 0.7 }} />

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Header: title + dept badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h3 style={{
                        fontSize: '15px', fontWeight: 700, color: '#111827',
                        margin: 0, lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {evt.title}
                    </h3>
                    {evt.department && (
                        <span style={{
                            fontSize: '10px', fontWeight: 700,
                            backgroundColor: deptBg, color: deptColor,
                            padding: '3px 10px', borderRadius: '999px',
                            whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                            {evt.department}
                        </span>
                    )}
                </div>

                {/* Description */}
                {evt.description && (
                    <p style={{
                        fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {evt.description}
                    </p>
                )}

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    {evt.updatedOn && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#93c5fd', fontSize: '12px', width: '14px' }} />
                            <span>{evt.updatedOn}</span>
                        </div>
                    )}
                    {evt.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#f87171', fontSize: '12px', width: '14px' }} />
                            <span>{evt.location}</span>
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
                padding: '14px 20px',
                borderTop: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{
                    fontSize: '16px', fontWeight: 800,
                    color: isFree ? '#16a34a' : '#111827',
                }}>
                    {isFree ? '🎟 Free' : `$${evt.price}`}
                </span>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px',
                    backgroundColor: '#4f46e5', color: '#fff',
                    border: 'none', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4338ca'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                    <FontAwesomeIcon icon={faVideo} style={{ fontSize: '11px' }} />
                    Join Event
                </button>
            </div>
        </div>
    );
};

/* ── Main Component ──────────────────────────────────────── */
const StudentEvents = () => {
    const { url, token } = useContext(StoreContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${url}/api/student/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success && res.data.events) {
                    setEvents(res.data.events);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [url, token]);

    const filtered = events.filter(e =>
        !search ||
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.department?.toLowerCase().includes(search.toLowerCase()) ||
        e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

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
                        Discover exclusive events hosted by alumni and industry leaders.
                    </p>
                </div>
            </div>

            {/* ── Stats + search row ── */}
            {!loading && events.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Quick stat pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#eef2ff', color: '#4338ca',
                        padding: '8px 16px', borderRadius: '999px',
                        fontSize: '13px', fontWeight: 600,
                    }}>
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '11px' }} />
                        {events.length} upcoming event{events.length > 1 ? 's' : ''}
                    </div>

                    {/* Search */}
                    <div style={{
                        flex: 1, minWidth: '200px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px', padding: '9px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <FontAwesomeIcon icon={faSearch} style={{ color: '#9ca3af', fontSize: '13px' }} />
                        <input
                            type="text"
                            placeholder="Search by title, department, or tag..."
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
                        {search ? 'No events match your search' : 'No upcoming events'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                        {search
                            ? `Try a different keyword — no results for "${search}"`
                            : 'Exciting seminars and webinars are coming soon. Check back later!'}
                    </p>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{
                                marginTop: '16px', padding: '8px 20px',
                                backgroundColor: '#eef2ff', color: '#4338ca',
                                border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {search && (
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '-12px 0 0 0' }}>
                            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                        </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {filtered.map(evt => <EventCard key={evt._id} evt={evt} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentEvents;
