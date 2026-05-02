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
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Explore Jobs', path: '/jobs' },
  ];

const userLinks = user?.role === 'admin'
  ? [
      // Admin ONLY sees Admin Panel in navbar
      { label: '🛡️ Admin Panel', path: '/admin' },
    ]
  : [
      // Regular user sees these
      { label: 'Jobs', path: '/jobs' },
      { label: 'Startups', path: '/startups' },
      { label: 'Dashboard', path: '/dashboard' },
    ];

  const navLinks = user ? userLinks : publicLinks;

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

          {/* Center Nav Links — always visible */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: isActive(link.path) ? 'var(--accent-light)' : 'transparent',
                  color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive(link.path) ? '600' : '500',
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
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
                      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
                      <div style={{
                        position: 'absolute', top: '46px', right: '0',
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '14px', padding: '8px', minWidth: '200px',
                        boxShadow: 'var(--shadow-lg)', zIndex: 100
                      }}>
                        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                          <span style={{
                            display: 'inline-block', marginTop: '6px', padding: '2px 8px',
                            borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                            background: user.role === 'admin' ? 'var(--orange-light)' : 'var(--accent-light)',
                            color: user.role === 'admin' ? 'var(--orange)' : 'var(--accent)'
                          }}>
                            {user.role}
                          </span>
                        </div>

                        {(user.role === 'admin'
  ? [
      { icon: '🛡️', label: 'Admin Panel', path: '/admin' },
    ]
  : [
      { icon: '📊', label: 'Dashboard', path: '/dashboard' },
      { icon: '📋', label: 'My Applications', path: '/applications' },
      { icon: '👤', label: 'My Profile', path: '/profile' },
      { icon: '👑', label: 'Go Premium', path: '/premium' },
    ]
).map(item => (
                          <button key={item.label}
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
              <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>

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