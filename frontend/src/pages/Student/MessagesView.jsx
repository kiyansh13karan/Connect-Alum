import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserTie, faComments, faSearch } from '@fortawesome/free-solid-svg-icons';

/* ── Avatar helper ───────────────────────────────────────── */
const avatarPalette = [
    ['#dbeafe', '#1d4ed8'], ['#ede9fe', '#6d28d9'],
    ['#fce7f3', '#9d174d'], ['#dcfce7', '#166534'],
    ['#ffedd5', '#c2410c'], ['#e0f2fe', '#0369a1'],
];
const getAvatar = (name = '') => {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const [bg, fg] = avatarPalette[name.charCodeAt(0) % avatarPalette.length] ?? avatarPalette[0];
    return { initials, bg, fg };
};

/* ── Main Component ──────────────────────────────────────── */
const MessagesView = () => {
    const { url, token } = useContext(StoreContext);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => { fetchContacts(); }, [url, token]);
    useEffect(() => { if (activeContact) fetchMessages(activeContact._id); }, [activeContact]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // Poll for new messages every 5 seconds when a conversation is open
    useEffect(() => {
        if (!activeContact) return;
        const interval = setInterval(() => {
            fetchMessages(activeContact._id);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeContact]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get(url + '/api/student/connections', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const accepted = res.data.requests.filter(r => r.status === 'accepted');
                setContacts(accepted.map(r => r.alumniId));
            }
        } catch (err) { console.error('Error fetching contacts:', err); }
    };

    const fetchMessages = async (alumniId) => {
        try {
            const res = await axios.get(`${url}/api/student/messages/${alumniId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setMessages(res.data.messages);
        } catch (err) { console.error('Error fetching messages:', err); }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeContact) return;
        try {
            const res = await axios.post(`${url}/api/student/message`, {
                receiverId: activeContact._id,
                content: inputText,
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.data]);
                setInputText('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const filteredContacts = contacts.filter(c =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Page Title */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    backgroundColor: '#eff6ff', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>
                    <FontAwesomeIcon icon={faComments} />
                </div>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Messages</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Chat with your connected mentors</p>
                </div>
            </div>

            {/* Two-panel layout */}
            <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0 }}>

                {/* ── Left: Contacts Sidebar ── */}
                <div style={{
                    width: '280px', flexShrink: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Sidebar header */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>
                            Connected Mentors
                            {contacts.length > 0 && (
                                <span style={{
                                    marginLeft: '8px', fontSize: '11px', fontWeight: 600,
                                    backgroundColor: '#dbeafe', color: '#1e40af',
                                    padding: '2px 8px', borderRadius: '999px',
                                }}>
                                    {contacts.length}
                                </span>
                            )}
                        </h2>
                        {/* Search */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
                            borderRadius: '8px', padding: '7px 12px',
                        }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: '#9ca3af', fontSize: '12px' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', color: '#374151' }}
                            />
                        </div>
                    </div>

                    {/* Contact list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredContacts.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                <FontAwesomeIcon icon={faUserTie} style={{ fontSize: '28px', color: '#d1d5db', marginBottom: '12px' }} />
                                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                                    {search ? 'No mentors match search' : 'No connected mentors yet.'}
                                </p>
                                {!search && (
                                    <p style={{ fontSize: '12px', color: '#d1d5db', marginTop: '6px' }}>
                                        Connect with alumni from the Mentors page.
                                    </p>
                                )}
                            </div>
                        ) : filteredContacts.map(contact => {
                            const { initials, bg, fg } = getAvatar(contact.name);
                            const isActive = activeContact?._id === contact._id;
                            return (
                                <div
                                    key={contact._id}
                                    onClick={() => setActiveContact(contact)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 16px',
                                        borderBottom: '1px solid #f9fafb',
                                        cursor: 'pointer',
                                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                        borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                                        transition: 'background 0.15s, border 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        backgroundColor: bg, color: fg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {initials}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#1d4ed8' : '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {contact.name}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {contact.company || 'Mentor'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Right: Chat Area ── */}
                <div style={{
                    flex: 1, minWidth: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {activeContact ? (() => {
                        const { initials, bg, fg } = getAvatar(activeContact.name);
                        return (
                            <>
                                {/* Chat Header */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #f3f4f6',
                                    backgroundColor: '#fafafa',
                                }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '50%',
                                        backgroundColor: bg, color: fg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '15px', fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>{activeContact.name}</h2>
                                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>{activeContact.company || 'Alumni Mentor'}</p>
                                    </div>
                                    <div style={{
                                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '12px', color: '#16a34a', fontWeight: 600,
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                        Connected
                                    </div>
                                </div>

                                {/* Messages */}
                                <div style={{
                                    flex: 1, overflowY: 'auto',
                                    padding: '24px',
                                    backgroundColor: '#f9fafb',
                                    display: 'flex', flexDirection: 'column', gap: '12px',
                                }}>
                                    {messages.length === 0 ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#9ca3af' }}>
                                            <FontAwesomeIcon icon={faComments} style={{ fontSize: '36px', color: '#e5e7eb', marginBottom: '12px' }} />
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', margin: 0 }}>No messages yet</p>
                                            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>Start the conversation below 👇</p>
                                        </div>
                                    ) : messages.map(msg => {
                                        const isMine = msg.sender !== activeContact._id;
                                        return (
                                            <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                                <div style={{
                                                    maxWidth: '68%',
                                                    padding: '10px 14px',
                                                    borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    backgroundColor: isMine ? '#2563eb' : '#fff',
                                                    color: isMine ? '#fff' : '#1f2937',
                                                    border: isMine ? 'none' : '1px solid #e5e7eb',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                }}>
                                                    <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                                                    <p style={{ fontSize: '10px', margin: '4px 0 0 0', textAlign: 'right', color: isMine ? 'rgba(255,255,255,0.65)' : '#9ca3af' }}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', backgroundColor: '#fff' }}>
                                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            placeholder="Type a message..."
                                            style={{
                                                flex: 1, padding: '11px 18px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '999px',
                                                fontSize: '14px', outline: 'none',
                                                backgroundColor: '#f9fafb',
                                                color: '#1f2937',
                                                transition: 'border 0.15s, background 0.15s',
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#93c5fd'; e.target.style.backgroundColor = '#fff'; }}
                                            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputText.trim()}
                                            style={{
                                                width: '44px', height: '44px',
                                                borderRadius: '50%', border: 'none',
                                                backgroundColor: inputText.trim() ? '#2563eb' : '#e5e7eb',
                                                color: inputText.trim() ? '#fff' : '#9ca3af',
                                                cursor: inputText.trim() ? 'pointer' : 'default',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '14px', flexShrink: 0,
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        );
                    })() : (
                        /* Empty state */
                        <div style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center', padding: '40px',
                            backgroundColor: '#fafafa',
                        }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                backgroundColor: '#f3f4f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '28px', color: '#d1d5db', marginBottom: '20px',
                            }}>
                                <FontAwesomeIcon icon={faComments} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: 0 }}>Your Private Messages</h3>
                            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '10px', maxWidth: '280px', lineHeight: 1.6 }}>
                                Select a connected mentor from the left panel to view or start a conversation.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesView;
