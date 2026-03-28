import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBriefcase, faGraduationCap, faLink, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${url}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setUserData(response.data.user);
                    setEditData(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        if (token) fetchProfile();
    }, [token, url]);

    const handleUpdate = async () => {
        try {
            const response = await axios.post(`${url}/api/user/update-profile`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setUserData(editData);
                setIsEditing(false);
                alert("Profile Updated Successfully!");
            }
        } catch (error) {
            alert("Error updating profile");
        }
    };

    if (!userData) return <div className="p-20 text-center">Loading Profile...</div>;

    return (
        <div className="profile-page animate-fade-in">
            <div className="profile-container glass">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {userData.name.charAt(0)}
                    </div>
                    <div className="profile-info-main">
                        <h1>{userData.name}</h1>
                        <p className="role-badge">{userData.role.toUpperCase()}</p>
                    </div>
                    {!isEditing ? (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            <FontAwesomeIcon icon={faEdit} /> Edit Profile
                        </button>
                    ) : (
                        <div className="action-btns">
                            <button className="save-btn" onClick={handleUpdate}>
                                <FontAwesomeIcon icon={faSave} /> Save
                            </button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                                <FontAwesomeIcon icon={faTimes} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-grid">
                    <section className="profile-section glass-card">
                        <h3><FontAwesomeIcon icon={faUser} /> Basic Information</h3>
                        <div className="info-item">
                            <label>Name</label>
                            {isEditing ? (
                                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                            ) : <span>{userData.name}</span>}
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <span>{userData.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Bio</label>
                            {isEditing ? (
                                <textarea value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} />
                            ) : <p>{userData.bio || "No bio added yet."}</p>}
                        </div>
                    </section>

                    <section className="profile-section glass-card">
                        <h3><FontAwesomeIcon icon={faBriefcase} /> Professional Details</h3>
                        <div className="info-item">
                            <label>Current Role / Job Title</label>
                            {isEditing ? (
                                <input value={editData.currentRole} onChange={(e) => setEditData({ ...editData, currentRole: e.target.value })} />
                            ) : <span>{userData.currentRole || "Not specified"}</span>}
                        </div>
                        <div className="info-item">
                            <label>Company / Organization</label>
                            {isEditing ? (
                                <input value={editData.company} onChange={(e) => setEditData({ ...editData, company: e.target.value })} />
                            ) : <span>{userData.company || "Not specified"}</span>}
                        </div>
                        <div className="info-item">
                            <label>Location</label>
                            {isEditing ? (
                                <input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                            ) : <span>{userData.location || "Not specified"}</span>}
                        </div>
                        <div className="info-item">
                            <label>Experience</label>
                            {isEditing ? (
                                <input value={editData.experience} onChange={(e) => setEditData({ ...editData, experience: e.target.value })} />
                            ) : <span>{userData.experience || "Not specified"}</span>}
                        </div>
                        <div className="info-item">
                            <label>Graduation Year</label>
                            <span>{userData.gradYear || "Not specified"}</span>
                        </div>
                    </section>

                    <section className="profile-section glass-card full-width">
                        <h3><FontAwesomeIcon icon={faLink} /> Social Links & Skills</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="info-item">
                                <label>LinkedIn</label>
                                {isEditing ? (
                                    <input value={editData.linkedin} onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })} placeholder="URL" />
                                ) : <a href={userData.linkedin} target="_blank" rel="noreferrer">{userData.linkedin || "Connect LinkedIn"}</a>}
                            </div>
                            <div className="info-item">
                                <label>GitHub</label>
                                {isEditing ? (
                                    <input value={editData.github} onChange={(e) => setEditData({ ...editData, github: e.target.value })} placeholder="URL" />
                                ) : <a href={userData.github} target="_blank" rel="noreferrer">{userData.github || "Connect GitHub"}</a>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
