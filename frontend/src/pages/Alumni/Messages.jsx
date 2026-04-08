import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './AlumniPages.css';

/* ── Avatar helper ───────────────────────────────────────── */
const avatarPalette = [
    ['#eff6ff', '#2563eb'],
    ['#f5f3ff', '#7c3aed'],
    ['#f0fdf4', '#16a34a'],
    ['#fffbeb', '#d97706'],
    ['#fff1f2', '#e11d48'],
    ['#e0f2fe', '#0369a1'],
];
const getAvatar = (name = '') => {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const [bg, fg] = avatarPalette[name.charCodeAt(0) % avatarPalette.length] ?? avatarPalette[0];
    return { initials, bg, fg };
};

/* ── Main Component ──────────────────────────────────────── */
const Messages = () => {
    const { url, token } = useContext(StoreContext);

    const [conversations, setConversations] = useState([]);   // [{student, lastMessage, lastTime}]
    const [activeStudent, setActiveStudent]   = useState(null); // student object
    const [messages, setMessages]             = useState([]);
    const [inputText, setInputText]           = useState('');
    const [search, setSearch]                 = useState('');
    const [loading, setLoading]               = useState(true);
    const [sending, setSending]               = useState(false);
    const [error, setError]                   = useState('');

    const messagesEndRef = useRef(null);

    /* ── Data fetching ─────────────────────────────────────── */
    useEffect(() => { fetchConversations(); }, [url, token]);
    useEffect(() => { if (activeStudent) fetchMessages(activeStudent._id); }, [activeStudent]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // Poll for new messages every 5 seconds when a conversation is open
    useEffect(() => {
        if (!activeStudent) return;
        const interval = setInterval(() => {
            fetchMessages(activeStudent._id);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeStudent]);

    // Poll for new conversations every 10 seconds
    useEffect(() => {
        if (!token) return;
        const interval = setInterval(() => {
            fetchConversations();
        }, 10000);
        return () => clearInterval(interval);
    }, [token]);

    const fetchConversations = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get(`${url}/api/alumni-role/conversations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setConversations(res.data.conversations);
                // Auto-select the first conversation
                if (res.data.conversations.length > 0 && !activeStudent) {
                    setActiveStudent(res.data.conversations[0].student);
                }
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Could not load conversations.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (studentId) => {
        try {
            const res = await axios.get(`${url}/api/alumni-role/messages/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) setMessages(res.data.messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeStudent || sending) return;
        setSending(true);
        try {
            const res = await axios.post(
                `${url}/api/alumni-role/message`,
                { receiverId: activeStudent._id, content: inputText.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.data]);
                setInputText('');
                // Refresh conversations list so last message updates
                fetchConversations();
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSending(false);
        }
    };

    /* ── Derived state ─────────────────────────────────────── */
    const filtered = conversations.filter(c =>
        !search ||
        c.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.student?.email?.toLowerCase().includes(search.toLowerCase())
    );

    /* ── Render ────────────────────────────────────────────── */
    return (
        <div className="ap-page">
            {/* Page Header */}
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Messages</h1>
                    <p className="ap-page-sub">Chat with your connected mentees</p>
                </div>
            </div>

            {/* Error toast */}
            {error && <div className="ap-success-toast" style={{ background: '#fff1f2', borderColor: '#fecdd3', color: '#e11d48' }}>{error}</div>}

            {/* Two-panel layout */}
            <div className="ap-messages-layout">

                {/* ── Sidebar ───────────────────────────────── */}
                <div className="ap-msg-sidebar">
                    <div className="ap-msg-search-wrap">
                        <input
                            className="ap-msg-search"
                            placeholder="🔍 Search students..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="ap-contact-list">
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                Loading conversations…
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: '2rem 1.2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', margin: 0 }}>
                                    {search ? 'No students match search' : 'No connected students yet'}
                                </p>
                                {!search && (
                                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                                        Accept mentorship requests to start messaging.
                                    </p>
                                )}
                            </div>
                        ) : filtered.map(({ student, lastMessage, lastTime }) => {
                            const { initials, bg, fg } = getAvatar(student.name);
                            const isActive = activeStudent?._id === student._id;
                            return (
                                <button
                                    key={student._id}
                                    id={`contact-${student._id}`}
                                    className={`ap-contact-item ${isActive ? 'ap-contact-active' : ''}`}
                                    onClick={() => setActiveStudent(student)}
                                    style={{ borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent' }}
                                >
                                    <div
                                        className="ap-contact-avatar"
                                        style={{ backgroundColor: bg, color: fg, fontSize: '0.85rem', fontWeight: 700, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                    >
                                        {initials}
                                    </div>
                                    <div className="ap-contact-info" style={{ flex: 1, minWidth: 0 }}>
                                        <div className="ap-contact-top">
                                            <span className="ap-contact-name" style={{ fontWeight: 700, fontSize: '0.88rem', color: isActive ? '#4f46e5' : '#0f172a' }}>
                                                {student.name}
                                            </span>
                                            {lastTime && (
                                                <span className="ap-contact-time" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                    {new Date(lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="ap-contact-bottom">
                                            <span className="ap-contact-last" style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block' }}>
                                                {lastMessage ?? 'No messages yet'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Chat Panel ───────────────────────────── */}
                <div className="ap-chat-window">
                    {activeStudent ? (() => {
                        const { initials, bg, fg } = getAvatar(activeStudent.name);
                        return (
                            <>
                                {/* Chat Header */}
                                <div className="ap-chat-header">
                                    <div
                                        className="ap-chat-header-avatar"
                                        style={{ backgroundColor: bg, color: fg, fontSize: '0.9rem', fontWeight: 700, width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                    >
                                        {initials}
                                    </div>
                                    <div>
                                        <h4 className="ap-chat-header-name">{activeStudent.name}</h4>
                                        <p className="ap-chat-header-status" style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                                            {activeStudent.currentRole || activeStudent.email || 'Student'}
                                        </p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                        Connected
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="ap-chat-body">
                                    {messages.length === 0 ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', margin: 0 }}>No messages yet</p>
                                            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px' }}>Start the conversation below 👇</p>
                                        </div>
                                    ) : messages.map(msg => {
                                        const isMine = msg.sender !== activeStudent._id;
                                        return (
                                            <div
                                                key={msg._id}
                                                className={`ap-bubble-wrap ${isMine ? 'ap-bubble-right' : 'ap-bubble-left'}`}
                                            >
                                                {!isMine && (
                                                    <div
                                                        className="ap-bubble-avatar"
                                                        style={{ backgroundColor: bg, color: fg, fontSize: '0.75rem', fontWeight: 700, width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                                    >
                                                        {initials}
                                                    </div>
                                                )}
                                                <div className={`ap-bubble ${isMine ? 'ap-bubble-me' : 'ap-bubble-them'}`}>
                                                    <p>{msg.content}</p>
                                                    <span className="ap-bubble-time">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Bar */}
                                <div className="ap-chat-input-bar">
                                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                                        <input
                                            id="chat-input"
                                            className="ap-chat-input"
                                            placeholder={`Message ${activeStudent.name}…`}
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
                                            disabled={sending}
                                        />
                                        <button
                                            id="chat-send-btn"
                                            type="submit"
                                            className="ap-chat-send"
                                            disabled={!inputText.trim() || sending}
                                            style={{ opacity: (!inputText.trim() || sending) ? 0.5 : 1 }}
                                        >
                                            {sending ? '…' : '➤'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        );
                    })() : (
                        /* Empty state – no student selected */
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', background: '#fafafa' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.25rem' }}>
                                💬
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151', margin: 0 }}>Your Messages</h3>
                            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '10px', maxWidth: '280px', lineHeight: 1.6 }}>
                                Select a connected student from the left panel to view or start a conversation.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
