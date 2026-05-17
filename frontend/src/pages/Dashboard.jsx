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
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, startups: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved');

  // eslint-disable-next-line
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin');
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, savedRes, appsRes, jobsRes, startupsRes] = await Promise.all([
        API.get('/profile'),
        API.get('/saved'),
        API.get('/applications/my'),
        API.get('/recommend/jobs').catch(() => ({ data: [] })),
        API.get('/recommend/startups').catch(() => ({ data: [] })),
      ]);
      setProfile(profileRes.data);
      setSaved(savedRes.data);
      setApplications(appsRes.data);
      setStats({
        jobs: jobsRes.data.length,
        startups: startupsRes.data.length
      });

      // Fetch messages separately
      try {
        const msgRes = await API.get('/contact/my');
        setMessages(msgRes.data);
      } catch (e) {
        setMessages([]);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
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
  const unreadReplies = messages.filter(m => m.status === 'replied' && m.reply).length;

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
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Here's your career intelligence dashboard</p>
        </div>

        {/* Stats Cards */}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[
                { key: 'saved', label: '🔖 Saved Jobs', count: savedJobs.length },
                { key: 'startups', label: '💡 Saved Ideas', count: savedStartups.length },
                { key: 'applications', label: '📋 Applications', count: applications.length },
                { key: 'messages', label: '📬 Messages', count: messages.length, badge: unreadReplies },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.key === 'messages' && unreadReplies > 0) {
                      API.put('/contact/mark-seen').then(() => {
                        setMessages(msgs => msgs.map(m => ({ ...m, userSeen: true })));
                      });
                    }
                  }}
                  style={{
                    padding: '8px 16px', borderRadius: '8px',  cursor: 'pointer',
                    background: activeTab === tab.key ? 'var(--accent)' : 'var(--surface)',
                    color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
                    fontWeight: '600', fontSize: '13px', fontFamily: 'inherit',
                    border: activeTab === tab.key ? 'none' : '1px solid var(--border)',
                    position: 'relative',
                  }}
                >
                  {tab.label} ({tab.count})
                  {tab.badge > 0 && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: 'var(--green)', color: 'white',
                      borderRadius: '100px', fontSize: '10px', fontWeight: '700',
                      padding: '1px 6px', minWidth: '18px', textAlign: 'center'
                    }}>{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Saved Jobs Tab */}
            {activeTab === 'saved' && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>💼 Saved Jobs</h2>
                  <button onClick={() => navigate('/jobs')} className="btn-ghost">Browse Jobs →</button>
                </div>
                {savedJobs.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px' }}>
                    <div className="icon" style={{ fontSize: '32px' }}>💼</div>
                    <p>No saved jobs yet</p>
                    <button onClick={() => navigate('/jobs')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Browse Jobs</button>
                  </div>
                ) : savedJobs.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{item.itemTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.itemCompany}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
  onClick={() => navigate(`/jobs/${item.itemId}`)}
  className="btn-ghost"
  style={{ fontSize: '12px', padding: '5px 10px' }}
>
  View
</button>
                      <button onClick={() => handleUnsave(item._id)} style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Startups Tab */}
            {activeTab === 'startups' && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>💡 Saved Startup Ideas</h2>
                  <button onClick={() => navigate('/startups')} className="btn-ghost">Browse Ideas →</button>
                </div>
                {savedStartups.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px' }}>
                    <div className="icon" style={{ fontSize: '32px' }}>💡</div>
                    <p>No saved startup ideas yet</p>
                    <button onClick={() => navigate('/startups')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Browse Ideas</button>
                  </div>
                ) : savedStartups.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{item.itemTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Startup Idea</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
  <button
    onClick={() => navigate(`/startups/${item.itemId}`)}
    className="btn-ghost"
    style={{ fontSize: '12px', padding: '5px 10px' }}
  >
    View
  </button>

  <button
    onClick={() => handleUnsave(item._id)}
    style={{
      padding: '5px 10px',
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px'
    }}
  >
    Remove
  </button>
</div>
                  </div>
                ))}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>📋 My Applications</h2>
                  <button onClick={() => navigate('/applications')} className="btn-ghost">View All →</button>
                </div>
                {applications.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px' }}>
                    <div className="icon" style={{ fontSize: '32px' }}>📋</div>
                    <p>No applications yet</p>
                    <button onClick={() => navigate('/jobs')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Browse Jobs</button>
                  </div>
                ) : applications.slice(0, 5).map((app) => (
                  <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{app.jobTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {app.company} · Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                   <span style={{
  padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
  background: app.status === 'selected' ? '#1a7a3a' :
              app.status === 'shortlisted' ? 'var(--green-light)' :
              app.status === 'rejected' ? '#fef2f2' :
              app.status === 'viewed' ? 'var(--accent-light)' : 'var(--orange-light)',
  color: app.status === 'selected' ? 'white' :
         app.status === 'shortlisted' ? 'var(--green)' :
         app.status === 'rejected' ? '#dc2626' :
         app.status === 'viewed' ? 'var(--accent)' : 'var(--orange)',
}}>
  {app.status === 'pending' ? '🕐 Pending' :
   app.status === 'viewed' ? '👁️ Viewed' :
   app.status === 'shortlisted' ? '⭐ Shortlisted' :
   app.status === 'selected' ? '🏆 Selected!' : '❌ Rejected'}
</span>
                  </div>
                ))}
                {applications.length > 5 && (
                  <button onClick={() => navigate('/applications')} className="btn-ghost" style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>
                    View All {applications.length} Applications →
                  </button>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    📬 My Messages
                    {unreadReplies > 0 && (
                      <span style={{ marginLeft: '8px', background: 'var(--green)', color: 'white', borderRadius: '100px', fontSize: '11px', padding: '2px 8px', fontWeight: '700' }}>
                        {unreadReplies} new reply
                      </span>
                    )}
                  </h2>
                  <button onClick={() => navigate('/contact')} className="btn-ghost" style={{ fontSize: '12px' }}>Send Message →</button>
                </div>

                {messages.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px' }}>
                    <div className="icon" style={{ fontSize: '32px' }}>📬</div>
                    <p>No messages yet</p>
                    <button onClick={() => navigate('/contact')} className="btn-primary" style={{ marginTop: '12px', fontSize: '13px', padding: '8px 16px' }}>Contact Support</button>
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg._id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '10px', marginBottom: '12px', border: '1px solid var(--border)' }}>
                    {/* Message Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {msg.subject || 'General Inquiry'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Sent {new Date(msg.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
                        background: msg.status === 'replied' ? 'var(--green-light)' :
                                    msg.status === 'read' ? 'var(--accent-light)' : 'var(--orange-light)',
                        color: msg.status === 'replied' ? 'var(--green)' :
                               msg.status === 'read' ? 'var(--accent)' : 'var(--orange)',
                      }}>
                        {msg.status === 'replied' ? '✅ Replied' : msg.status === 'read' ? '👁️ Read' : '🕐 Pending'}
                      </span>
                    </div>

                    {/* Your Message */}
                    <div style={{ padding: '10px 12px', background: 'var(--surface)', borderRadius: '8px', marginBottom: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Your Message</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{msg.message}</div>
                    </div>

                    {/* Admin Reply */}
                    {msg.reply ? (
                      <div style={{ padding: '10px 12px', background: 'var(--accent-light)', borderRadius: '8px', border: '1px solid var(--accent-border)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px', textTransform: 'uppercase' }}>
                          💬 Admin Reply · {new Date(msg.repliedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{msg.reply}</div>
                      </div>
                    ) : (
                      <div style={{ padding: '8px 12px', background: 'var(--orange-light)', borderRadius: '8px', border: '1px solid var(--orange-border)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--orange)', fontWeight: '500' }}>
                          ⏳ Waiting for admin reply...
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Profile Card */}
            <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', flexShrink: 0 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
                  {user?.isPremium && (
                    <span style={{ fontSize: '11px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>
                      👑 Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Strength */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Profile Strength</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: strength >= 80 ? 'var(--green)' : 'var(--accent)' }}>{strength}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${strength}%`, background: strength >= 80 ? 'var(--green)' : 'var(--accent)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
                {strength < 100 && (
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {strength < 50 ? 'Complete your profile for better matches' : 'Almost there! Add more skills'}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => navigate('/profile')} className="btn-primary" style={{ padding: '9px', fontSize: '13px', justifyContent: 'center' }}>
                  ✏️ Edit Profile
                </button>
                <button onClick={() => navigate('/applications')} className="btn-secondary" style={{ padding: '9px', fontSize: '13px', justifyContent: 'center' }}>
                  📋 My Applications
                </button>
                {!user?.isPremium && (
                  <button onClick={() => navigate('/premium')} style={{ padding: '9px', fontSize: '13px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit' }}>
                    👑 Go Premium
                  </button>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>🔗 Quick Links</h3>
              {[
                { label: '💼 Browse Jobs', path: '/jobs' },
                { label: '💡 Startup Ideas', path: '/startups' },
                { label: '✏️ Edit Profile', path: '/profile' },
                { label: '📬 Contact Support', path: '/contact' },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.path)}
                  className="btn-ghost"
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', fontSize: '13px', marginBottom: '4px', borderRadius: '6px' }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Skills Preview */}
            {profile?.skills?.length > 0 && (
              <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>🎯 My Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.skills.slice(0, 8).map((skill, i) => (
                    <span key={i} className="skill-tag" style={{ fontSize: '11px' }}>{skill}</span>
                  ))}
                  {profile.skills.length > 8 && (
                    <span className="badge badge-gray" style={{ fontSize: '11px' }}>+{profile.skills.length - 8} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;