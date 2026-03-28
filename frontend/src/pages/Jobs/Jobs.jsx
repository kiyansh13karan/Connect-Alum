import React, { useState, useEffect, useContext } from 'react';
import './Jobs.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faBuilding, faExternalLinkAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const Jobs = () => {
    const { url, token } = useContext(StoreContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState({ query: 'Software Engineer', location: 'Remote' });
    const [recommendations, setRecommendations] = useState([]);

    const fetchJobs = async (q = search.query, loc = search.location) => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/jobs?query=${q}&location=${loc}`);
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        if (!token) return;
        try {
            // In a real app, we'd fetch user skills and then search. 
            // For now, let's assume we fetch based on 'React Developer' if no skills found.
            const profileRes = await axios.get(`${url}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const skills = profileRes.data.user.skills;
            if (skills && skills.length > 0) {
                const recQuery = skills[0] + " Developer";
                const response = await axios.get(`${url}/api/jobs?query=${recQuery}&location=Remote`);
                setRecommendations(response.data.slice(0, 3));
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchRecommendations();
    }, [url]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="jobs-page animate-fade-in">
            <header className="jobs-header">
                <h1>Unlock Your <span className="highlight">Career</span></h1>
                <p>Find the best opportunities from across the web, tailored for you.</p>
            </header>

            <div className="jobs-container">
                <section className="search-section glass">
                    <form onSubmit={handleSearch} className="job-search-form">
                        <div className="input-group">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                placeholder="Job title, skills..."
                                value={search.query}
                                onChange={(e) => setSearch({ ...search, query: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <input
                                placeholder="Location (e.g. Remote, NYC)"
                                value={search.location}
                                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="search-btn">Search Jobs</button>
                    </form>
                </section>

                {recommendations.length > 0 && (
                    <section className="recommendations-section">
                        <h3><FontAwesomeIcon icon={faLightbulb} /> Recommended for You</h3>
                        <div className="rec-grid">
                            {recommendations.map((job, idx) => (
                                <div key={idx} className="rec-card glass-card">
                                    <h4>{job.title}</h4>
                                    <p>{job.company}</p>
                                    <a href={`https://www.google.com/search?q=${job.link}`} target="_blank" rel="noopener noreferrer" className="view-job-link">
                                        View Details
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <main className="jobs-list">
                    {loading ? (
                        <div className="loading-state">Scouring the web for the best fits...</div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job, idx) => (
                            <div key={idx} className="job-card glass-card">
                                <div className="job-info">
                                    <h3>{job.title}</h3>
                                    <div className="job-meta">
                                        <span><FontAwesomeIcon icon={faBuilding} /> {job.company}</span>
                                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                                        <span className="posted-tag">{job.posted}</span>
                                    </div>
                                </div>
                                <a href={`https://www.google.com/search?q=${job.link}`} target="_blank" rel="noopener noreferrer" className="apply-btn">
                                    Apply Now <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">No jobs found. Try adjusting your search!</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Jobs;
