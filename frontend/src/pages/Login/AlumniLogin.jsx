import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faLock, faArrowRight,
    faBuilding, faEye, faEyeSlash, faGraduationCap,
    faUsers, faBriefcase, faHandshake, faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

/* ── Dark themed input field ─────────────────────────────── */
const DarkInput = ({ icon, type, name, placeholder, value, onChange, right }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: focused ? '#1e293b' : '#0f172a',
            border: `1.5px solid ${focused ? '#f59e0b' : '#334155'}`,
            borderRadius: '14px',
            padding: '0 16px',
            transition: 'all 0.2s ease',
            boxShadow: focused ? '0 0 0 3px rgba(245,158,11,0.12)' : 'none',
        }}>
            <FontAwesomeIcon icon={icon} style={{ color: focused ? '#f59e0b' : '#475569', fontSize: '14px', flexShrink: 0, transition: 'color 0.2s' }} />
            <input
                name={name} type={type} required
                placeholder={placeholder} value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    padding: '14px 0', fontSize: '14px', color: '#f1f5f9', fontWeight: 500,
                }}
            />
            {right}
        </div>
    );
};

/* ── Right panel bullet ──────────────────────────────────── */
const PanelBullet = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FontAwesomeIcon icon={icon} style={{ fontSize: '13px', color: '#f59e0b' }} />
        </div>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{text}</span>
    </div>
);

/* ── Main Component ──────────────────────────────────────── */
const AlumniLogin = () => {
    const { url, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Login");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({ name: "", email: "", password: "", role: "alumni", gradYear: "", company: "" });

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
                if (res.data.role !== "alumni") { alert("Error: Incorrect role type."); setLoading(false); return; }
                setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);
                navigate("/alumni/dashboard");
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
            background: 'linear-gradient(145deg, #0c1221 0%, #111827 60%, #0a0f1a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '32px 16px',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '50%', background: 'rgba(245,158,11,0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '35%', height: '40%', background: 'rgba(180,83,9,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '960px',
                    minHeight: '580px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(245,158,11,0.12)',
                    zIndex: 1,
                }}
            >
                {/* ── Left Form Panel ── */}
                <div style={{
                    flex: '0 0 50%',
                    backgroundColor: '#131c2e',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: '48px 44px',
                    borderRight: '1px solid rgba(245,158,11,0.1)',
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currState}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Badge */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.4px', marginBottom: '16px' }}>
                                    <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '10px' }} />
                                    {currState === "Login" ? "ALUMNI LOGIN" : "ALUMNI REGISTRATION"}
                                </div>
                                <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
                                    {currState === "Login" ? "Welcome Back!" : "Join the Network"}
                                </h2>
                                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                                    {currState === "Login" ? "Sign in to access the exclusive alumni directory." : "Register to start mentoring and connecting."}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <AnimatePresence>
                                    {currState === "SignUp" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}
                                        >
                                            <DarkInput icon={faUser}          type="text"   name="name"     placeholder="Full Name"                   value={data.name}     onChange={onChangeHandler} />
                                            <DarkInput icon={faGraduationCap}  type="number" name="gradYear" placeholder="Graduation Year (e.g. 2018)" value={data.gradYear} onChange={onChangeHandler} />
                                            <DarkInput icon={faBuilding}       type="text"   name="company"  placeholder="Current Company & Role"       value={data.company}  onChange={onChangeHandler} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <DarkInput icon={faEnvelope} type="email" name="email" placeholder="Email Address" value={data.email} onChange={onChangeHandler} />

                                <DarkInput
                                    icon={faLock} type={showPass ? "text" : "password"} name="password"
                                    placeholder="Password" value={data.password} onChange={onChangeHandler}
                                    right={
                                        <button type="button" onClick={() => setShowPass(p => !p)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                                        >
                                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} style={{ fontSize: '14px' }} />
                                        </button>
                                    }
                                />

                                {currState === "Login" && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <a href="#" style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b', textDecoration: 'none' }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                            Recover Password?
                                        </a>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit" disabled={loading}
                                    style={{
                                        width: '100%', padding: '14px',
                                        background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        border: 'none', borderRadius: '14px',
                                        color: '#0f172a', fontSize: '15px', fontWeight: 800,
                                        cursor: loading ? 'wait' : 'pointer',
                                        boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
                                        letterSpacing: '0.2px',
                                        transition: 'all 0.2s ease',
                                        marginTop: '4px',
                                    }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.4)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.3)'; }}
                                >
                                    {loading ? 'Please wait...' : (currState === "SignUp" ? "Register as Alumni" : "Access Network")}
                                </button>
                            </form>

                            {/* Toggle */}
                            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #1e293b', textAlign: 'center' }}>
                                {currState === "Login" ? (
                                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                                        Not registered yet?{' '}
                                        <button onClick={() => setCurrState("SignUp")}
                                            style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: 700, cursor: 'pointer', fontSize: '13.5px', padding: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >Join the community →</button>
                                    </p>
                                ) : (
                                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                                        Already a member?{' '}
                                        <button onClick={() => setCurrState("Login")}
                                            style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: 700, cursor: 'pointer', fontSize: '13.5px', padding: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                        >Sign in here →</button>
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Right Info Panel ── */}
                <div style={{
                    flex: 1,
                    background: 'linear-gradient(145deg, #1c1008 0%, #111827 50%, #0a0f1a 100%)',
                    padding: '40px 36px',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Dot grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(245,158,11,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
                    {/* Glow */}
                    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: '40%', height: '40%', background: 'rgba(180,83,9,0.12)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

                    {/* Back button */}
                    <button
                        onClick={() => navigate('/login')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '8px 14px', color: '#f59e0b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', zIndex: 1, width: 'fit-content', marginLeft: 'auto', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.08)'}
                    >
                        Back to Roles
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '12px' }} />
                    </button>

                    {/* Center content */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: '32px' }}
                    >
                        {/* Icon */}
                        <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '28px', color: '#f59e0b' }} />
                        </div>

                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            Give Back.
                        </h1>
                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            Inspire.
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 32px' }}>
                            Guide the next generation of professionals, reconnect with peers, and hire top emerging talent from your alma mater.
                        </p>

                        {/* Bullets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <PanelBullet icon={faUsers}      text="Mentor students in your domain" />
                            <PanelBullet icon={faBriefcase}  text="Post exclusive job openings" />
                            <PanelBullet icon={faHandshake}  text="Reconnect with fellow alumni" />
                            <PanelBullet icon={faShieldAlt}  text="Verified alumni-only network" />
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', zIndex: 1, margin: 0, textAlign: 'right' }}>
                        © {new Date().getFullYear()} ConnectAlum. Uniting Alumni.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AlumniLogin;
