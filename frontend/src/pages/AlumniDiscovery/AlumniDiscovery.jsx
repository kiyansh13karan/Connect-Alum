import React, { useState, useEffect, useContext } from 'react';
import './AlumniDiscovery.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faUserGraduate, faBriefcase, faMapMarkerAlt, faCode, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

const AlumniDiscovery = () => {
    const { url, token } = useContext(StoreContext);
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedAlum, setSelectedAlum] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        company: '',
        role: '',
        location: '',
        gradYear: ''
    });

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axios.get(`${url}/api/alumni?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setAlumni(response.data.alumni);
            }
        } catch (error) {
            console.error("Error fetching alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAlumni();
    }, [token, url]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSendRequest = async () => {
        if (!requestMessage.trim()) return alert("Please enter a message");
        setSending(true);
        try {
            const response = await axios.post(`${url}/api/mentorship/send`, {
                alumniId: selectedAlum._id,
                message: requestMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                alert("Request Sent Successfully!");
                setShowModal(false);
                setRequestMessage("");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Error sending request");
        } finally {
            setSending(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAlumni();
    };

    return (
        <div className="discovery-page animate-fade-in">
            <header className="discovery-header">
                <h1>Find & Connect with <span className="highlight">Alumni</span></h1>
                <p>Collaborate, seek mentorship, and unlock career opportunities.</p>
            </header>

            <div className="discovery-container">
                <aside className="filters-sidebar glass">
                    <div className="filter-group">
                        <h3><FontAwesomeIcon icon={faFilter} /> Filters</h3>
                        <div className="input-group">
                            <label>Keyword</label>
                            <input name="search" placeholder="Name, skills..." value={filters.search} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Company</label>
                            <input name="company" placeholder="e.g. Google" value={filters.company} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Role</label>
                            <input name="role" placeholder="e.g. Frontend Dev" value={filters.role} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Location</label>
                            <input name="location" placeholder="e.g. Bangalore" value={filters.location} onChange={handleFilterChange} />
                        </div>
                        <div className="input-group">
                            <label>Graduation Year</label>
                            <input name="gradYear" type="number" placeholder="e.g. 2022" value={filters.gradYear} onChange={handleFilterChange} />
                        </div>
                        <button className="apply-btn" onClick={fetchAlumni}>Apply Filters</button>
                    </div>
                </aside>

                <main className="alumni-grid">
                    {loading ? (
                        <div className="loading-state">Identifying the best alumni for you...</div>
                    ) : alumni.length > 0 ? (
                        alumni.map((alum) => (
                            <div key={alum._id} className="alumni-card glass-card">
                                <div className="card-header">
                                    <div className="avatar-circle">{alum.name.charAt(0)}</div>
                                    <div className="card-title">
                                        <h4>{alum.name}</h4>
                                        <p className="role-text">{alum.currentRole || "Professional"}</p>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="info-badge">
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        <span>{alum.company || "Stealth Mode"}</span>
                                    </div>
                                    <div className="info-badge">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>{alum.location || "Global"}</span>
                                    </div>
                                    <div className="info-badge">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                        <span>Class of {alum.gradYear || "N/A"}</span>
                                    </div>
                                    {alum.skills && alum.skills.length > 0 && (
                                        <div className="skills-tags">
                                            {alum.skills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="skill-tag">{skill}</span>
                                            ))}
                                            {alum.skills.length > 3 && <span className="skill-more">+{alum.skills.length - 3}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer">
                                    <button className="connect-btn" onClick={() => window.location.href = `/profile/${alum._id}`}>View Profile</button>
                                    <button className="mentor-req-btn" onClick={() => { setSelectedAlum(alum); setShowModal(true); }}>Request Mentorship</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">No alumni found matching your criteria. Try adjusting filters!</div>
                    )}
                </main>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="discovery-modal glass animate-fade-in">
                        <div className="modal-header">
                            <h3>Request Mentorship</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="alum-mini-card">
                                <div className="avatar-circle">{selectedAlum.name.charAt(0)}</div>
                                <div>
                                    <h4>{selectedAlum.name}</h4>
                                    <p>{selectedAlum.currentRole} @ {selectedAlum.company}</p>
                                </div>
                            </div>
                            <label>Why do you want mentorship from {selectedAlum.name}?</label>
                            <textarea
                                placeholder="Briefly describe your goals and what you hope to learn..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="send-btn" onClick={handleSendRequest} disabled={sending}>
                                {sending ? "Sending..." : <><FontAwesomeIcon icon={faPaperPlane} /> Send Request</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniDiscovery;
