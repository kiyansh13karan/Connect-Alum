import React, { useState, useEffect, useContext } from 'react';
import './Mentorship.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faHistory, faClock, faUserTie, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Mentorship = () => {
    const { url, token } = useContext(StoreContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/mentorship/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            const response = await axios.post(`${url}/api/mentorship/update-status`, { requestId, status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                alert(`Request ${status} successfully!`);
                fetchRequests();
            }
        } catch (error) {
            alert("Error updating status");
        }
    };

    useEffect(() => {
        if (token) fetchRequests();
    }, [token, url]);

    if (loading) return <div className="p-20 text-center">Loading Mentorship Portal...</div>;

    return (
        <div className="mentorship-page animate-fade-in">
            <header className="mentorship-header">
                <h1>Mentorship <span className="highlight">Connections</span></h1>
                <p>Manage your professional relationships and growth journey.</p>
            </header>

            <div className="mentorship-content">
                <section className="requests-section glass">
                    <div className="section-title">
                        <h3><FontAwesomeIcon icon={faHistory} /> My Requests</h3>
                        <span className="count-badge">{requests.length} Total</span>
                    </div>

                    <div className="requests-list">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <div key={req._id} className="request-card glass-card">
                                    <div className="request-main">
                                        <div className="user-info">
                                            <div className="avatar-circle">
                                                {(req.alumniId?.name || req.studentId?.name || "?").charAt(0)}
                                            </div>
                                            <div>
                                                <h4>{req.alumniId ? `Mentor: ${req.alumniId.name}` : `Student: ${req.studentId.name}`}</h4>
                                                <p className="subtext">
                                                    {req.alumniId ? `${req.alumniId.currentRole} @ ${req.alumniId.company}` : req.studentId.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="status-container">
                                            <span className={`status-pill ${req.status}`}>
                                                <FontAwesomeIcon icon={req.status === 'pending' ? faClock : (req.status === 'accepted' ? faCheck : faTimes)} />
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="request-message">
                                        <p>"{req.message}"</p>
                                    </div>

                                    {req.alumniId === undefined && req.status === 'pending' && (
                                        <div className="request-actions">
                                            <button className="accept-btn" onClick={() => handleStatusUpdate(req._id, 'accepted')}>
                                                <FontAwesomeIcon icon={faCheck} /> Accept
                                            </button>
                                            <button className="reject-btn" onClick={() => handleStatusUpdate(req._id, 'rejected')}>
                                                <FontAwesomeIcon icon={faTimes} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-requests">
                                <FontAwesomeIcon icon={faUserTie} className="empty-icon" />
                                <p>No mentorship requests yet. Start exploring alumni to connect!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Mentorship;
