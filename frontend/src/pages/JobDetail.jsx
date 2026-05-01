import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
// eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

 // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchJob();
  fetchPremiumStatus();
}, [id]);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchPremiumStatus = async () => {
    try {
      const res = await API.get('/payment/status');
      setPremiumStatus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    // Check if job is premium and user is not premium
    if (job?.isPremium && !premiumStatus?.isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    setApplying(true);
    try {
      await API.post('/applications', { jobId: job._id });
      setApplied(true);
    } catch (err) {
      if (err.response?.data?.message === 'You have already applied for this job') {
        setApplied(true);
      } else {
        alert(err.response?.data?.message || 'Apply failed');
      }
    }
    setApplying(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div className="empty-state" style={{ paddingTop: '100px' }}>
        <div className="icon">💼</div>
        <h3>Job not found</h3>
        <button onClick={() => navigate('/jobs')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Jobs
        </button>
      </div>
    </div>
  );

  const firstLetter = job.company?.charAt(0).toUpperCase();
  const logoColors = {
    'A':'#2563eb','B':'#16a34a','C':'#dc2626','D':'#9333ea',
    'E':'#ea580c','F':'#0891b2','G':'#65a30d','H':'#db2777',
    'I':'#7c3aed','J':'#059669','K':'#d97706','L':'#0284c7',
    'M':'#be185d','N':'#15803d','O':'#b45309','P':'#7c3aed',
    'Q':'#0e7490','R':'#dc2626','S':'#1a7a3a','T':'#16a34a',
    'U':'#9333ea','V':'#ea580c','W':'#0891b2','X':'#65a30d',
    'Y':'#db2777','Z':'#7c3aed'
  };
  const logoColor = logoColors[firstLetter] || '#1a7a3a';
  const isPremiumJob = job.isPremium;
  const canApply = !isPremiumJob || premiumStatus?.isPremium;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* Premium Upgrade Prompt Modal */}
      {showPremiumPrompt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '20px',
            padding: '36px', maxWidth: '440px', width: '100%',
            textAlign: 'center', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Premium Job
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.7' }}>
              This is an exclusive Premium job listing. Upgrade to SkillSync Premium for <strong>৳299/month</strong> to apply for premium opportunities.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/premium')}
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: '15px' }}
              >
                👑 Upgrade to Premium
              </button>
              <button
                onClick={() => setShowPremiumPrompt(false)}
                className="btn-secondary"
                style={{ padding: '12px 20px' }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="btn-ghost"
          style={{ marginBottom: '20px', fontSize: '14px' }}
        >
          ← Back to Jobs
        </button>

        {/* Premium Banner */}
        {isPremiumJob && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b22, #d9770622)',
            border: '1px solid #f59e0b',
            borderRadius: '10px', padding: '12px 18px',
            marginBottom: '20px', display: 'flex',
            alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <div>
              <span style={{ fontWeight: '700', color: '#d97706', fontSize: '14px' }}>
                Premium Exclusive Job
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                {premiumStatus?.isPremium
                  ? '✅ You have Premium access to apply'
                  : 'Upgrade to Premium to apply for this job'}
              </span>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>

          {/* Company Header */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap' }}>

            {/* Company Logo — Large */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '16px',
              background: `${logoColor}18`,
              border: `2px solid ${logoColor}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: '900', color: logoColor,
              flexShrink: 0, cursor: 'pointer',
              boxShadow: `0 4px 14px ${logoColor}20`
            }}>
              {firstLetter}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {job.title}
                </h1>
                {isPremiumJob && (
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white', fontSize: '11px', fontWeight: '700'
                  }}>
                    👑 Premium
                  </span>
                )}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {job.company}
              </div>

              {/* Meta Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {[
                  { icon: '📍', text: job.location || 'Bangladesh' },
                  { icon: '💼', text: job.type?.replace('-', ' ') },
                  { icon: job.workMode === 'remote' ? '🌍' : job.workMode === 'hybrid' ? '🔀' : '🏢', text: job.workMode },
                  { icon: '🎯', text: job.experience },
                  { icon: '💰', text: `৳${job.salary}/month` },
                ].map((m, i) => (
                  <span key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {m.icon} <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{m.text}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Match Score */}
            {job.matchScore !== undefined && (
              <div style={{
                textAlign: 'center', padding: '16px 20px',
                background: job.matchScore >= 80 ? 'var(--green-light)' : 'var(--accent-light)',
                border: `1px solid ${job.matchScore >= 80 ? 'var(--green-border)' : 'var(--accent-border)'}`,
                borderRadius: '12px', minWidth: '100px'
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: job.matchScore >= 80 ? 'var(--green)' : 'var(--accent)' }}>
                  {job.matchScore}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Match Score</div>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Required Skills */}
          <div style={{ marginTop: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              🔧 Required Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.requiredSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="skill-tag"
                  style={{
                    fontSize: '13px', padding: '6px 14px',
                    background: job.matchedSkills?.includes(skill) ? 'var(--green-light)' : 'var(--accent-light)',
                    color: job.matchedSkills?.includes(skill) ? 'var(--green)' : 'var(--accent)',
                    border: `1px solid ${job.matchedSkills?.includes(skill) ? 'var(--green-border)' : 'var(--accent-border)'}`
                  }}
                >
                  {job.matchedSkills?.includes(skill) ? '✓ ' : ''}{skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              📋 Job Description
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Apply Button */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {applied ? (
              <div style={{
                padding: '12px 28px', borderRadius: '10px',
                background: 'var(--green-light)', border: '1px solid var(--green-border)',
                color: 'var(--green)', fontWeight: '700', fontSize: '15px'
              }}>
                ✅ Application Submitted!
              </div>
            ) : canApply ? (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary"
                style={{ padding: '13px 32px', fontSize: '15px', borderRadius: '10px' }}
              >
                {applying ? 'Submitting...' : '🚀 Apply Now'}
              </button>
            ) : (
              <button
                onClick={() => setShowPremiumPrompt(true)}
                style={{
                  padding: '13px 32px', fontSize: '15px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white', border: 'none', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                👑 Upgrade to Apply
              </button>
            )}
            <button
              onClick={() => navigate('/jobs')}
              className="btn-secondary"
              style={{ padding: '13px 24px', fontSize: '15px', borderRadius: '10px' }}
            >
              Browse More Jobs
            </button>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
            🏢 About {job.company}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '20px' }}>
            {[
              { icon: '🏢', label: 'Company', value: job.company },
              { icon: '📍', label: 'Location', value: job.companyLocation || job.location || 'Bangladesh' },
              { icon: '👥', label: 'Company Size', value: job.companySize || 'Not specified' },
              { icon: '🌐', label: 'Website', value: job.companyWebsite || 'Not specified', isLink: !!job.companyWebsite },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{item.label}</div>
                {item.isLink ? (
                  <a href={item.value} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.value}</div>
                )}
              </div>
            ))}
          </div>

          {job.companyDescription && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>About the Company</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                {job.companyDescription}
              </p>
            </div>
          )}

          {!job.companyDescription && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No additional company information provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;