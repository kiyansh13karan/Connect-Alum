import React, { useState, useRef, useEffect } from 'react';
import './AlumniPages.css';

const CONTACTS = [
    { id: 1, name: 'Ananya Singh', avatar: 'A', color: 'ap-av-blue', lastMsg: 'Thank you so much!', time: '2m', unread: 2 },
    { id: 2, name: 'Rahul Sharma', avatar: 'R', color: 'ap-av-violet', lastMsg: 'When can we schedule?', time: '1h', unread: 0 },
    { id: 3, name: 'Priya Mehta', avatar: 'P', color: 'ap-av-green', lastMsg: 'Sounds great, thanks!', time: '3h', unread: 1 },
    { id: 4, name: 'Varun Kapoor', avatar: 'V', color: 'ap-av-amber', lastMsg: 'I will send my resume.', time: 'Yesterday', unread: 0 },
    { id: 5, name: 'Sneha Roy', avatar: 'S', color: 'ap-av-rose', lastMsg: 'Noted, will try again.', time: '2d', unread: 0 },
];

const INITIAL_MESSAGES = {
    1: [
        { id: 1, from: 'them', text: 'Hi! I got the interview call. Thank you so much for the prep tips!', time: '10:14 AM' },
        { id: 2, from: 'me', text: 'Congratulations Ananya! You worked really hard. All the best for the next rounds!', time: '10:17 AM' },
        { id: 3, from: 'them', text: 'Thank you so much! 🙏', time: '10:20 AM' },
    ],
    2: [
        { id: 1, from: 'them', text: 'Hi, I wanted to discuss transitioning into product management.', time: 'Yesterday' },
        { id: 2, from: 'me', text: 'Happy to help! When can we schedule a call?', time: 'Yesterday' },
        { id: 3, from: 'them', text: 'When can we schedule?', time: '1h ago' },
    ],
    3: [
        { id: 1, from: 'them', text: 'I reviewed my research direction as you suggested. Sounds great, thanks!', time: '3h ago' },
    ],
    4: [{ id: 1, from: 'them', text: 'I will send my resume for review.', time: 'Yesterday' }],
    5: [{ id: 1, from: 'them', text: 'Noted, will try again next time.', time: '2d ago' }],
};

const Messages = () => {
    const [active, setActive] = useState(CONTACTS[0]);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');
    const bottomRef = useRef();

    const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const chat = messages[active.id] || [];

    const send = () => {
        if (!text.trim()) return;
        const msg = { id: Date.now(), from: 'me', text: text.trim(), time: 'Now' };
        setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), msg] }));
        setText('');
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.length]);

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Messages</h1>
                    <p className="ap-page-sub">Chat with your mentees</p>
                </div>
            </div>

            <div className="ap-messages-layout">
                {/* Sidebar */}
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
                        {filtered.map(c => (
                            <button
                                key={c.id}
                                id={`contact-${c.id}`}
                                className={`ap-contact-item ${active.id === c.id ? 'ap-contact-active' : ''}`}
                                onClick={() => setActive(c)}
                            >
                                <div className={`ap-contact-avatar ${c.color}`}>{c.avatar}</div>
                                <div className="ap-contact-info">
                                    <div className="ap-contact-top">
                                        <span className="ap-contact-name">{c.name}</span>
                                        <span className="ap-contact-time">{c.time}</span>
                                    </div>
                                    <div className="ap-contact-bottom">
                                        <span className="ap-contact-last">{c.lastMsg}</span>
                                        {c.unread > 0 && <span className="ap-unread-badge">{c.unread}</span>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="ap-chat-window">
                    {/* Header */}
                    <div className="ap-chat-header">
                        <div className={`ap-chat-header-avatar ${active.color}`}>{active.avatar}</div>
                        <div>
                            <h4 className="ap-chat-header-name">{active.name}</h4>
                            <p className="ap-chat-header-status">🟢 Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="ap-chat-body">
                        {chat.map(m => (
                            <div key={m.id} className={`ap-bubble-wrap ${m.from === 'me' ? 'ap-bubble-right' : 'ap-bubble-left'}`}>
                                {m.from === 'them' && (
                                    <div className={`ap-bubble-avatar ${active.color}`}>{active.avatar}</div>
                                )}
                                <div className={`ap-bubble ${m.from === 'me' ? 'ap-bubble-me' : 'ap-bubble-them'}`}>
                                    <p>{m.text}</p>
                                    <span className="ap-bubble-time">{m.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="ap-chat-input-bar">
                        <input
                            className="ap-chat-input"
                            placeholder={`Message ${active.name}...`}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && send()}
                            id="chat-input"
                        />
                        <button className="ap-chat-send" onClick={send} id="chat-send-btn">
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
