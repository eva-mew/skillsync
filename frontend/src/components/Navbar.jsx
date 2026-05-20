import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTheme from '../useTheme';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { label: 'Home',        path: '/' },
    { label: 'About',       path: '/about' },
    { label: 'Contact',     path: '/contact' },
    { label: 'Explore Jobs', path: '/jobs' },
  ];

  const getNavLinks = () => {
    if (!user) return publicLinks;
    if (user.role === 'admin') return [{ label: '🛡️ Admin Panel', path: '/admin' }];

    const type = user.onboardingType;
    if (type === 'job') {
      return [
        { label: 'Jobs',      path: '/jobs' },
        { label: 'Dashboard', path: '/dashboard' },
      ];
    }
    if (type === 'startup') {
      return [
        { label: 'Startups',  path: '/startups' },
        { label: 'Dashboard', path: '/dashboard' },
      ];
    }
    // both or undefined
    return [
      { label: 'Jobs',      path: '/jobs' },
      { label: 'Startups',  path: '/startups' },
      { label: 'Dashboard', path: '/dashboard' },
    ];
  };

  const getDropdownLinks = () => {
    if (user?.role === 'admin') {
      return [{ icon: '🛡️', label: 'Admin Panel', path: '/admin' }];
    }

    const type = user?.onboardingType;
    const base = [
      { icon: '📊', label: 'Dashboard',  path: '/dashboard' },
      { icon: '👤', label: 'My Profile', path: '/profile' },
    ];

    // My Applications only relevant for job seekers
    if (type === 'job' || type === 'both') {
      base.splice(1, 0, { icon: '📋', label: 'My Applications', path: '/applications' });
    }

    // Go Premium only for job seekers and both (not pure startup builders)
    if (type !== 'startup') {
      base.push({ icon: '👑', label: 'Go Premium', path: '/premium' });
    }

    return base;
  };

  const navLinks = getNavLinks();
  const dropdownLinks = getDropdownLinks();

  return (
    <>
      <nav className="navbar">
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          height: '64px'
        }}>

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '800', color: 'white'
            }}>S</div>
            <span style={{
              fontSize: '18px', fontWeight: '800',
              color: 'var(--text-primary)', letterSpacing: '-0.5px'
            }}>
              SkillSync
            </span>
          </div>

          {/* Center Nav Links */}
          <div style={{ display: 'flex', gap: '4px' }} className="navbar-links">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                onMouseEnter={e => {
                  if (!isActive(link.path)) {
                    e.target.style.background = 'var(--accent-light)';
                    e.target.style.color = 'var(--accent)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.path)) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                  }
                }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: isActive(link.path) ? 'var(--accent-light)' : 'transparent',
                  color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive(link.path) ? '600' : '500',
                  fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface2)', cursor: 'pointer',
                fontSize: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                {/* Avatar + Dropdown */}
                <div style={{ position: 'relative' }} className="navbar-links">
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'var(--accent)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                      border: '2px solid var(--accent-border)'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  {menuOpen && (
                    <>
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                        onClick={() => setMenuOpen(false)}
                      />
                      <div style={{
                        position: 'absolute', top: '46px', right: '0',
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '14px', padding: '8px', minWidth: '200px',
                        boxShadow: 'var(--shadow-lg)', zIndex: 100
                      }}>
                        {/* User info */}
                        <div style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--border)',
                          marginBottom: '6px'
                        }}>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {user.email}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: '4px',
                              fontSize: '11px', fontWeight: '600',
                              background: user.role === 'admin' ? 'var(--orange-light)' : 'var(--accent-light)',
                              color: user.role === 'admin' ? 'var(--orange)' : 'var(--accent)'
                            }}>
                              {user.role}
                            </span>
                            {user.onboardingType && user.role !== 'admin' && (
                              <span style={{
                                padding: '2px 8px', borderRadius: '4px',
                                fontSize: '11px', fontWeight: '600',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-muted)'
                              }}>
                                {user.onboardingType === 'job' ? '💼 Job Seeker'
                                  : user.onboardingType === 'startup' ? '💡 Startup'
                                  : '🚀 Both'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dropdown links */}
                        {dropdownLinks.map(item => (
                          <button
                            key={item.label}
                            onClick={() => { navigate(item.path); setMenuOpen(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              width: '100%', padding: '9px 12px', borderRadius: '8px',
                              border: 'none', background: 'transparent',
                              color: 'var(--text-secondary)', fontSize: '13px',
                              fontWeight: '500', cursor: 'pointer',
                              fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left'
                            }}
                          >
                            {item.icon} {item.label}
                          </button>
                        ))}

                        <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            width: '100%', padding: '9px 12px', borderRadius: '8px',
                            border: 'none', background: 'transparent', color: '#ef4444',
                            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                            fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left'
                          }}
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-btn"
                  style={{
                    display: 'none', width: '38px', height: '38px',
                    borderRadius: '10px', border: '1px solid var(--border)',
                    background: 'var(--surface2)', cursor: 'pointer',
                    fontSize: '18px', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
                <button
                  onClick={() => navigate('/premium')}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white', border: 'none', fontWeight: '700',
                    fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  👑 Premium
                </button>
                <button className="btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px', position: 'sticky', top: '64px', zIndex: 99
        }}>
          {/* User info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', background: 'var(--bg-secondary)',
            borderRadius: '10px', marginBottom: '10px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--accent)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '16px'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {user.onboardingType === 'job' ? '💼 Job Seeker'
                  : user.onboardingType === 'startup' ? '💡 Startup Builder'
                  : user.onboardingType === 'both' ? '🚀 Job & Startup'
                  : user.email}
              </div>
            </div>
          </div>

          {/* Nav links */}
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '12px 14px', borderRadius: '10px', border: 'none',
                background: isActive(link.path) ? 'var(--accent-light)' : 'transparent',
                color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: '500', fontSize: '14px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left',
                marginBottom: '4px'
              }}
            >
              {link.label}
            </button>
          ))}

          <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

          {/* Dropdown links in mobile too */}
          {dropdownLinks.map(item => (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '12px 14px', borderRadius: '10px', border: 'none',
                background: 'transparent', color: 'var(--text-secondary)',
                fontWeight: '500', fontSize: '14px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left',
                marginBottom: '4px'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', width: '100%',
              padding: '12px 14px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: '#ef4444',
              fontWeight: '500', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;