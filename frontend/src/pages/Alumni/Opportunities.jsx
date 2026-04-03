import React, { useState } from 'react';
import './AlumniPages.css';

const POSTED = [
    { id: 1, type: 'Job', title: 'Frontend Engineer', company: 'Google', location: 'Bengaluru', posted: '2 days ago', applicants: 14 },
    { id: 2, type: 'Internship', title: 'ML Research Intern', company: 'DeepMind', location: 'Remote', posted: '5 days ago', applicants: 31 },
    { id: 3, type: 'Referral', title: 'SDE-2 Referral', company: 'Amazon', location: 'Hyderabad', posted: '1 week ago', applicants: 8 },
];

const TYPE_COLORS = { Job: 'ap-tag-job', Internship: 'ap-tag-intern', Referral: 'ap-tag-referral' };

const EMPTY_FORM = { title: '', company: '', role: '', description: '', location: '', applyLink: '' };

const Opportunities = () => {
    const [activeType, setActiveType] = useState('Job');
    const [form, setForm] = useState(EMPTY_FORM);
    const [posted, setPosted] = useState(POSTED);
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handlePost = (e) => {
        e.preventDefault();
        if (!form.title || !form.company) return;
        setPosted(p => [{
            id: Date.now(), type: activeType, title: form.title,
            company: form.company, location: form.location, posted: 'Just now', applicants: 0
        }, ...p]);
        setForm(EMPTY_FORM);
        setSuccess(true);
        setShowForm(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Opportunities</h1>
                    <p className="ap-page-sub">Share jobs, internships and referrals with students</p>
                </div>
                <button className="ap-btn-primary" onClick={() => setShowForm(!showForm)} id="post-opp-btn">
                    {showForm ? '✕ Cancel' : '+ Post Opportunity'}
                </button>
            </div>

            {success && (
                <div className="ap-success-toast">
                    ✅ Opportunity posted successfully!
                </div>
            )}

            {/* Post Form */}
            {showForm && (
                <div className="ap-card ap-mb">
                    <h3 className="ap-card-title">📢 New Opportunity</h3>

                    {/* Type Selector */}
                    <div className="ap-type-tabs">
                        {['Job', 'Internship', 'Referral'].map(t => (
                            <button
                                key={t}
                                id={`opp-type-${t.toLowerCase()}`}
                                className={`ap-type-tab ${activeType === t ? 'ap-type-active' : ''}`}
                                onClick={() => setActiveType(t)}
                            >
                                {t === 'Job' ? '💼' : t === 'Internship' ? '🎓' : '🤝'} {t}
                            </button>
                        ))}
                    </div>

                    <form className="ap-form-grid" onSubmit={handlePost}>
                        {[
                            { label: 'Opportunity Title', key: 'title', placeholder: 'e.g. Frontend Engineer' },
                            { label: 'Company', key: 'company', placeholder: 'e.g. Google' },
                            { label: 'Role / Position', key: 'role', placeholder: 'e.g. SDE-2' },
                            { label: 'Location', key: 'location', placeholder: 'e.g. Remote / Bengaluru' },
                            { label: 'Apply Link', key: 'applyLink', placeholder: 'https://...' },
                        ].map(f => (
                            <div className="ap-form-group" key={f.key}>
                                <label className="ap-label">{f.label}</label>
                                <input
                                    type="text"
                                    className="ap-input"
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => set(f.key, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="ap-form-group ap-full-row">
                            <label className="ap-label">Description</label>
                            <textarea
                                className="ap-input ap-textarea"
                                placeholder="Describe the role, requirements, and any special notes..."
                                rows={4}
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                            />
                        </div>
                        <div className="ap-full-row">
                            <button type="submit" className="ap-btn-primary" id="submit-opp-btn">
                                📤 Post Opportunity
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posted List */}
            <div className="ap-card">
                <h3 className="ap-card-title">📋 Posted Opportunities</h3>

                {/* Filter */}
                <div className="ap-filter-tabs ap-mb-sm">
                    {['All', 'Job', 'Internship', 'Referral'].map(t => (
                        <button key={t} className="ap-filter-tab ap-filter-active">{t}</button>
                    ))}
                </div>

                <div className="ap-opp-list">
                    {posted.map(opp => (
                        <div key={opp.id} className="ap-opp-row">
                            <div className="ap-opp-left">
                                <span className={`ap-tag ${TYPE_COLORS[opp.type]}`}>{opp.type}</span>
                                <div>
                                    <h4 className="ap-opp-title">{opp.title}</h4>
                                    <p className="ap-opp-meta">
                                        🏢 {opp.company} &nbsp;·&nbsp; 📍 {opp.location} &nbsp;·&nbsp; 🕒 {opp.posted}
                                    </p>
                                </div>
                            </div>
                            <div className="ap-opp-right">
                                <span className="ap-opp-applicants">{opp.applicants} applicants</span>
                                <button className="ap-btn-ghost">View</button>
                                <button
                                    className="ap-btn-danger-ghost"
                                    onClick={() => setPosted(p => p.filter(x => x.id !== opp.id))}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    {posted.length === 0 && (
                        <div className="ap-empty-card">
                            <p className="ap-empty-icon">📭</p>
                            <p className="ap-empty-title">No opportunities posted yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
