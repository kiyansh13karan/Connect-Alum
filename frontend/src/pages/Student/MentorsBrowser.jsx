import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserTie, faBriefcase, faPlus, faCheck,
    faClock, faSearch, faUsers, faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

/* ── Status badge config ─────────────────────────────────── */
const statusConfig = {
    pending: {
        label: 'Request Pending',
        icon: faClock,
        bg: '#fefce8',
        color: '#92400e',
        border: '#fde68a',
    },
    accepted: {
        label: 'Connected',
        icon: faCheck,
        bg: '#f0fdf4',
        color: '#166534',
        border: '#bbf7d0',
    },
};

/* ── Mentor Card ─────────────────────────────────────────── */
const MentorCard = ({ mentor, status, onConnect }) => {
    const initials = mentor.name
        ? mentor.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const avatarColors = [
        ['#dbeafe', '#1d4ed8'],
        ['#ede9fe', '#6d28d9'],
        ['#fce7f3', '#9d174d'],
        ['#dcfce7', '#166534'],
        ['#ffedd5', '#c2410c'],
    ];
    const [bg, fg] = avatarColors[mentor.name?.charCodeAt(0) % avatarColors.length] ?? avatarColors[0];

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    backgroundColor: bg, color: fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, flexShrink: 0,
                }}>
                    {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mentor.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '11px', color: '#9ca3af' }} />
                        {mentor.company || 'Independent'}
                    </p>
                    {mentor.role && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                            {mentor.role}
                        </p>
                    )}
                </div>
            </div>

            {/* Skills / tags */}
            {mentor.skills && mentor.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mentor.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} style={{
                            fontSize: '11px', fontWeight: 500,
                            backgroundColor: '#f3f4f6', color: '#374151',
                            padding: '3px 10px', borderRadius: '999px',
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Divider + Action */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: 'auto' }}>
                {!status && (
                    <button
                        onClick={() => onConnect(mentor._id)}
                        style={{
                            width: '100%', padding: '10px 0',
                            backgroundColor: '#2563eb', color: '#fff',
                            border: 'none', borderRadius: '10px',
                            fontSize: '14px', fontWeight: 600,
                            cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px' }} />
                        Connect
                    </button>
                )}
                {status && statusConfig[status] && (
                    <div style={{
                        width: '100%', padding: '10px 0',
                        backgroundColor: statusConfig[status].bg,
                        color: statusConfig[status].color,
                        border: `1px solid ${statusConfig[status].border}`,
                        borderRadius: '10px',
                        fontSize: '13px', fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        <FontAwesomeIcon icon={statusConfig[status].icon} />
                        {statusConfig[status].label}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Main Component ──────────────────────────────────────── */
const MentorsBrowser = () => {
    const { url, token } = useContext(StoreContext);
    const [mentors, setMentors] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await axios.get(url + '/api/student/mentors', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setMentors(res.data.mentors);
                    setConnections(res.data.connections);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, [url, token]);

    const handleConnect = async (alumniId) => {
        try {
            const res = await axios.post(
                url + '/api/student/connect-mentor',
                { alumniId, message: 'I would like to connect with you for mentorship.' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setConnections(prev => [...prev, { alumniId, status: 'pending' }]);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Connection error:', error);
            alert('Failed to send request.');
        }
    };

    const getConnectionStatus = (alumniId) => {
        const conn = connections.find(
            c => c.alumniId === alumniId ||
                (typeof c.alumniId === 'object' && c.alumniId._id === alumniId)
        );
        return conn ? conn.status : null;
    };

    const filtered = mentors.filter(m =>
        !search ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.company?.toLowerCase().includes(search.toLowerCase()) ||
        m.role?.toLowerCase().includes(search.toLowerCase())
    );

    /* ── Stats ── */
    const totalConnected = connections.filter(c => c.status === 'accepted').length;
    const totalPending = connections.filter(c => c.status === 'pending').length;

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* ── Page Header ── */}
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        backgroundColor: '#eff6ff', color: '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Alumni Directory
                    </h1>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, paddingLeft: '52px' }}>
                    Find and connect with experienced alumni to guide your career journey.
                </p>
            </div>

            {/* ── Quick Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                    { icon: faUsers,    label: 'Total Alumni',    value: mentors.length,  bg: '#eff6ff', fg: '#2563eb', border: '#bfdbfe' },
                    { icon: faCheck,    label: 'Connected',        value: totalConnected,  bg: '#f0fdf4', fg: '#16a34a', border: '#bbf7d0' },
                    { icon: faClock,    label: 'Pending Requests', value: totalPending,    bg: '#fffbeb', fg: '#d97706', border: '#fde68a' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        backgroundColor: '#fff',
                        border: `1px solid ${stat.border}`,
                        borderRadius: '14px',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '10px',
                            backgroundColor: stat.bg, color: stat.fg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                        }}>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1 }}>{stat.value}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search Bar ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '10px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: '#9ca3af', fontSize: '14px' }} />
                <input
                    type="text"
                    placeholder="Search by name, company, or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        fontSize: '14px', color: '#374151',
                        backgroundColor: 'transparent',
                    }}
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* ── Mentor Grid ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '3px solid #e5e7eb', borderTopColor: '#2563eb',
                        margin: '0 auto 16px',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading alumni...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 24px',
                    backgroundColor: '#f9fafb', borderRadius: '16px',
                    border: '1px dashed #d1d5db',
                }}>
                    <FontAwesomeIcon icon={faUsers} style={{ fontSize: '36px', color: '#d1d5db', marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: 0 }}>
                        {search ? 'No mentors match your search' : 'No alumni found'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
                        {search ? 'Try a different name or company.' : 'Check back later for new alumni profiles.'}
                    </p>
                </div>
            ) : (
                <>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '-12px 0 0 0' }}>
                        Showing {filtered.length} alumni{search ? ` matching "${search}"` : ''}
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                    }}>
                        {filtered.map(mentor => (
                            <MentorCard
                                key={mentor._id}
                                mentor={mentor}
                                status={getConnectionStatus(mentor._id)}
                                onConnect={handleConnect}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Spinner keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default MentorsBrowser;
