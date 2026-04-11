import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const statusConfig = {
  pending: { label: '🕐 Pending', bg: 'var(--orange-light)', color: 'var(--orange)', border: 'rgba(234,88,12,0.2)' },
  viewed: { label: '👁️ Viewed', bg: 'var(--accent-light)', color: 'var(--accent)', border: 'var(--accent-border)' },
  shortlisted: { label: '⭐ Shortlisted', bg: 'var(--green-light)', color: 'var(--green)', border: 'var(--green-border)' },
  rejected: { label: '❌ Rejected', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    viewed: applications.filter(a => a.status === 'viewed').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
            My Applications
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            📋 Job Applications
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Track the status of all your job applications
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'all', label: 'Total', icon: '📋', color: 'var(--accent)' },
            { key: 'pending', label: 'Pending', icon: '🕐', color: 'var(--orange)' },
            { key: 'viewed', label: 'Viewed', icon: '👁️', color: 'var(--accent)' },
            { key: 'shortlisted', label: 'Shortlisted', icon: '⭐', color: 'var(--green)' },
            { key: 'rejected', label: 'Rejected', icon: '❌', color: '#dc2626' }
          ].map(s => (
            <div
              key={s.key}
              onClick={() => setFilter(s.key)}
              className="card"
              style={{
                padding: '16px', textAlign: 'center', cursor: 'pointer',
                borderColor: filter === s.key ? 'var(--accent)' : 'var(--border)',
                background: filter === s.key ? 'var(--accent-light)' : 'var(--surface)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>
                {counts[s.key]}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'viewed', 'shortlisted', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '100px', border: '1px solid',
                borderColor: filter === f ? 'var(--accent)' : 'var(--border2)',
                background: filter === f ? 'var(--accent-light)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                textTransform: 'capitalize', transition: 'all 0.2s'
              }}
            >
              {f === 'all' ? `All (${counts.all})` : `${f} (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading your applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {filter === 'all' ? 'Start applying to jobs to track them here' : `You have no ${filter} applications right now`}
            </p>
            {filter === 'all' && (
              <a href="/jobs">
                <button className="btn-primary">Browse Jobs →</button>
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((app, i) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              return (
                <div
                  key={app._id}
                  className="card fade-in"
                  style={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>

                    {/* Left — Job Info */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                      {/* Company Logo */}
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '10px',
                        background: 'var(--accent-light)', border: '1.5px solid var(--accent-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: '800', color: 'var(--accent)',
                        flexShrink: 0
                      }}>
                        {app.company?.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {app.jobTitle}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                          {app.company}
                        </p>

                        {/* Skills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                          {app.skills?.slice(0, 4).map((skill, j) => (
                            <span key={j} className="skill-tag" style={{ fontSize: '11px', padding: '2px 8px' }}>
                              {skill}
                            </span>
                          ))}
                          {app.skills?.length > 4 && (
                            <span className="badge badge-gray">+{app.skills.length - 4}</span>
                          )}
                        </div>

                        {/* Meta */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🎯 Experience: <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{app.experience}</strong>
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📅 Applied: <strong style={{ color: 'var(--text-secondary)' }}>{new Date(app.appliedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right — Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                      <span style={{
                        padding: '6px 14px', borderRadius: '100px',
                        fontSize: '13px', fontWeight: '600',
                        background: status.bg, color: status.color,
                        border: `1px solid ${status.border}`
                      }}>
                        {status.label}
                      </span>

                      {/* Status Timeline */}
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {['pending', 'viewed', 'shortlisted'].map((s, idx) => {
                          const steps = ['pending', 'viewed', 'shortlisted'];
                          const currentIdx = steps.indexOf(app.status);
                          const isActive = idx <= currentIdx && app.status !== 'rejected';
                          const isRejected = app.status === 'rejected';
                          return (
                            <React.Fragment key={s}>
                              <div style={{
                                width: '10px', height: '10px', borderRadius: '50%',
                                background: isRejected ? '#fecaca' : isActive ? 'var(--accent)' : 'var(--border2)',
                                transition: 'all 0.3s'
                              }} />
                              {idx < 2 && (
                                <div style={{
                                  width: '24px', height: '2px',
                                  background: isRejected ? '#fecaca' : idx < currentIdx ? 'var(--accent)' : 'var(--border2)'
                                }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {app.status === 'pending' && 'Waiting for review'}
                        {app.status === 'viewed' && 'Employer viewed your profile'}
                        {app.status === 'shortlisted' && '🎉 You are shortlisted!'}
                        {app.status === 'rejected' && 'Not selected this time'}
                      </div>
                    </div>

                  </div>

                  {/* Shortlisted Banner */}
                  {app.status === 'shortlisted' && (
                    <div style={{
                      marginTop: '16px', padding: '12px 16px',
                      background: 'var(--green-light)',
                      border: '1px solid var(--green-border)',
                      borderRadius: '8px', fontSize: '13px',
                      color: 'var(--green)', fontWeight: '500'
                    }}>
                      🎉 Congratulations! You have been shortlisted for <strong>{app.jobTitle}</strong> at <strong>{app.company}</strong>. Expect to hear from them soon!
                    </div>
                  )}

                  {/* Rejected Message */}
                  {app.status === 'rejected' && (
                    <div style={{
                      marginTop: '16px', padding: '12px 16px',
                      background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: '8px', fontSize: '13px', color: '#dc2626'
                    }}>
                      Thank you for applying. Unfortunately you were not selected for this role. Keep applying — your perfect match is out there!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;