import { useEffect, useState } from "react";
import "./Mentors.css"; // Import the external CSS file

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    fetch(`${backendUrl}/api/mentors`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error while fetching mentors");
        }
        return res.json();
      })
      .then((data) => setMentors(data))
      .catch((err) => setError(err.message));
  }, []);

  const visibleMentors = showAll ? mentors : mentors.slice(0, 6);

  return (
    <div className="jobs-container">
      <h2>Mentors</h2>
      {error && <p className="error-message">{error}</p>}

      <ul className="jobs-list">
        {visibleMentors.length > 0 ? (
          visibleMentors.map((mentor) => (
            <li
              key={mentor._id}
              className="job-item"
              style={{ padding: "15px", borderBottom: "1px solid #ccc" }}
            >
              <h3 style={{ marginBottom: "5px" }}>
                {mentor.firstName} {mentor.lastName}
              </h3>
              {mentor.organization && (
                <p>
                  <strong>Organization:</strong> {mentor.organization}
                </p>
              )}
              {mentor.expertise && (
                <p>
                  <strong>Expertise:</strong> {mentor.expertise}
                </p>
              )}
              {mentor.location && (
                <p>
                  <strong>Location:</strong> {mentor.location}
                </p>
              )}
              {mentor.experience && (
                <p>
                  <strong>Experience:</strong> {mentor.experience} years
                </p>
              )}
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => alert(`Connecting with ${mentor.firstName} ${mentor.lastName}`)}
              >
                Connect
              </button>
            </li>
          ))
        ) : (
          <p className="no-mentors">No mentors found.</p>
        )}
      </ul>

      {mentors.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: "15px",
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
          }}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Mentors;
