import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css"; // Import CSS for styling

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 jobs

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/jobs", {
          params: { query: "Software Engineer", location: "New York" },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="jobs-container">
      <h2>Latest Job Opportunities</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <>
          <ul className="jobs-list">
            {jobs.slice(0, visibleCount).map((job, index) => (
              <li key={index} className="job-item">
                <h3>{job.title}</h3>
                <p>{job.company} - {job.location}</p>
                <p>Posted: {job.posted}</p>
                <a href={`https://www.google.com/search?q=${job.title} ${job.company}`} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </li>
            ))}
          </ul>
          {visibleCount < jobs.length && (
            <button className="show-more-btn" onClick={() => setVisibleCount(jobs.length)}>
              Show More
            </button>
          )}
        </>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
};

export default Jobs;
