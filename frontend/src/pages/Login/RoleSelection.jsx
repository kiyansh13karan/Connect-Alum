import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserGraduate, faBuilding, faChevronRight,
    faGraduationCap, faBriefcase, faUsers, faStar,
    faArrowRight, faShieldAlt, faSearch, faHandshake,
} from '@fortawesome/free-solid-svg-icons';

/* ── Role Card ───────────────────────────────────────────── */
const RoleCard = ({ variant, onClick }) => {
    const [hovered, setHovered] = useState(false);

    const isStudent = variant === 'student';

    const card = isStudent
        ? {
            icon: faUserGraduate,
            title: 'I am a Student',
            desc: 'Find mentors, explore internships & jobs, and build your professional network.',
            cta: 'Continue as Student',
            bullets: [
                { icon: faSearch,    text: 'Discover job & internship opportunities' },
                { icon: faHandshake, text: 'Connect with industry mentors' },
                { icon: faStar,      text: 'Attend alumni-hosted events' },
            ],
            bg:          '#fff',
            bgHover:     '#eff6ff',
            border:      '#e2e8f0',
            borderHover: '#93c5fd',
            iconBg:      '#dbeafe',
            iconBgHover: '#2563eb',
            iconColor:   '#2563eb',
            iconColorHover: '#fff',
            titleColor:  '#0f172a',
            descColor:   '#64748b',
            ctaColor:    '#2563eb',
            shadow:      '0 4px 20px rgba(0,0,0,0.06)',
            shadowHover: '0 16px 48px rgba(37,99,235,0.18)',
            accentLine:  'linear-gradient(90deg, #3b82f6, #6366f1)',
        }
        : {
            icon: faBuilding,
            title: 'I am an Alumni',
            desc: 'Give back to the community, mentor students, and connect with fellow alumni.',
            cta: 'Continue as Alumni',
            bullets: [
                { icon: faUsers,     text: 'Mentor students in your domain' },
                { icon: faBriefcase, text: 'Post jobs & internship openings' },
                { icon: faShieldAlt, text: 'Build your alumni network' },
            ],
            bg:          '#0f172a',
            bgHover:     '#1e293b',
            border:      '#1e293b',
            borderHover: '#f59e0b',
            iconBg:      '#1e293b',
            iconBgHover: '#f59e0b',
            iconColor:   '#f59e0b',
            iconColorHover: '#0f172a',
            titleColor:  '#f8fafc',
            descColor:   '#94a3b8',
            ctaColor:    '#fbbf24',
            shadow:      '0 4px 20px rgba(0,0,0,0.2)',
            shadowHover: '0 16px 48px rgba(245,158,11,0.25)',
            accentLine:  'linear-gradient(90deg, #f59e0b, #f97316)',
        };

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: hovered ? card.bgHover : card.bg,
                border: `1.5px solid ${hovered ? card.borderHover : card.border}`,
                borderRadius: '20px',
                padding: '36px 32px',
                cursor: 'pointer',
                boxShadow: hovered ? card.shadowHover : card.shadow,
                transition: 'background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                boxSizing: 'border-box',
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '4px',
                background: card.accentLine,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }} />

            {/* Subtle background glow */}
            <div style={{
                position: 'absolute', inset: 0,
                background: isStudent
                    ? 'radial-gradient(ellipse at top left, rgba(59,130,246,0.06) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at top right, rgba(245,158,11,0.08) 0%, transparent 70%)',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
            }} />

            {/* Icon */}
            <motion.div
                animate={{ scale: hovered ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                    width: '76px', height: '76px',
                    borderRadius: '20px',
                    backgroundColor: hovered ? card.iconBgHover : card.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: hovered
                        ? (isStudent ? '0 8px 24px rgba(37,99,235,0.35)' : '0 8px 24px rgba(245,158,11,0.35)')
                        : 'inset 0 2px 6px rgba(0,0,0,0.08)',
                    transition: 'background 0.25s ease, box-shadow 0.25s ease',
                    position: 'relative', zIndex: 1,
                    flexShrink: 0,
                }}
            >
                <FontAwesomeIcon
                    icon={card.icon}
                    style={{
                        fontSize: '30px',
                        color: hovered ? card.iconColorHover : card.iconColor,
                        transition: 'color 0.25s ease',
                    }}
                />
            </motion.div>

            {/* Title */}
            <h2 style={{
                fontSize: '22px', fontWeight: 800,
                color: card.titleColor,
                margin: '0 0 10px',
                letterSpacing: '-0.3px',
                position: 'relative', zIndex: 1,
                transition: 'color 0.2s ease',
            }}>
                {card.title}
            </h2>

            {/* Description */}
            <p style={{
                fontSize: '14px', color: card.descColor,
                lineHeight: 1.7, margin: '0 0 24px',
                position: 'relative', zIndex: 1,
            }}>
                {card.desc}
            </p>

            {/* Feature bullets */}
            <div style={{
                width: '100%',
                display: 'flex', flexDirection: 'column', gap: '10px',
                marginBottom: '28px',
                position: 'relative', zIndex: 1,
            }}>
                {card.bullets.map((b, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backgroundColor: isStudent
                            ? (hovered ? 'rgba(37,99,235,0.08)' : 'rgba(241,245,249,0.8)')
                            : (hovered ? 'rgba(245,158,11,0.08)' : 'rgba(30,41,59,0.5)'),
                        borderRadius: '10px',
                        padding: '9px 14px',
                        transition: 'background 0.25s ease',
                        textAlign: 'left',
                    }}>
                        <FontAwesomeIcon icon={b.icon} style={{
                            fontSize: '12px',
                            color: isStudent ? '#3b82f6' : '#f59e0b',
                            flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '13px', color: isStudent ? '#475569' : '#94a3b8', fontWeight: 500 }}>
                            {b.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{
                marginTop: 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: hovered ? '12px' : '8px',
                color: card.ctaColor,
                fontSize: '14px', fontWeight: 700,
                position: 'relative', zIndex: 1,
                transition: 'gap 0.25s ease',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: isStudent
                    ? (hovered ? 'rgba(37,99,235,0.1)' : 'rgba(219,234,254,0.5)')
                    : (hovered ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.06)'),
                width: '100%',
                transition: 'all 0.25s ease',
            }}>
                <span>{card.cta}</span>
                <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '13px' }} />
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ── Main Page ───────────────────────────────────────────── */
const RoleSelection = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { y: 28, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: 'linear-gradient(145deg, #f0f4ff 0%, #f8fafc 50%, #fefce8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-8%', left: '-6%', width: '38%', height: '38%', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-8%', right: '-6%', width: '38%', height: '38%', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '40%', right: '10%', width: '20%', height: '20%', background: 'rgba(59,130,246,0.07)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ maxWidth: '900px', width: '100%', zIndex: 1 }}
            >
                {/* Badge */}
                <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '999px', padding: '6px 16px',
                        fontSize: '13px', fontWeight: 600, color: '#4f46e5',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 12px rgba(99,102,241,0.1)',
                    }}>
                        <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '12px' }} />
                        Professional Alumni Network
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{
                        fontSize: 'clamp(28px, 4vw, 44px)',
                        fontWeight: 900, color: '#0f172a',
                        margin: '0 0 14px',
                        letterSpacing: '-1px',
                        lineHeight: 1.15,
                    }}>
                        Welcome to{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            ConnectAlum
                        </span>
                    </h1>
                    <p style={{ fontSize: '16px', color: '#64748b', margin: 0, lineHeight: 1.65, maxWidth: '500px', marginInline: 'auto' }}>
                        Bridge the gap between your academic journey and professional career.
                        <strong style={{ color: '#475569', fontWeight: 600 }}> How would you like to continue?</strong>
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '24px',
                    }}
                >
                    <RoleCard variant="student" onClick={() => navigate('/login/student')} />
                    <RoleCard variant="alumni"  onClick={() => navigate('/login/alumni')} />
                </motion.div>

                {/* Footer note */}
                <motion.p
                    variants={itemVariants}
                    style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '32px' }}
                >
                    🔒 Secure authentication — your data is always protected
                </motion.p>
            </motion.div>
        </div>
    );
};

export default RoleSelection;
