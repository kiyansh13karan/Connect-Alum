import React, { useState, useEffect, useContext } from 'react';
import '../Jobs/Jobs.css';
import './Internships.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faMapMarkerAlt, faBuilding,
    faExternalLinkAlt, faLightbulb, faGraduationCap,
    faClock, faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

const AlumniInternCard = ({ job }) => (
    <div className="intern-card">
        {/* Accent bar */}
        <div className="intern-card-bar" />

        <div className="intern-card-body">
            {/* Badge */}
            <span className="intern-badge">
                <FontAwesomeIcon icon={faGraduationCap} />
                Internship
            </span>

            <h3 className="intern-title">{job.title}</h3>

            <div className="intern-meta">
                <span><FontAwesomeIcon icon={faBuilding} /> {job.company}</span>
                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</span>
                {job.role && <span><FontAwesomeIcon icon={faClipboardList} /> {job.role}</span>}
            </div>

            {(job.description) && (
                <p className="intern-desc">{job.description}</p>
            )}

            <div className="intern-footer">
                <div className="alumni-poster-info">
                    <div className="intern-avatar">
                        {job.posterName?.[0]?.toUpperCase() || job.postedBy?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <span className="alumni-poster-name">
                        {job.posterName || job.postedBy?.name || 'Alumni'}
                        {job.postedBy?.currentRole && (
                            <span className="alumni-poster-role"> · {job.postedBy.currentRole}</span>
                        )}
                    </span>
                </div>
                {job.applyLink ? (
                    <a
                        href={job.applyLink.startsWith('http') ? job.applyLink : `https://${job.applyLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="intern-apply-btn"
                    >
                        Apply <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                ) : (
                    <span className="alumni-no-link">Contact Alumni</span>
                )}
            </div>
        </div>
    </div>
);

const Internships = () => {
    const { url, token } = useContext(StoreContext);

    const [alumniInterns, setAlumniInterns]   = useState([]);
    const [alumniLoading, setAlumniLoading]   = useState(true);

    const [jobs, setJobs]           = useState([]);
    const [loading, setLoading]     = useState(false);
    const [search, setSearch]       = useState({ query: 'Software Internship', location: 'Remote' });
    const [recommendations, setRecommendations] = useState([]);

    const fetchAlumniInterns = async () => {
        try {
            setAlumniLoading(true);
            const res = await axios.get(`${url}/api/jobs/alumni-posts`);
            if (res.data.success) {
                setAlumniInterns(res.data.posts.filter(p => p.type === 'Internship'));
            }
        } catch (error) {
            console.error('Error fetching alumni internships:', error);
        } finally {
            setAlumniLoading(false);
        }
    };

    const fetchJobs = async (q = search.query, loc = search.location) => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/jobs?query=${q}&location=${loc}`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        if (!token) return;
        try {
            const profileRes = await axios.get(`${url}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const skills = profileRes.data.user.skills;
            if (skills && skills.length > 0) {
                const recQuery = skills[0] + ' Internship';
                const response = await axios.get(`${url}/api/jobs?query=${recQuery}&location=Remote`);
                setRecommendations(response.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    useEffect(() => {
        fetchAlumniInterns();
        fetchJobs();
        fetchRecommendations();
    }, [url]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="jobs-page animate-fade-in">
            <header className="jobs-header intern-header">
                <h1>🎓 <span className="highlight-purple">Internship</span> Opportunities</h1>
                <p>Internships posted directly by alumni — and the best from across the web.</p>
            </header>

            <div className="jobs-container">

                {/* ── Alumni-Posted Internships ───────────────────── */}
                <section className="intern-section">
                    <div className="intern-section-header">
                        <h2 className="intern-section-title">🎓 Posted by Alumni</h2>
                        <span className="intern-count-badge">
                            {alumniInterns.length} available
                        </span>
                    </div>

                    {alumniLoading ? (
                        <div className="alumni-loading">
                            <div className="intern-spinner" /> Loading alumni internships...
                        </div>
                    ) : alumniInterns.length > 0 ? (
                        <div className="intern-cards-grid">
                            {alumniInterns.map(job => <AlumniInternCard key={job._id} job={job} />)}
                        </div>
                    ) : (
                        <div className="intern-empty">
                            <span className="intern-empty-icon">🎒</span>
                            <p className="intern-empty-title">No alumni internships yet</p>
                            <p className="intern-empty-sub">Alumni will post internship opportunities here. Check back soon!</p>
                        </div>
                    )}
                </section>

                {/* ── SerpAPI Search ─────────────────────────────── */}
                <div className="jobs-divider"><span>Search External Internship Listings</span></div>

                <section className="search-section glass">
                    <form onSubmit={handleSearch} className="job-search-form">
                        <div className="input-group">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                placeholder="Internship role, skills..."
                                value={search.query}
                                onChange={(e) => setSearch({ ...search, query: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <input
                                placeholder="Location (e.g. Remote, Bengaluru)"
                                value={search.location}
                                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="search-btn intern-search-btn">Search Internships</button>
                    </form>
                </section>

                {recommendations.length > 0 && (
                    <section className="recommendations-section">
                        <h3><FontAwesomeIcon icon={faLightbulb} /> Recommended Internships for You</h3>
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
                        <div className="loading-state">Searching for the best internship opportunities...</div>
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
                        <div className="empty-state">No internships found. Try adjusting your search!</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Internships;
