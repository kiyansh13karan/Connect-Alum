import React, { useState, useEffect, useContext } from 'react';
import './AlumniPages.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const TYPE_COLORS = { Job: 'ap-tag-job', Internship: 'ap-tag-intern', Referral: 'ap-tag-referral' };
const TYPE_ICONS  = { Job: '💼', Internship: '🎓', Referral: '🤝' };
const EMPTY_FORM  = { title: '', company: '', role: '', description: '', location: '', applyLink: '' };

const Opportunities = () => {
    const { url, token } = useContext(StoreContext);

    const [activeType, setActiveType] = useState('Job');
    const [form, setForm]             = useState(EMPTY_FORM);
    const [posted, setPosted]         = useState([]);
    const [showForm, setShowForm]     = useState(false);
    const [success, setSuccess]       = useState(false);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState('All');
    const [error, setError]           = useState('');

    // ── fetch alumni's own posts ──────────────────────────────────────────
    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url}/api/jobs/alumni-posts`);
            if (res.data.success) {
                // show only current alumni's posts
                const userId = JSON.parse(atob(token.split('.')[1])).id;
                const mine   = res.data.posts.filter(p => p.postedBy?._id === userId || p.postedBy === userId);
                setPosted(mine);
            }
        } catch (err) {
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchMyPosts();
    }, [token]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // ── post a new opportunity ────────────────────────────────────────────
    const handlePost = async (e) => {
        e.preventDefault();
        if (!form.title || !form.company) return;
        setError('');
        try {
            const res = await axios.post(
                `${url}/api/jobs/alumni-post`,
                { ...form, type: activeType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setPosted(prev => [res.data.post, ...prev]);
                setForm(EMPTY_FORM);
                setSuccess(true);
                setShowForm(false);
                setTimeout(() => setSuccess(false), 3500);
            }
        } catch (err) {
            console.error('Error posting opportunity:', err);
            setError(err.response?.data?.message || 'Failed to post. Please try again.');
        }
    };

    // ── remove a post ─────────────────────────────────────────────────────
    const handleRemove = async (id) => {
        try {
            await axios.delete(`${url}/api/jobs/alumni-post/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosted(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Error removing post:', err);
        }
    };

    const filtered = filter === 'All' ? posted : posted.filter(p => p.type === filter);

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
                    ✅ Opportunity posted! Students can now see it in their Jobs section.
                </div>
            )}

            {error && (
                <div className="ap-error-toast">
                    ⚠️ {error}
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
                                {TYPE_ICONS[t]} {t}
                            </button>
                        ))}
                    </div>

                    <form className="ap-form-grid" onSubmit={handlePost}>
                        {[
                            { label: 'Opportunity Title', key: 'title',    placeholder: 'e.g. Frontend Engineer' },
                            { label: 'Company',           key: 'company',  placeholder: 'e.g. Google' },
                            { label: 'Role / Position',   key: 'role',     placeholder: 'e.g. SDE-2' },
                            { label: 'Location',          key: 'location', placeholder: 'e.g. Remote / Bengaluru' },
                            { label: 'Apply Link',        key: 'applyLink', placeholder: 'https://...' },
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
                        <button
                            key={t}
                            className={`ap-filter-tab ${filter === t ? 'ap-filter-active' : ''}`}
                            onClick={() => setFilter(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="ap-opp-list">
                    {loading ? (
                        <div className="ap-empty-card">
                            <p className="ap-empty-icon">⏳</p>
                            <p className="ap-empty-title">Loading your posts...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.map(opp => (
                            <div key={opp._id} className="ap-opp-row">
                                <div className="ap-opp-left">
                                    <span className={`ap-tag ${TYPE_COLORS[opp.type]}`}>{opp.type}</span>
                                    <div>
                                        <h4 className="ap-opp-title">{opp.title}</h4>
                                        <p className="ap-opp-meta">
                                            🏢 {opp.company} &nbsp;·&nbsp; 📍 {opp.location} &nbsp;·&nbsp;
                                            🕒 {new Date(opp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        {opp.description && (
                                            <p className="ap-opp-desc">{opp.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="ap-opp-right">
                                    {opp.applyLink && (
                                        <a
                                            href={opp.applyLink.startsWith('http') ? opp.applyLink : `https://${opp.applyLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ap-btn-ghost"
                                        >
                                            View
                                        </a>
                                    )}
                                    <button
                                        className="ap-btn-danger-ghost"
                                        onClick={() => handleRemove(opp._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="ap-empty-card">
                            <p className="ap-empty-icon">📭</p>
                            <p className="ap-empty-title">No opportunities posted yet</p>
                            <p className="ap-empty-sub">Click "Post Opportunity" to share a job with students.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
