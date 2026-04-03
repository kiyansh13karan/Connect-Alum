import React, { useState } from "react";
import { ArrowRight, Users, Calendar, Briefcase, Star, Zap, TrendingUp } from "lucide-react";
import Mentoring from "../../components/Mentoring/Mentoring";
import Networking from "../../components/Networking/Networking";
import Contribution from "../../components/Contribution/Contribution";
import MentorForm from "../../components/MentorForm/MentorForm";
import "./Alumni.css";

const tabs = [
  {
    id: "mentoring",
    label: "Mentoring",
    icon: <Users size={17} />,
    description: "Support student journeys",
  },
  {
    id: "networking",
    label: "Event Scheduling",
    icon: <Calendar size={17} />,
    description: "Host seminars & webinars",
  },
  {
    id: "contribution",
    label: "Post Job",
    icon: <Briefcase size={17} />,
    description: "Share opportunities",
  },
];

const statsData = [
  { value: "1,500+", label: "Alumni Network", icon: <Users size={22} />, color: "stat-blue" },
  { value: "85%", label: "Career Growth", icon: <TrendingUp size={22} />, color: "stat-indigo" },
  { value: "200+", label: "Startups Founded", icon: <Zap size={22} />, color: "stat-violet" },
  { value: "4.9★", label: "Mentor Rating", icon: <Star size={22} />, color: "stat-amber" },
];

const Alumni = () => {
  const [activeTab, setActiveTab] = useState("mentoring");
  const [showMentorForm, setShowMentorForm] = useState(false);

  return (
    <div className="alumni-page">
      {showMentorForm ? (
        <div className="animate-fade-in">
          <MentorForm />
        </div>
      ) : (
        <>
          {/* ── Hero Section ─────────────────────────── */}
          <section className="alumni-hero">
            <div className="hero-glow hero-glow-1" />
            <div className="hero-glow hero-glow-2" />

            <div className="hero-inner animate-fade-in">
              <span className="hero-badge">
                <span className="badge-dot" />
                Alumni Portal
              </span>

              <h1 className="hero-heading">
                Give Back to Your
                <span className="hero-heading-accent"> Tech Community</span>
              </h1>

              <p className="hero-subtext">
                Share your industry experience, mentor students, and connect
                with fellow alumni to shape the future of tech.
              </p>

              <div className="hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => setShowMentorForm(true)}
                  id="become-mentor-btn"
                >
                  <span>Become a Mentor</span>
                  <ArrowRight size={18} className="btn-icon" />
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab("networking")}
                  id="schedule-event-btn"
                >
                  Schedule an Event
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="hero-stats">
              {statsData.map((s, i) => (
                <div className={`stat-card ${s.color}`} key={i}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-body">
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tabs Section ─────────────────────────── */}
          <section className="alumni-tabs-section">
            {/* Tab Pills */}
            <div className="tab-pills">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  className={`tab-pill ${activeTab === tab.id ? "tab-pill-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-pill-icon">{tab.icon}</span>
                  <span className="tab-pill-content">
                    <span className="tab-pill-label">{tab.label}</span>
                    <span className="tab-pill-desc">{tab.description}</span>
                  </span>
                  {activeTab === tab.id && <span className="tab-active-dot" />}
                </button>
              ))}
            </div>

            {/* Tab Content Panel */}
            <div className="tab-panel animate-fade-in" key={activeTab}>
              {activeTab === "mentoring" && <Mentoring />}
              {activeTab === "networking" && <Networking />}
              {activeTab === "contribution" && <Contribution />}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Alumni;
