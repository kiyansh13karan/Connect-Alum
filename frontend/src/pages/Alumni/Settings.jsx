import React, { useState } from 'react';
import './AlumniPages.css';

const Settings = () => {
    const [mentorAvail, setMentorAvail] = useState(true);
    const [expertise, setExpertise] = useState(['Career Guidance', 'Interview Preparation']);
    const [timeSlot, setTimeSlot] = useState('evenings');
    const [notifs, setNotifs] = useState({
        newRequests: true, messages: true, eventReminders: false, weeklyDigest: true,
    });

    const toggleExpertise = (e) =>
        setExpertise(ex => ex.includes(e) ? ex.filter(x => x !== e) : [...ex, e]);

    const EXPERTISE_LIST = ['Career Guidance', 'Resume Review', 'Interview Preparation', 'Technical Mentoring', 'Startup Advice', 'Higher Education'];
    const NOTIF_LABELS = { newRequests: 'New mentorship requests', messages: 'New messages', eventReminders: 'Event reminders', weeklyDigest: 'Weekly digest email' };

    return (
        <div className="ap-page">
            <div className="ap-page-header">
                <div>
                    <h1 className="ap-page-title">Settings</h1>
                    <p className="ap-page-sub">Manage your mentorship preferences and account settings</p>
                </div>
            </div>

            <div className="ap-settings-layout">
                {/* Mentorship Settings */}
                <div className="ap-card">
                    <h3 className="ap-card-title">🎯 Mentorship Settings</h3>

                    <div className="ap-setting-row">
                        <div>
                            <p className="ap-setting-label">Available for Mentorship</p>
                            <p className="ap-setting-sub">Students can send you mentorship requests</p>
                        </div>
                        <label className="ap-toggle">
                            <input type="checkbox" className="hidden" checked={mentorAvail} onChange={e => setMentorAvail(e.target.checked)} />
                            <div className={`ap-toggle-track ${mentorAvail ? 'ap-toggle-on' : ''}`} onClick={() => setMentorAvail(!mentorAvail)}>
                                <div className="ap-toggle-thumb" />
                            </div>
                        </label>
                    </div>

                    <div className="ap-setting-section">
                        <p className="ap-setting-label">Expertise Areas</p>
                        <p className="ap-setting-sub">Choose what topics you can mentor students on</p>
                        <div className="ap-chips ap-mt-sm">
                            {EXPERTISE_LIST.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => toggleExpertise(e)}
                                    className={`ap-chip ${expertise.includes(e) ? 'ap-chip-active' : ''}`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ap-setting-section">
                        <p className="ap-setting-label">Time Availability</p>
                        <p className="ap-setting-sub">When are you available for mentorship sessions?</p>
                        <select
                            className="ap-input ap-mt-sm"
                            value={timeSlot}
                            onChange={e => setTimeSlot(e.target.value)}
                        >
                            <option value="mornings">Weekday Mornings (9 AM – 12 PM)</option>
                            <option value="evenings">Weekday Evenings (6 PM – 9 PM)</option>
                            <option value="weekends">Weekends (10 AM – 2 PM)</option>
                            <option value="flexible">Flexible Schedule</option>
                            <option value="appointment">By Appointment Only</option>
                        </select>
                    </div>

                    <div className="ap-setting-section">
                        <p className="ap-setting-label">Max Monthly Sessions</p>
                        <p className="ap-setting-sub">Limit how many sessions you take per month</p>
                        <select className="ap-input ap-mt-sm">
                            <option>2 sessions / month</option>
                            <option>4 sessions / month</option>
                            <option>8 sessions / month</option>
                            <option>Unlimited</option>
                        </select>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="ap-card">
                    <h3 className="ap-card-title">🔔 Notifications</h3>
                    {Object.entries(notifs).map(([key, val]) => (
                        <div className="ap-setting-row ap-setting-row-sm" key={key}>
                            <div>
                                <p className="ap-setting-label">{NOTIF_LABELS[key]}</p>
                            </div>
                            <label className="ap-toggle">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={val}
                                    onChange={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                                />
                                <div
                                    className={`ap-toggle-track ${val ? 'ap-toggle-on' : ''}`}
                                    onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                                >
                                    <div className="ap-toggle-thumb" />
                                </div>
                            </label>
                        </div>
                    ))}

                    {/* Account Actions */}
                    <div className="ap-card-title ap-mt">⚠️ Account</div>
                    <div className="ap-danger-zone">
                        <div>
                            <p className="ap-setting-label">Delete Account</p>
                            <p className="ap-setting-sub">Permanently delete your account and all data</p>
                        </div>
                        <button className="ap-btn-danger" id="delete-account-btn">Delete</button>
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="ap-settings-save">
                <button className="ap-btn-primary" id="save-settings-btn">💾 Save Settings</button>
            </div>
        </div>
    );
};

export default Settings;
