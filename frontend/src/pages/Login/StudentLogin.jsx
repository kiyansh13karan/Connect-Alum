import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faLock, faArrowLeft,
    faUserGraduate, faEye, faEyeSlash,
    faGraduationCap, faBriefcase, faStar, faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

/* ── Input field with icon + focus state ─────────────────── */
const InputField = ({ icon, type, name, placeholder, value, onChange, right }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: focused ? '#fff' : '#f8fafc',
            border: `1.5px solid ${focused ? '#3b82f6' : '#e2e8f0'}`,
            borderRadius: '14px',
            padding: '0 16px',
            transition: 'all 0.2s ease',
            boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
        }}>
            <FontAwesomeIcon icon={icon} style={{ color: focused ? '#3b82f6' : '#94a3b8', fontSize: '14px', flexShrink: 0, transition: 'color 0.2s' }} />
            <input
                name={name} type={type} required
                placeholder={placeholder} value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    padding: '14px 0', fontSize: '14px', color: '#1e293b', fontWeight: 500,
                }}
            />
            {right}
        </div>
    );
};

/* ── Left panel bullet ───────────────────────────────────── */
const PanelBullet = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FontAwesomeIcon icon={icon} style={{ fontSize: '13px', color: '#fff' }} />
        </div>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>{text}</span>
    </div>
);

/* ── Main Component ──────────────────────────────────────── */
const StudentLogin = () => {
    const { url, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Login");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({ name: "", email: "", password: "", role: "student" });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");
        try {
            const res = await axios.post(endpoint, data);
            if (res.data.success) {
                if (res.data.role !== "student") { alert("Error: Incorrect role type."); setLoading(false); return; }
                setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                navigate("/student/dashboard");
            } else {
                alert(res.data.message);
                setLoading(false);
            }
        } catch (err) {
            alert(err.response?.data?.message || "An error occurred.");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 60%, #eef2ff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '32px 16px',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '35%', height: '40%', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '960px',
                    minHeight: '560px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    zIndex: 1,
                }}
            >
                {/* ── Left Panel ── */}
                <div style={{
                    flex: '0 0 42%',
                    background: 'linear-gradient(145deg, #1d4ed8 0%, #3730a3 60%, #1e1b4b 100%)',
                    padding: '40px 36px',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Subtle grid overlay */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

                    {/* Glow circles */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '60%', height: '60%', background: 'rgba(99,102,241,0.25)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(59,130,246,0.2)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

                    {/* Back button */}
                    <button
                        onClick={() => navigate('/login')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 14px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', zIndex: 1, width: 'fit-content', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '12px' }} />
                        Back to Roles
                    </button>

                    {/* Center content */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: '32px' }}
                    >
                        {/* Icon */}
                        <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <FontAwesomeIcon icon={faUserGraduate} style={{ fontSize: '28px', color: '#fff' }} />
                        </div>

                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            Unlock Your<br />Potential.
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: '0 0 32px' }}>
                            Connect with mentors, explore opportunities, and build relationships that will accelerate your career.
                        </p>

                        {/* Bullets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <PanelBullet icon={faGraduationCap} text="Access alumni mentors in your field" />
                            <PanelBullet icon={faBriefcase}     text="Browse curated jobs & internships" />
                            <PanelBullet icon={faStar}          text="Attend exclusive alumni events" />
                            <PanelBullet icon={faShieldAlt}     text="Verified, secure alumni network" />
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', zIndex: 1, margin: 0 }}>
                        © {new Date().getFullYear()} ConnectAlum. Empowering Students.
                    </p>
                </div>

                {/* ── Right Panel (Form) ── */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: '48px 44px',
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currState}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Heading */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#1d4ed8', marginBottom: '16px', letterSpacing: '0.3px' }}>
                                    <FontAwesomeIcon icon={faUserGraduate} style={{ fontSize: '10px' }} />
                                    {currState === "Login" ? "STUDENT LOGIN" : "STUDENT SIGN UP"}
                                </div>
                                <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
                                    {currState === "Login" ? "Welcome Back!" : "Create Your Account"}
                                </h2>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                                    {currState === "Login" ? "Sign in to access your student dashboard." : "Join the ConnectAlum student community today."}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <AnimatePresence>
                                    {currState === "SignUp" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <InputField icon={faUser} type="text" name="name" placeholder="Full Name" value={data.name} onChange={onChangeHandler} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputField icon={faEnvelope} type="email" name="email" placeholder="Email Address" value={data.email} onChange={onChangeHandler} />

                                <InputField
                                    icon={faLock} type={showPass ? "text" : "password"} name="password"
                                    placeholder="Password" value={data.password} onChange={onChangeHandler}
                                    right={
                                        <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                        >
                                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} style={{ fontSize: '14px' }} />
                                        </button>
                                    }
                                />

                                {currState === "Login" && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <a href="#" style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%', padding: '14px',
                                        background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                        border: 'none', borderRadius: '14px',
                                        color: '#fff', fontSize: '15px', fontWeight: 800,
                                        cursor: loading ? 'wait' : 'pointer',
                                        boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
                                        letterSpacing: '0.2px',
                                        transition: 'all 0.2s ease',
                                        marginTop: '4px',
                                    }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.45)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.35)'; }}
                                >
                                    {loading ? 'Please wait...' : (currState === "SignUp" ? "Create Student Account" : "Sign In to Dashboard")}
                                </button>
                            </form>

                            {/* Toggle Login/SignUp */}
                            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                {currState === "Login" ? (
                                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                                        New to ConnectAlum?{' '}
                                        <button onClick={() => setCurrState("SignUp")} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '13.5px', padding: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                            Create an account →
                                        </button>
                                    </p>
                                ) : (
                                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                                        Already have an account?{' '}
                                        <button onClick={() => setCurrState("Login")} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '13.5px', padding: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                            Sign in here →
                                        </button>
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentLogin;
