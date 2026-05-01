import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, startups: 0 });
  const [loading, setLoading] = useState(true);

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (user?.role === 'admin') {
    navigate('/admin');
  }
}, [user]);

useEffect(() => {
  fetchData();
}, []);

  const fetchData = async () => {
    try {
      const [profileRes, savedRes, jobsRes, startupsRes] = await Promise.all([
        API.get('/profile'),
        API.get('/saved'),
        API.get('/recommend/jobs'),
        API.get('/recommend/startups')
      ]);
      setProfile(profileRes.data);
      setSaved(savedRes.data);
      setStats({ jobs: jobsRes.data.length, startups: startupsRes.data.length });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUnsave = async (id) => {
    try {
      await API.delete(`/saved/${id}`);
      setSaved(saved.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const savedJobs = saved.filter(s => s.itemType === 'job');
  const savedStartups = saved.filter(s => s.itemType === 'startup');
  const strength = profile?.profileComplete || 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Here's your career intelligence dashboard</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
              {[
                { num: stats.jobs, label: 'Jobs Matched', color: 'var(--accent)', icon: '💼' },
                { num: stats.startups, label: 'Startup Ideas', color: 'var(--green)', icon: '💡' },
                { num: savedJobs.length, label: 'Jobs Saved', color: '#7c3aed', icon: '🔖' },
                { num: savedStartups.length, label: 'Ideas Saved', color: 'var(--orange)', icon: '⭐' }
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.num}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Saved Jobs */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>💼 Saved Jobs</h2>
                <button onClick={() => navigate('/jobs')} className="btn-ghost">View All →</button>
              </div>
              {savedJobs.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <div className="icon" style={{ fontSize: '32px' }}>💼</div>
                  <p>No saved jobs yet</p>
                  <button onClick={() => navigate('/jobs')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Browse Jobs</button>
                </div>
              ) : (
                savedJobs.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>
                      {item.itemCompany?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.itemTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.itemCompany}</div>
                    </div>
                    <button onClick={() => handleUnsave(item._id)} className="btn-ghost" style={{ fontSize: '12px', color: '#ef4444' }}>Remove</button>
                  </div>
                ))
              )}
            </div>

            {/* Saved Startups */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>💡 Saved Startup Ideas</h2>
                <button onClick={() => navigate('/startups')} className="btn-ghost">View All →</button>
              </div>
              {savedStartups.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <div className="icon" style={{ fontSize: '32px' }}>💡</div>
                  <p>No saved startup ideas yet</p>
                  <button onClick={() => navigate('/startups')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Browse Ideas</button>
                </div>
              ) : (
                savedStartups.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem' }}>💡</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.itemTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.itemCompany}</div>
                    </div>
                    <button onClick={() => handleUnsave(item._id)} className="btn-ghost" style={{ fontSize: '12px', color: '#ef4444' }}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Profile Card */}
            <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: 'white' }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
              </div>

              {/* Profile Strength */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Profile Strength</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: strength >= 80 ? 'var(--green)' : 'var(--accent)' }}>{strength}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: strength >= 80 ? 'var(--green)' : 'var(--accent)', borderRadius: '4px', width: `${strength}%`, transition: 'width 1s ease' }} />
                </div>
                {strength < 100 && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Complete your profile for better matches
                  </p>
                )}
              </div>

              {/* Skills */}
              {profile?.skills?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>YOUR SKILLS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.skills.map((skill, i) => <span key={i} className="skill-tag" style={{ fontSize: '11px' }}>{skill}</span>)}
                  </div>
                </div>
              )}

              <button onClick={() => navigate('/onboarding')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                ✏️ Edit Profile
              </button>
              <button onClick={() => navigate('/applications')} className="btn-secondary" style={{ fontSize:'13px' }}>
  📋 My Applications
</button>
            </div>

            {/* Quick Links */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Quick Links</h3>
              {[
                { icon: '💼', label: 'Browse Jobs', path: '/jobs' },
                { icon: '💡', label: 'Startup Ideas', path: '/startups' },
                { icon: '✏️', label: 'Edit Profile', path: '/onboarding' }
              ].map((link, i) => (
                <button key={i} onClick={() => navigate(link.path)} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}>
                  {link.icon} {link.label}
                </button>
                
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;