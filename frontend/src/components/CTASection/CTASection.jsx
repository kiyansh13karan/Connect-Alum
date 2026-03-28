import React, { useContext } from "react";
import { ArrowRight } from "lucide-react";
import "./CTASection.css"; // Import the CSS file
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const { token, setShowLogin } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleJoinStudent = () => {
    if (token) {
      navigate("/student");
    } else {
      setShowLogin(true);
    }
  };

  const handleJoinAlumni = () => {
    if (token) {
      navigate("/alumni");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">

          {/* Background decorative circles */}
          <div className="circle circle-top"></div>
          <div className="circle circle-bottom"></div>

          <div className="cta-text">
            <h2>Ready to connect with your technical community?</h2>
            <p>
              Join thousands of alumni and students who are already building valuable connections, sharing knowledge, and advancing their careers.
            </p>

            {/* Buttons */}
            <div className="cta-buttons">
              <button className="btn btn-light" onClick={handleJoinStudent}>
                Join as a Student
                <ArrowRight className="icon" />
              </button>
              <button className="btn btn-dark" onClick={handleJoinAlumni}>Join as an Alumni</button>
            </div>

            <p className="cta-footer">
              Free for students and alumni of participating technical institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
