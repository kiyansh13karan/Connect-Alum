import React, { useContext } from "react";
import "./Hero.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBookOpen, faBriefcase, faChartLine, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
    const { token, setShowLogin } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleAction = (path) => {
        if (token) navigate(path);
        else setShowLogin(true);
    };

    return (
        <div className="hero-container">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <span className="tagline">Connecting generations of knowledge</span>
                <h1>
                    Building <span className="highlight">meaningful</span> connections in tech education
                </h1>
                <p>
                    Connect with alumni, find mentors, and advance your career through a community of
                    vetted industry professionals.
                </p>
                <div className="hero-buttons">
                    <button className="primary-btn" onClick={() => handleAction("/alumni-discovery")}>
                        Find a Mentor →
                    </button>
                    <button className="secondary-btn" onClick={() => handleAction("/alumni/dashboard")}>
                        Join Alumni Network
                    </button>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-value">5K+</span>
                        <span className="stat-text">Active Members</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">1.2K+</span>
                        <span className="stat-text">Mentorships</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">300+</span>
                        <span className="stat-text">Placements</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="hero-visual"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <img src="/f.png" alt="Platform Preview" className="hero-main-img" />

                {/* Dashboard Widgets */}
                <motion.div
                    className="floating-widget widget-mentorship glass animate-fade-in"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <div>
                            <p className="text-xs font-bold m-0">Mentorship Match</p>
                            <p className="text-[10px] text-muted m-0">Al-powered pairing</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="floating-widget widget-growth glass animate-fade-in"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <FontAwesomeIcon icon={faChartLine} />
                        </div>
                        <div>
                            <p className="text-xs font-bold m-0">Network Growth</p>
                            <p className="text-[10px] text-muted m-0">+27% this quarter</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
