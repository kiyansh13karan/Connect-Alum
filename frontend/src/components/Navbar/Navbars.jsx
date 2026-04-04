import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faSignOutAlt, faGraduationCap, faSearch,
  faComments, faLayerGroup, faBell, faTimes, faChevronRight,
  faBolt, faHandshake, faBriefcase, faCalendar, faChartBar,
  faCog, faHome, faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

/* ─── Nav config per role ───────────────────────────────── */
const ALUMNI_NAV = [
  { label: 'Dashboard',        path: '/alumni/dashboard',     icon: faBolt },
  { label: 'My Profile',       path: '/alumni/profile',       icon: faUser },
  { label: 'Requests',         path: '/alumni/requests',      icon: faHandshake },
  { label: 'Opportunities',    path: '/alumni/opportunities', icon: faBriefcase },
  { label: 'Messages',         path: '/alumni/messages',      icon: faComments },
  { label: 'Events',           path: '/alumni/events',        icon: faCalendar },
  { label: 'Analytics',        path: '/alumni/analytics',     icon: faChartBar },
  { label: 'Settings',         path: '/alumni/settings',      icon: faCog },
];

const STUDENT_NAV = [
  { label: 'Dashboard',    path: '/student/dashboard',     icon: faBolt },
  { label: 'Mentors',      path: '/student/mentors',       icon: faUserGraduate },
  { label: 'Opportunities',path: '/student/opportunities', icon: faBriefcase },
  { label: 'Internships',  path: '/student/internships',   icon: faGraduationCap },
  { label: 'Messages',     path: '/student/messages',      icon: faComments },
  { label: 'Events',       path: '/student/events',        icon: faCalendar },
];

const PUBLIC_NAV = [
  { label: 'Home',         path: '/',         icon: faHome },
  { label: 'Mentorship',   path: '/alumni-discovery', icon: faHandshake },
];

/* ─── Navbar ─────────────────────────────────────────────── */
const Navbar = ({ setShowLogin }) => {
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal,     setSearchVal]     = useState('');
  const [dropOpen,      setDropOpen]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const { token, setToken }               = useContext(StoreContext);
  const [role, setRole]                   = useState(localStorage.getItem('role') || null);
  const navigate                          = useNavigate();
  const location                          = useLocation();
  const dropRef                           = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setRole(localStorage.getItem('role')); }, [token]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole(null);
    navigate('/');
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  /* pick which nav to show */
  const navLinks = role === 'alumni'
    ? ALUMNI_NAV
    : role === 'student'
    ? STUDENT_NAV
    : PUBLIC_NAV;

  return (
    <>
      <nav className={`nb-root ${isScrolled ? 'nb-scrolled' : ''} ${role === 'alumni' ? 'nb-alumni' : ''} ${role === 'student' ? 'nb-student' : ''}`}>
        <div className="nb-inner">

          {/* ── Logo ── */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-icon">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <span className="nb-logo-text">
              Connect<span className="nb-logo-accent">Alum</span>
            </span>
          </Link>

          {/* ── Search — hidden when logged in to save space for nav links ── */}
          {!token && (
            <div className={`nb-search ${searchFocused ? 'nb-search-focused' : ''}`}>
              <FontAwesomeIcon icon={faSearch} className="nb-search-icon" />
              <input
                type="text"
                placeholder="Search company, role..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="nb-search-input"
              />
              {searchVal && (
                <button onClick={() => setSearchVal('')} className="nb-search-clear">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          )}

          {/* ── Nav Links ── */}
          <ul className="nb-links">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    title={link.label}
                    className={`nb-link ${active ? 'nb-link-active' : ''}`}
                  >
                    <span className="nb-link-icon">
                      <FontAwesomeIcon icon={link.icon} />
                    </span>
                    <span className="nb-link-label">{link.label}</span>
                    {active && <span className="nb-link-dot" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right Controls ── */}
          <div className="nb-right">

            {/* Messages icon */}
            {token && (
              <Link
                to={role === 'alumni' ? '/alumni/messages' : '/student/messages'}
                className="nb-icon-btn"
                title="Messages"
              >
                <FontAwesomeIcon icon={faComments} />
                <span className="nb-dot nb-dot-red" />
              </Link>
            )}

            {/* Bell */}
            {token && (
              <button className="nb-icon-btn" title="Notifications">
                <FontAwesomeIcon icon={faBell} />
                <span className="nb-dot nb-dot-amber" />
              </button>
            )}

            {/* Sign In / Avatar */}
            {!token ? (
              <button className="nb-signin-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            ) : (
              <div ref={dropRef} style={{ position: 'relative' }}>
                {/* Avatar */}
                <button
                  className={`nb-avatar ${dropOpen ? 'nb-avatar-open' : ''}`}
                  onClick={() => setDropOpen(p => !p)}
                >
                  {(role || 'U')[0].toUpperCase()}
                </button>

                {/* Dropdown */}
                <div className={`nb-dropdown ${dropOpen ? 'nb-dropdown-open' : ''}`}>
                  <div className="nb-drop-header">
                    <div className="nb-drop-avatar">{(role || 'U')[0].toUpperCase()}</div>
                    <div>
                      <p className="nb-drop-signed">Signed in as</p>
                      <p className="nb-drop-role">{role}</p>
                    </div>
                  </div>
                  <div className="nb-drop-body">
                    <DropItem icon={faUser}       label="My Profile" onClick={() => { navigate('/profile'); setDropOpen(false); }} />
                    <DropItem icon={faLayerGroup} label="Dashboard"  onClick={() => { navigate(role === 'student' ? '/student/dashboard' : '/alumni/dashboard'); setDropOpen(false); }} />
                    <div className="nb-drop-sep" />
                    <DropItem icon={faSignOutAlt} label="Sign Out" onClick={logout} danger />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="nb-hamburger" onClick={() => setMobileOpen(p => !p)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`nb-mobile-menu ${mobileOpen ? 'nb-mobile-open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nb-mobile-link ${isActive(link.path) ? 'nb-mobile-active' : ''}`}
            >
              <FontAwesomeIcon icon={link.icon} className="nb-ml-icon" />
              {link.label}
            </Link>
          ))}
          {token && (
            <button className="nb-mobile-logout" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="nb-spacer" />
    </>
  );
};

/* ─── Dropdown Item ───────────────────────────────────────── */
const DropItem = ({ icon, label, onClick, danger }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`nb-drop-item ${danger ? 'nb-drop-danger' : ''} ${hov ? 'nb-drop-item-hov' : ''}`}
    >
      <span className={`nb-drop-item-icon ${danger ? 'nb-dii-danger' : ''} ${hov ? 'nb-dii-hov' : ''}`}>
        <FontAwesomeIcon icon={icon} style={{ fontSize: '11px' }} />
      </span>
      {label}
      <FontAwesomeIcon icon={faChevronRight} className="nb-drop-arrow" />
    </button>
  );
};

export default Navbar;
