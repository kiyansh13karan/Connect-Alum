import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperPlane, faUserTie, faComments, faSearch,
    faPaperclip, faFile, faFilePdf, faFileWord, faFileImage,
    faTimes, faDownload,
} from '@fortawesome/free-solid-svg-icons';

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

/* ── File icon helper ────────────────────────────────────── */
const getFileIcon = (fileType = '') => {
    if (fileType.includes('pdf')) return faFilePdf;
    if (fileType.includes('word') || fileType.includes('document')) return faFileWord;
    if (fileType.includes('image')) return faFileImage;
    return faFile;
};

const getFileIconColor = (fileType = '') => {
    if (fileType.includes('pdf')) return '#ef4444';
    if (fileType.includes('word') || fileType.includes('document')) return '#2563eb';
    if (fileType.includes('image')) return '#10b981';
    return '#6366f1';
};

/* ── Open data: URL in new tab via Blob ─────────────────── */
const openInNewTab = (dataUrl, fileType) => {
    try {
        const [meta, base64] = dataUrl.split(',');
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: fileType || 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    } catch (e) {
        console.error('Could not open file:', e);
    }
};

/* ── File size formatter ─────────────────────────────────── */
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/* ── Main Component ──────────────────────────────────────── */
const MessagesView = () => {
    const { url, token } = useContext(StoreContext);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [search, setSearch] = useState('');
    const [attachedFile, setAttachedFile] = useState(null); // { name, type, dataUrl }
    const [fileError, setFileError] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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

    /* ── Handle file selection ── */
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileError('');

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setFileError(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setAttachedFile({ name: file.name, type: file.type, dataUrl: ev.target.result });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const removeAttachment = () => {
        setAttachedFile(null);
        setFileError('');
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!inputText.trim() && !attachedFile) || !activeContact) return;
        try {
            const payload = {
                receiverId: activeContact._id,
                content: inputText,
            };
            if (attachedFile) {
                payload.fileUrl = attachedFile.dataUrl;
                payload.fileName = attachedFile.name;
                payload.fileType = attachedFile.type;
            }
            const res = await axios.post(`${url}/api/student/message`, payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setMessages(prev => [...prev, res.data.data]);
                setInputText('');
                setAttachedFile(null);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const filteredContacts = contacts.filter(c =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
    );

    /* ── File bubble renderer ── */
    const renderFileBubble = (msg, isMine) => {
        if (!msg.fileUrl) return null;
        const isImage = msg.fileType?.includes('image');
        const iconColor = getFileIconColor(msg.fileType);
        return (
            <div style={{
                marginTop: msg.content ? '8px' : '0',
                borderRadius: '10px',
                overflow: 'hidden',
                border: isMine ? '1px solid rgba(255,255,255,0.25)' : '1px solid #e5e7eb',
            }}>
                {isImage ? (
                    <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: '200px', maxHeight: '160px', display: 'block', borderRadius: '8px' }} />
                ) : (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px',
                        backgroundColor: isMine ? 'rgba(255,255,255,0.12)' : '#f3f4f6',
                        borderRadius: '10px',
                    }}>
                        <FontAwesomeIcon icon={getFileIcon(msg.fileType)} style={{ fontSize: '22px', color: isMine ? '#fff' : iconColor, flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: isMine ? '#fff' : '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                {msg.fileName}
                            </p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: isMine ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                                Shared document
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button
                                onClick={() => openInNewTab(msg.fileUrl, msg.fileType)}
                                style={{
                                    padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                                    borderRadius: '6px', textDecoration: 'none', cursor: 'pointer',
                                    backgroundColor: isMine ? 'rgba(255,255,255,0.25)' : '#dbeafe',
                                    color: isMine ? '#fff' : '#1d4ed8',
                                    border: isMine ? '1px solid rgba(255,255,255,0.4)' : '1px solid #bfdbfe',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Open
                            </button>
                            <a
                                href={msg.fileUrl}
                                download={msg.fileName}
                                style={{
                                    padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                                    borderRadius: '6px', textDecoration: 'none', cursor: 'pointer',
                                    backgroundColor: isMine ? 'rgba(255,255,255,0.15)' : '#f3f4f6',
                                    color: isMine ? '#fff' : '#374151',
                                    border: isMine ? '1px solid rgba(255,255,255,0.3)' : '1px solid #d1d5db',
                                }}
                            >
                                Save
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Chat & share documents with your connected mentors</p>
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
                                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px',
                                    }}>
                                        {/* Document share hint */}
                                        <span style={{
                                            fontSize: '11px', color: '#6b7280',
                                            backgroundColor: '#f3f4f6', padding: '4px 10px',
                                            borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '5px',
                                        }}>
                                            <FontAwesomeIcon icon={faPaperclip} style={{ fontSize: '10px' }} />
                                            Docs up to 5MB
                                        </span>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            fontSize: '12px', color: '#16a34a', fontWeight: 600,
                                        }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                            Connected
                                        </div>
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
                                        const hasFile = !!msg.fileUrl;
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
                                                    {msg.content && (
                                                        <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                                                    )}
                                                    {hasFile && renderFileBubble(msg, isMine)}
                                                    <p style={{ fontSize: '10px', margin: '4px 0 0 0', textAlign: 'right', color: isMine ? 'rgba(255,255,255,0.65)' : '#9ca3af' }}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Attachment Preview */}
                                {attachedFile && (
                                    <div style={{
                                        padding: '10px 20px',
                                        borderTop: '1px solid #f3f4f6',
                                        backgroundColor: '#eff6ff',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                    }}>
                                        <FontAwesomeIcon icon={getFileIcon(attachedFile.type)} style={{ fontSize: '20px', color: getFileIconColor(attachedFile.type) }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1d4ed8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {attachedFile.name}
                                            </p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>Ready to send</p>
                                        </div>
                                        <button onClick={removeAttachment} style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            border: 'none', backgroundColor: '#dbeafe', color: '#1d4ed8',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '12px', flexShrink: 0,
                                        }}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                )}

                                {/* File error */}
                                {fileError && (
                                    <div style={{ padding: '8px 20px', backgroundColor: '#fef2f2', borderTop: '1px solid #fecaca' }}>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>⚠️ {fileError}</p>
                                    </div>
                                )}

                                {/* Input */}
                                <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', backgroundColor: '#fff' }}>
                                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {/* Hidden file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx,.ppt,.pptx"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        {/* Attach button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach document"
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: attachedFile ? '#dbeafe' : '#f9fafb',
                                                color: attachedFile ? '#2563eb' : '#9ca3af',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '15px', flexShrink: 0, transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#dbeafe'; e.currentTarget.style.color = '#2563eb'; }}
                                            onMouseLeave={e => { if (!attachedFile) { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#9ca3af'; } }}
                                        >
                                            <FontAwesomeIcon icon={faPaperclip} />
                                        </button>
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            placeholder={attachedFile ? 'Add a message (optional)…' : 'Type a message…'}
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
                                            disabled={!inputText.trim() && !attachedFile}
                                            style={{
                                                width: '44px', height: '44px',
                                                borderRadius: '50%', border: 'none',
                                                backgroundColor: (inputText.trim() || attachedFile) ? '#2563eb' : '#e5e7eb',
                                                color: (inputText.trim() || attachedFile) ? '#fff' : '#9ca3af',
                                                cursor: (inputText.trim() || attachedFile) ? 'pointer' : 'default',
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
                            <p style={{ fontSize: '12px', color: '#c4b5fd', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FontAwesomeIcon icon={faPaperclip} /> You can share documents & files in chat
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesView;
