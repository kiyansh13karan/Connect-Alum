import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faSignOutAlt, faGraduationCap, faSearch,
  faComments, faLayerGroup, faBell, faTimes, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const NAV_LINKS = (role) => [
  { label: 'Home',         path: '/' },
  { label: 'Mentorship',   path: role === 'alumni' ? '/alumni/dashboard' : '/student/mentors' },
  { label: 'Jobs',         path: role === 'alumni' ? '/alumni/dashboard' : '/student/opportunities' },
  { label: 'Internships',  path: role === 'alumni' ? '/alumni/dashboard' : '/student/internships' },
  { label: 'Events',       path: role === 'alumni' ? '/alumni/dashboard' : '/student/events' },
];

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
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%',
          zIndex: 1000,
          borderBottom: '1px solid rgba(226,232,240,0.8)',
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              flexShrink: 0,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'; }}
            >
              <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Connect<span style={{ color: '#2563eb' }}>Alum</span>
            </span>
          </Link>

          {/* ── Search ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: searchFocused ? '#fff' : '#f1f5f9',
            border: `1px solid ${searchFocused ? '#93c5fd' : '#e2e8f0'}`,
            borderRadius: '12px',
            padding: '7px 14px',
            width: searchFocused ? '260px' : '200px',
            transition: 'all 0.25s ease',
            boxShadow: searchFocused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
            flexShrink: 0,
          }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: searchFocused ? '#3b82f6' : '#94a3b8', fontSize: '12px', transition: 'color 0.2s' }} />
            <input
              type="text"
              placeholder="Search company, role..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: '#374151', width: '100%', fontWeight: 500 }}
            />
            {searchVal && (
              <button onClick={() => setSearchVal('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 1 }}>
                <FontAwesomeIcon icon={faTimes} style={{ fontSize: '11px' }} />
              </button>
            )}
          </div>

          {/* ── Nav Links ── */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0, flexShrink: 0 }}>
            {NAV_LINKS(role).map(link => {
              const active = isActive(link.path);
              return (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    style={{
                      display: 'block',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: active ? 700 : 600,
                      color: active ? '#2563eb' : '#475569',
                      backgroundColor: active ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      position: 'relative',
                      transition: 'all 0.18s ease',
                      borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#2563eb';
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Right Side ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

            {/* Messages */}
            {token && (
              <Link
                to={role === 'alumni' ? '/alumni/messages' : '/student/messages'}
                title="Messages"
                style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: '#64748b', textDecoration: 'none', transition: 'all 0.18s ease' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
              >
                <FontAwesomeIcon icon={faComments} style={{ fontSize: '15px' }} />
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', backgroundColor: '#ef4444', borderRadius: '50%', border: '1.5px solid #fff' }} />
              </Link>
            )}

            {/* Bell */}
            {token && (
              <button
                title="Notifications"
                style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.18s ease' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
              >
                <FontAwesomeIcon icon={faBell} style={{ fontSize: '15px' }} />
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '1.5px solid #fff' }} />
              </button>
            )}

            {/* Sign In / Avatar */}
            {!token ? (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 18px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Sign In
              </button>
            ) : (
              <div ref={dropRef} style={{ position: 'relative' }}>

                {/* Avatar button */}
                <button
                  onClick={() => setDropOpen(p => !p)}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px',
                    background: dropOpen ? 'linear-gradient(135deg, #1d4ed8, #4f46e5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: dropOpen ? '2px solid #93c5fd' : '2px solid rgba(255,255,255,0.8)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: dropOpen ? '0 0 0 3px rgba(59,130,246,0.2)' : '0 2px 6px rgba(37,99,235,0.3)',
                    transition: 'all 0.2s ease',
                    transform: dropOpen ? 'scale(0.95)' : 'scale(1)',
                  }}
                  onMouseEnter={e => { if (!dropOpen) e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.4)'; }}
                  onMouseLeave={e => { if (!dropOpen) e.currentTarget.style.boxShadow = '0 2px 6px rgba(37,99,235,0.3)'; }}
                >
                  {(role || 'U')[0].toUpperCase()}
                </button>

                {/* Dropdown */}
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '220px',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  zIndex: 1001,
                  transition: 'all 0.2s ease',
                  transformOrigin: 'top right',
                  opacity: dropOpen ? 1 : 0,
                  transform: dropOpen ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(-6px)',
                  pointerEvents: dropOpen ? 'auto' : 'none',
                }}>
                  {/* Header */}
                  <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #eff6ff, #eef2ff)', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                      {(role || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Signed in as</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '2px 0 0', textTransform: 'capitalize' }}>{role}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ padding: '8px' }}>
                    {[
                      { icon: faUser,       label: 'My Profile', action: () => navigate('/profile') },
                      { icon: faLayerGroup, label: 'Dashboard',  action: () => navigate(role === 'student' ? '/student/dashboard' : '/alumni/dashboard') },
                    ].map(item => (
                      <DropItem key={item.label} icon={item.icon} label={item.label} onClick={() => { item.action(); setDropOpen(false); }} />
                    ))}
                    <div style={{ margin: '6px 0', borderTop: '1px solid #f1f5f9' }} />
                    <DropItem icon={faSignOutAlt} label="Sign Out" onClick={logout} danger />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              style={{ display: 'none' }}
              className="md:hidden w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors flex items-center justify-center border-none bg-transparent cursor-pointer"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Spacer ─────────────────────────────────────────── */}
      <div style={{ height: '60px' }} />
    </>
  );
};

/* ── Dropdown Item ───────────────────────────────────────── */
const DropItem = ({ icon, label, onClick, danger }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '9px 12px',
        border: 'none',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        color: hovered ? (danger ? '#dc2626' : '#2563eb') : (danger ? '#ef4444' : '#374151'),
        backgroundColor: hovered ? (danger ? '#fef2f2' : '#eff6ff') : 'transparent',
      }}
    >
      <span style={{
        width: '28px', height: '28px',
        borderRadius: '8px',
        backgroundColor: hovered ? (danger ? '#fee2e2' : '#dbeafe') : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? (danger ? '#dc2626' : '#2563eb') : '#94a3b8',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}>
        <FontAwesomeIcon icon={icon} style={{ fontSize: '11px' }} />
      </span>
      {label}
      <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '9px', marginLeft: 'auto', color: hovered ? (danger ? '#dc2626' : '#93c5fd') : '#d1d5db', transition: 'color 0.15s' }} />
    </button>
  );
};

export default Navbar;
