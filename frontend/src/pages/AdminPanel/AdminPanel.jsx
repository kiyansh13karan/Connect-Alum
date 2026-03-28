import React, { useState, useEffect, useContext } from 'react';
import './AdminPanel.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserCheck, faTrash, faFlag, faChartLine } from '@fortawesome/free-solid-svg-icons';

const AdminPanel = () => {
    const { url, token } = useContext(StoreContext);
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // Simplified: Fetching all alumni to filter pending status
            const response = await axios.get(`${url}/api/alumni`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setPendingAlumni(response.data.alumni.filter(a => !a.isVerified));
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        try {
            await axios.post(`${url}/api/user/update-profile`, { userId, isVerified: true }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Alumni Verified!");
            fetchAdminData();
        } catch (error) {
            alert("Error verifying user");
        }
    };

    useEffect(() => {
        if (token) fetchAdminData();
    }, [token, url]);

    return (
        <div className="admin-page animate-fade-in">
            <header className="admin-header">
                <h1>Admin <span className="highlight">Command Center</span></h1>
                <p>Maintain community integrity and oversee platform operations.</p>
            </header>

            <div className="admin-container">
                <section className="admin-stats glass">
                    <div className="stat-box">
                        <FontAwesomeIcon icon={faChartLine} />
                        <div>
                            <span>Platform Growth</span>
                            <h4>+24% this month</h4>
                        </div>
                    </div>
                </section>

                <main className="admin-content">
                    <section className="admin-section glass">
                        <div className="section-header">
                            <h3><FontAwesomeIcon icon={faUserShield} /> Pending Alumni Verification</h3>
                            <span className="count-badge">{pendingAlumni.length} Pending</span>
                        </div>
                        <div className="verification-list">
                            {pendingAlumni.length > 0 ? (
                                pendingAlumni.map(user => (
                                    <div key={user._id} className="verify-card glass-card">
                                        <div className="user-details">
                                            <h4>{user.name}</h4>
                                            <p>{user.company} • Class of {user.gradYear}</p>
                                            <span className="email-text">{user.email}</span>
                                        </div>
                                        <div className="verify-actions">
                                            <button className="approve-btn" onClick={() => handleVerify(user._id)}>
                                                <FontAwesomeIcon icon={faUserCheck} /> Approve
                                            </button>
                                            <button className="reject-btn">
                                                <FontAwesomeIcon icon={faTrash} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">No pending verifications. All alumni are verified!</p>
                            )}
                        </div>
                    </section>

                    <section className="admin-section glass">
                        <div className="section-header">
                            <h3><FontAwesomeIcon icon={faFlag} /> Reported Content</h3>
                        </div>
                        <div className="reports-list">
                            <p className="empty-state">Healthy community! No reports at the moment.</p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
