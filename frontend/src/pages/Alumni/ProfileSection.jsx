import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './AlumniPages.css';

const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Machine Learning', 'Product Management',
    'Leadership', 'Data Science', 'Cloud', 'Java', 'Design', 'Marketing', 'Finance'];
const EXPERTISE_LIST = ['Career Guidance', 'Resume Review', 'Interview Preparation',
    'Technical Mentoring', 'Startup Advice', 'Networking', 'Salary Negotiation'];

const ProfileSection = () => {
    const { url, token } = useContext(StoreContext);
    const [editing, setEditing]     = useState(false);
    const [saving, setSaving]       = useState(false);
    const [saved, setSaved]         = useState(false);
    const [loading, setLoading]     = useState(true);
    const [avatar, setAvatar]       = useState(null);
    const fileRef = useRef();

    const [form, setForm] = useState({
        name: '', company: '', currentRole: '', experience: '',
        location: '', linkedin: '', bio: '', skills: [], available: true,
    });
    const [savedForm, setSavedForm] = useState(form);

    /* ── Fetch real profile on mount ───────────────── */
    useEffect(() => {
        const load = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${url}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    const u = res.data.user;
                    const data = {
                        name: u.name || '',
                        company: u.company || '',
                        currentRole: u.currentRole || '',
                        experience: u.experience || '',
                        location: u.location || '',
                        linkedin: u.linkedin || '',
                        bio: u.bio || '',
                        skills: u.skills || [],
                        available: true,
                    };
                    setForm(data);
                    setSavedForm(data);
                    if (u.photo) setAvatar(u.photo);
                }
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [url, token]);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const toggleSkill = (s) =>
        set('skills', form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatar(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${url}/api/user/update-profile`, {
                name: form.name,
                company: form.company,
                currentRole: form.currentRole,
                experience: form.experience,
                location: form.location,
                linkedin: form.linkedin,
                bio: form.bio,
                skills: form.skills,
            }, { headers: { Authorization: `Bearer ${token}` } });
            setSavedForm(form);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm(savedForm);
        setEditing(false);
    };

    if (loading) return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">My Profile</h1>
                    <p className="ap-page-sub">Loading your profile…</p>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[120, 200, 100].map((h, i) => (
                    <div key={i} style={{
                        height: h, borderRadius: 16,
                        background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'apShimmer 1.5s infinite',
                    }} />
                ))}
            </div>
        </div>
    );

    const initial = form.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <div className="ap-page">
            {/* Success toast */}
            {saved && (
                <div className="ap-success-toast">
                    ✅ Profile saved successfully!
                </div>
            )}

            {/* Page Header */}
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">My Profile</h1>
                    <p className="ap-page-sub">Manage how students and the network see you</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {editing && (
                        <button className="ap-btn-outline" onClick={handleCancel} id="cancel-profile-btn">
                            ✕ Cancel
                        </button>
                    )}
                    <button
                        className={editing ? 'ap-btn-primary' : 'ap-btn-outline'}
                        onClick={editing ? handleSave : () => setEditing(true)}
                        id="edit-profile-toggle"
                        disabled={saving}
                        style={{ opacity: saving ? 0.7 : 1 }}
                    >
                        {saving ? '⏳ Saving…' : editing ? '💾 Save Changes' : '✏️ Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="ap-profile-card">
                <div className="ap-cover" />
                <div className="ap-profile-body">

                    {/* Avatar */}
                    <div className="ap-avatar-section">
                        <div className="ap-avatar-wrap">
                            {avatar
                                ? <img src={avatar} alt="Profile" className="ap-avatar-img" />
                                : <div className="ap-avatar-placeholder">{initial}</div>
                            }
                            {editing && (
                                <button className="ap-avatar-upload" onClick={() => fileRef.current.click()} title="Upload photo">📷</button>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div className="ap-availability-badge">
                            <span className={`ap-avail-dot ${form.available ? 'ap-avail-on' : 'ap-avail-off'}`} />
                            {form.available ? 'Available for Mentorship' : 'Not Available'}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="ap-profile-details">
                        {editing ? (
                            <div className="ap-form-grid">
                                {[
                                    { label: 'Full Name',      key: 'name' },
                                    { label: 'Company',        key: 'company' },
                                    { label: 'Role / Title',   key: 'currentRole' },
                                    { label: 'Experience',     key: 'experience' },
                                    { label: 'Location',       key: 'location' },
                                    { label: 'LinkedIn URL',   key: 'linkedin' },
                                ].map(f => (
                                    <div className="ap-form-group" key={f.key}>
                                        <label className="ap-label">{f.label}</label>
                                        <input
                                            type="text"
                                            className="ap-input"
                                            value={form[f.key]}
                                            onChange={e => set(f.key, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <div className="ap-form-group ap-full-row">
                                    <label className="ap-label">Bio</label>
                                    <textarea
                                        className="ap-input ap-textarea"
                                        value={form.bio}
                                        onChange={e => set('bio', e.target.value)}
                                        rows={3}
                                        placeholder="Write a short bio that students will see on your profile…"
                                    />
                                </div>

                                <div className="ap-form-group ap-full-row">
                                    <label className="ap-label">Skills (click to toggle)</label>
                                    <div className="ap-chips">
                                        {SKILLS_LIST.map(s => (
                                            <button
                                                key={s} type="button"
                                                onClick={() => toggleSkill(s)}
                                                className={`ap-chip ${form.skills.includes(s) ? 'ap-chip-active' : ''}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="ap-form-group">
                                    <label className="ap-label">Available for Mentorship</label>
                                    <label className="ap-toggle">
                                        <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} className="hidden" />
                                        <div className={`ap-toggle-track ${form.available ? 'ap-toggle-on' : ''}`}>
                                            <div className="ap-toggle-thumb" />
                                        </div>
                                        <span className="ap-toggle-label">{form.available ? 'Yes' : 'No'}</span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="ap-profile-view">
                                <h2 className="ap-profile-name">{form.name || 'Your Name'}</h2>
                                <p className="ap-profile-role">
                                    {form.currentRole || 'Role'} · <span className="ap-profile-company">{form.company || 'Company'}</span>
                                </p>
                                <div className="ap-profile-meta">
                                    {form.location && <span>📍 {form.location}</span>}
                                    {form.experience && <span>🏢 {form.experience} experience</span>}
                                    {form.linkedin && (
                                        <a href={form.linkedin.startsWith('http') ? form.linkedin : `https://${form.linkedin}`}
                                            target="_blank" rel="noreferrer" className="ap-linkedin-link">
                                            🔗 LinkedIn
                                        </a>
                                    )}
                                </div>
                                <p className="ap-profile-bio">{form.bio || 'No bio added yet. Click "Edit Profile" to add one.'}</p>
                                <div className="ap-section-label">Skills</div>
                                <div className="ap-chips">
                                    {form.skills.length > 0
                                        ? form.skills.map(s => <span key={s} className="ap-chip ap-chip-active">{s}</span>)
                                        : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No skills added yet.</span>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mentorship Availability Card */}
            <div className="ap-card ap-mt">
                <h3 className="ap-card-title">🎯 Mentorship Expertise</h3>
                <div className="ap-mentor-grid">
                    <div className="ap-form-group">
                        <label className="ap-label">Areas of Expertise</label>
                        <div className="ap-chips">
                            {EXPERTISE_LIST.map(e => (
                                <button
                                    key={e} type="button"
                                    className="ap-chip ap-chip-active"
                                    style={{ cursor: 'default' }}
                                >{e}</button>
                            ))}
                        </div>
                    </div>
                    <div className="ap-form-group">
                        <label className="ap-label">Time Availability</label>
                        <select className="ap-input">
                            <option>Weekday Evenings (6–9 PM)</option>
                            <option>Weekends (10 AM – 2 PM)</option>
                            <option>Flexible Schedule</option>
                            <option>By appointment only</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
