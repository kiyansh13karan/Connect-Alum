import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    gradYear: "",
    company: "",
  });

  // Add or remove the class to disable scrolling
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role); // Store user role
        setShowLogin(false);
        
        // Redirect based on role
        if (response.data.role === "student") {
           navigate("/student/dashboard");
        } else if (response.data.role === "alumni") {
           navigate("/alumni/dashboard");
        } else {
           window.location.reload(); // fallback
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during the request.");
      console.error("Login/SignUp Error:", error);
    }
  };


  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className="close-icon"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          />
        </div>
        <div className="login-popup-input">
          {currState === "SignUp" && (
            <>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faUser} className="input-icon" aria-label="Name" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={data.name}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="input-with-icon">
                <select
                  id="role"
                  name="role"
                  value={data.role}
                  onChange={onChangeHandler}
                  required
                  className="professional-select"
                >
                  <option value="student">I am a Student</option>
                  <option value="alumni">I am an Alumnus/Alumna</option>
                </select>
              </div>

              {data.role === "alumni" && (
                <div className="animate-fade-in flex flex-col gap-4">
                  <div className="input-with-icon">
                    <input
                      name="gradYear"
                      type="number"
                      placeholder="Graduation Year (e.g. 2022)"
                      value={data.gradYear}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                  <div className="input-with-icon">
                    <input
                      name="company"
                      type="text"
                      placeholder="Current Company / Organization"
                      value={data.company}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <button type="submit">
          {currState === "SignUp" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("SignUp")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;