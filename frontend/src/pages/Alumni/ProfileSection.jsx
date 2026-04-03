import React, { useState, useRef } from 'react';
import './AlumniPages.css';

const SKILLS = ['React', 'Node.js', 'Python', 'Machine Learning', 'Product Management', 'Leadership', 'Data Science', 'Cloud'];
const EXPERTISE = ['Career Guidance', 'Resume Review', 'Interview Preparation', 'Technical Mentoring', 'Startup Advice'];

const ProfileSection = () => {
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const fileRef = useRef();

    const [form, setForm] = useState({
        name: 'Karan Nayal',
        company: 'Google',
        role: 'Senior Software Engineer',
        experience: '8 Years',
        location: 'Bengaluru, India',
        linkedin: 'linkedin.com/in/karannayal',
        bio: 'Passionate engineer who loves building scalable systems and mentoring the next generation of developers. Previously at Microsoft and Amazon.',
        skills: ['React', 'Node.js', 'Python', 'Cloud'],
        expertise: ['Career Guidance', 'Interview Preparation'],
        available: true,
    });

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const toggleSkill = (s) => {
        set('skills', form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatar(URL.createObjectURL(file));
    };

    return (
        <div className="ap-page">
            {/* Page Header */}
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">My Profile</h1>
                    <p className="ap-page-sub">Manage how students and the network see you</p>
                </div>
                <button
                    className={editing ? 'ap-btn-outline' : 'ap-btn-primary'}
                    onClick={() => setEditing(!editing)}
                    id="edit-profile-toggle"
                >
                    {editing ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
            </div>

            {/* Profile Card */}
            <div className="ap-profile-card">
                {/* Cover bar */}
                <div className="ap-cover" />

                <div className="ap-profile-body">
                    {/* Avatar */}
                    <div className="ap-avatar-section">
                        <div className="ap-avatar-wrap">
                            {avatar
                                ? <img src={avatar} alt="Profile" className="ap-avatar-img" />
                                : <div className="ap-avatar-placeholder">{form.name.charAt(0)}</div>
                            }
                            {editing && (
                                <button className="ap-avatar-upload" onClick={() => fileRef.current.click()} title="Upload photo">
                                    📷
                                </button>
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
                                    { label: 'Full Name', key: 'name', type: 'text' },
                                    { label: 'Company', key: 'company', type: 'text' },
                                    { label: 'Role / Title', key: 'role', type: 'text' },
                                    { label: 'Experience', key: 'experience', type: 'text' },
                                    { label: 'Location', key: 'location', type: 'text' },
                                    { label: 'LinkedIn URL', key: 'linkedin', type: 'text' },
                                ].map(f => (
                                    <div className="ap-form-group" key={f.key}>
                                        <label className="ap-label">{f.label}</label>
                                        <input
                                            type={f.type}
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
                                    />
                                </div>

                                {/* Skills */}
                                <div className="ap-form-group ap-full-row">
                                    <label className="ap-label">Skills</label>
                                    <div className="ap-chips">
                                        {SKILLS.map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => toggleSkill(s)}
                                                className={`ap-chip ${form.skills.includes(s) ? 'ap-chip-active' : ''}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability toggle */}
                                <div className="ap-form-group">
                                    <label className="ap-label">Available for Mentorship</label>
                                    <label className="ap-toggle">
                                        <input
                                            type="checkbox"
                                            checked={form.available}
                                            onChange={e => set('available', e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className={`ap-toggle-track ${form.available ? 'ap-toggle-on' : ''}`}>
                                            <div className="ap-toggle-thumb" />
                                        </div>
                                        <span className="ap-toggle-label">{form.available ? 'Yes' : 'No'}</span>
                                    </label>
                                </div>

                                <div className="ap-full-row">
                                    <button className="ap-btn-primary" onClick={() => setEditing(false)} id="save-profile-btn">
                                        💾 Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="ap-profile-view">
                                <h2 className="ap-profile-name">{form.name}</h2>
                                <p className="ap-profile-role">{form.role} · <span className="ap-profile-company">{form.company}</span></p>
                                <div className="ap-profile-meta">
                                    <span>📍 {form.location}</span>
                                    <span>🏢 {form.experience} experience</span>
                                    <a href={`https://${form.linkedin}`} target="_blank" rel="noreferrer" className="ap-linkedin-link">
                                        🔗 LinkedIn
                                    </a>
                                </div>
                                <p className="ap-profile-bio">{form.bio}</p>

                                <div className="ap-section-label">Skills</div>
                                <div className="ap-chips">
                                    {form.skills.map(s => (
                                        <span key={s} className="ap-chip ap-chip-active">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mentorship Availability Card */}
            <div className="ap-card ap-mt">
                <h3 className="ap-card-title">🎯 Mentorship Availability</h3>
                <div className="ap-mentor-grid">
                    <div className="ap-form-group">
                        <label className="ap-label">Expertise Areas</label>
                        <div className="ap-chips">
                            {EXPERTISE.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => {
                                        const curr = form.expertise;
                                        set('expertise', curr.includes(e) ? curr.filter(x => x !== e) : [...curr, e]);
                                    }}
                                    className={`ap-chip ${form.expertise.includes(e) ? 'ap-chip-active' : ''}`}
                                >
                                    {e}
                                </button>
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
