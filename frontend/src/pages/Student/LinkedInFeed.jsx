import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp, faComment, faShare, faEllipsisH,
    faGlobeAmericas, faSignOutAlt, faUserCircle,
    faEnvelope, faBriefcase, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

/* ── Mock alumni posts (ConnectAlum network) ─────────────── */
const ALUMNI_POSTS = [
    {
        id: 1,
        author: 'Sarah Jenkins',
        headline: 'Senior Software Engineer @ Google | Tech Speaker',
        time: '2h',
        avatar: 'https://i.pravatar.cc/150?img=47',
        content: "Thrilled to announce that our team just launched the new authentication architecture! 🎉 It's been 6 months of hard work, pivoting, and countless cups of coffee.\n\nTo any students looking to break into backend engineering: focus heavily on system design and understanding the CAP theorem. Happy to chat with anyone interested via the ConnectAlum mentoring portal!",
        likes: 124,
        comments: 18,
        tag: 'Engineering',
    },
    {
        id: 2,
        author: 'David Chen',
        headline: 'Product Manager @ Meta | Ex-Startup Founder',
        time: '5h',
        avatar: 'https://i.pravatar.cc/150?img=11',
        content: "I'll be hosting a webinar tomorrow focusing on 'Transitioning from Engineering to Product'. If you're a recent grad or a junior dev feeling the pull towards product strategy, come join us! Check the Events tab on the dashboard to register. See you there! 🚀",
        likes: 89,
        comments: 5,
        tag: 'Career',
    },
    {
        id: 3,
        author: 'Alisha Patel',
        headline: 'Data Scientist @ Netflix',
        time: '1d',
        avatar: 'https://i.pravatar.cc/150?img=32',
        content: 'Just published a new article on Medium detailing how we handle data anomaly detection at scale. Spoiler alert: it involves a lot of robust pipeline building with PySpark. Thanks to everyone who reviewed my drafts! 📊',
        likes: 312,
        comments: 42,
        tag: 'Data',
    },
];

/* ── Tag pill colors ─────────────────────────────────────── */
const tagColors = {
    Engineering: ['#dbeafe', '#1e40af'],
    Career:      ['#dcfce7', '#166534'],
    Data:        ['#fef9c3', '#854d0e'],
};

/* ── Post Card ───────────────────────────────────────────── */
const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [tagBg, tagColor] = tagColors[post.tag] || ['#f3f4f6', '#374151'];

    const toggleLike = () => {
        setLiked(p => !p);
        setLikeCount(p => liked ? p - 1 : p + 1);
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <img src={post.avatar} alt={post.author}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>{post.author}</h3>
                            <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: tagBg, color: tagColor, padding: '2px 8px', borderRadius: '999px' }}>
                                {post.tag}
                            </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{post.headline}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {post.time} • <FontAwesomeIcon icon={faGlobeAmericas} />
                        </p>
                    </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '0 20px 16px' }}>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </p>
            </div>

            {/* Stats */}
            <div style={{ padding: '8px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: liked ? '#2563eb' : '#dbeafe', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: liked ? '#fff' : '#2563eb' }}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </span>
                    {likeCount}
                </span>
                <span>{post.comments} comments • 2 reposts</span>
            </div>

            {/* Actions */}
            <div style={{ borderTop: '1px solid #f3f4f6', display: 'flex' }}>
                {[
                    { icon: faThumbsUp, label: 'Like',    onClick: toggleLike, active: liked },
                    { icon: faComment,  label: 'Comment', onClick: () => {}, active: false },
                    { icon: faShare,    label: 'Share',   onClick: () => {}, active: false },
                ].map(btn => (
                    <button key={btn.label} onClick={btn.onClick} style={{
                        flex: 1, padding: '12px 0',
                        background: 'none', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        fontSize: '13px', fontWeight: 600,
                        color: btn.active ? '#2563eb' : '#6b7280',
                        cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <FontAwesomeIcon icon={btn.icon} style={{ fontSize: '15px' }} />
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ── LinkedIn Profile Card ───────────────────────────────── */
const LinkedInProfileCard = ({ profile, onDisconnect }) => (
    <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        marginBottom: '24px',
    }}>
        {/* LinkedIn blue banner */}
        <div style={{ height: '56px', background: 'linear-gradient(135deg, #0077b5 0%, #004f7c 100%)' }} />
        <div style={{ padding: '0 20px 20px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ marginTop: '-30px', marginBottom: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                {profile.picture ? (
                    <img src={profile.picture} alt={profile.name}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0077b5', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px' }}>
                        <FontAwesomeIcon icon={faUserCircle} />
                    </div>
                )}
                {/* Connected badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#16a34a', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '999px' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '11px' }} />
                    LinkedIn Connected
                </div>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>{profile.name}</h3>
            {profile.email && (
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '11px', color: '#0077b5' }} />
                    {profile.email}
                </p>
            )}

            {/* Disconnect button */}
            <button onClick={onDisconnect} style={{
                marginTop: '14px', padding: '7px 16px',
                border: '1px solid #e5e7eb', borderRadius: '8px',
                backgroundColor: '#fff', color: '#6b7280',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
            >
                <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '11px' }} />
                Disconnect LinkedIn
            </button>
        </div>
    </div>
);

/* ── LinkedIn Connect Splash ─────────────────────────────── */
const LinkedInConnectSplash = ({ onConnect, loading, error }) => (
    <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '48px 24px' }}>
        {/* LinkedIn icon */}
        <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            backgroundColor: '#0077b5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(0,119,181,0.3)',
        }}>
            <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '44px', color: '#fff' }} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 10px 0' }}>
            Connect Your LinkedIn
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px 0', lineHeight: 1.7 }}>
            Sign in with LinkedIn to display your profile and browse the alumni network feed. Your credentials are never stored on our servers.
        </p>

        {/* Feature bullets */}
        <div style={{ textAlign: 'left', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
                '✅ View your LinkedIn profile inside ConnectAlum',
                '📰 Browse the ConnectAlum alumni network posts',
                '🔒 OAuth 2.0 — we never see your password',
            ].map((item, i) => (
                <p key={i} style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{item}</p>
            ))}
        </div>

        {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
                ⚠️ {error}
            </div>
        )}

        <button onClick={onConnect} disabled={loading} style={{
            width: '100%', padding: '14px 0',
            backgroundColor: loading ? '#93c5fd' : '#0077b5',
            color: '#fff', border: 'none',
            borderRadius: '10px', fontSize: '15px', fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 4px 12px rgba(0,119,181,0.3)',
            transition: 'background 0.2s',
        }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#005f8f'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#0077b5'; }}
        >
            <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '20px' }} />
            {loading ? 'Redirecting to LinkedIn...' : 'Sign in with LinkedIn'}
        </button>

        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '14px' }}>
            By connecting, you agree to LinkedIn's Terms of Service.
        </p>
    </div>
);

/* ── Main Component ──────────────────────────────────────── */
const LinkedInFeed = () => {
    const [linkedInProfile, setLinkedInProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // On page load: check if redirected back from LinkedIn callback
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const profileParam = params.get('linkedin_profile');
        const tokenParam   = params.get('linkedin_token');
        const errorParam   = params.get('linkedin_error');

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        if (profileParam && tokenParam) {
            try {
                const profile = JSON.parse(decodeURIComponent(profileParam));
                setLinkedInProfile(profile);
                localStorage.setItem('linkedin_profile', JSON.stringify(profile));
                localStorage.setItem('linkedin_token', tokenParam);
                window.history.replaceState({}, '', window.location.pathname);
            } catch {
                setError('Failed to parse LinkedIn profile data.');
            }
            return;
        }

        // Check persisted session
        const saved = localStorage.getItem('linkedin_profile');
        if (saved) {
            try { setLinkedInProfile(JSON.parse(saved)); } catch { /* ignore */ }
        }
    }, []);

    const handleConnect = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BACKEND}/api/linkedin/authorize`);
            const data = await res.json();
            if (data.success && data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                setError(data.message || 'Could not get LinkedIn authorization URL.');
                setLoading(false);
            }
        } catch {
            setError('Cannot reach the server. Is the backend running?');
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('linkedin_profile');
        localStorage.removeItem('linkedin_token');
        setLinkedInProfile(null);
    };

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb', marginBottom: '28px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: '#0077b5', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                }}>
                    <FontAwesomeIcon icon={faLinkedin} />
                </div>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Alumni Network Feed</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
                        Latest professional updates and insights from your alumni network.
                    </p>
                </div>
            </div>

            {!linkedInProfile ? (
                /* ── Not connected: show splash ── */
                <LinkedInConnectSplash onConnect={handleConnect} loading={loading} error={error} />
            ) : (
                /* ── Connected: show profile card + alumni posts feed ── */
                <>
                    <LinkedInProfileCard profile={linkedInProfile} onDisconnect={handleDisconnect} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', whiteSpace: 'nowrap' }}>ConnectAlum Alumni Posts</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {ALUMNI_POSTS.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default LinkedInFeed;
