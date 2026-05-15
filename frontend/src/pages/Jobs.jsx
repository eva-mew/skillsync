import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import CompareModal from '../components/CompareModal';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileSkills, setProfileSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ workMode: '', type: '', experience: '' });
  const [mode, setMode] = useState('recommended');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
const navigate = useNavigate();
const { user } = useAuth();
const handleSave = (jobId, savedStatus) => {
  if (savedStatus) {
    setSavedJobs(prev => [...prev, jobId]);
  }
};

  // eslint-disable-next-line
  useEffect(() => { fetchJobs(); }, [mode]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = mode === 'recommended'
        ? await API.get('/recommend/jobs')
        : await API.get('/jobs');
      setJobs(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile');
      setProfileSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();
}, []);
  const filtered = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchMode = !filters.workMode || job.workMode === filters.workMode;
    const matchType = !filters.type || job.type === filters.type;
    const matchExp = !filters.experience || job.experience === filters.experience;
    return matchSearch && matchMode && matchType && matchExp;
  });

  const handleCompare = (job) => {
    if (compareList.find(j => j._id === job._id)) {
      setCompareList(prev => prev.filter(j => j._id !== job._id));
      return;
    }
    if (compareList.length >= 2) {
      alert('You can only compare 2 jobs at a time. Remove one first.');
      return;
    }
    setCompareList(prev => [...prev, job]);
  };

  const isInCompare = (jobId) => compareList.some(j => j._id === jobId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 100,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            ⚔️ Comparing {compareList.length}/2 jobs
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {compareList.map(job => (
              <span key={job._id} style={{
                padding: '4px 12px', borderRadius: '6px',
                background: 'var(--accent-light)', color: 'var(--accent)',
                fontSize: '12px', fontWeight: '600',
                border: '1px solid var(--accent-border)'
              }}>
                {job.title}
              </span>
            ))}
          </div>
          {compareList.length === 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Compare Now →
            </button>
          )}
          <button
            onClick={() => setCompareList([])}
            className="btn-ghost"
            style={{ fontSize: '12px', color: '#ef4444' }}
          >
            Clear
          </button>
        </div>
      )}

    {/* MAIN 3-COLUMN LAYOUT */}
<div style={{ 
  display: 'grid',
  gridTemplateColumns: '260px 1fr 280px',
  gap: '20px',
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '24px 20px',
  alignItems: 'start'
}} className="page-grid">

        {/* SIDEBAR */}
        <div className="sidebar-col">
          <div className="sidebar">
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>🔍 Filters</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Work Mode</label>
              {['', 'remote', 'hybrid', 'onsite'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="workMode" value={opt} checked={filters.workMode === opt} onChange={e => setFilters({ ...filters, workMode: e.target.value })} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {opt === '' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            <div className="divider" />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Job Type</label>
              {['', 'full-time', 'part-time', 'contract', 'internship'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="type" value={opt} checked={filters.type === opt} onChange={e => setFilters({ ...filters, type: e.target.value })} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {opt === '' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            <div className="divider" />

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Experience</label>
              {['', 'fresher', 'junior', 'mid', 'senior'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="experience" value={opt} checked={filters.experience === opt} onChange={e => setFilters({ ...filters, experience: e.target.value })} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {opt === '' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            <button onClick={() => setFilters({ workMode: '', type: '', experience: '' })} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              Clear Filters
            </button>
          </div>

          {/* Compare tip */}
          <div style={{ marginTop: '12px', padding: '14px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', marginBottom: '4px' }}>⚔️ Compare Jobs</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Click "Compare" on any 2 job cards to compare them side by side
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {mode === 'recommended' ? '🎯 Recommended Jobs' : '💼 All Jobs'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{filtered.length} jobs found</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setMode('recommended')} className={mode === 'recommended' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px', fontSize: '13px' }}>🎯 For You</button>
              <button onClick={() => setMode('all')} className={mode === 'all' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px', fontSize: '13px' }}>📋 All Jobs</button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input type="text" className="input" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Finding your best matches...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💼</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard
  key={job._id}
  job={job}
  profileSkills={profileSkills}
  onSave={handleSave}
  saved={savedJobs.includes(job._id)}
  onCompare={() => {
    if (compareList.find(j => j._id === job._id)) {
      setCompareList(compareList.filter(j => j._id !== job._id));
    } else if (compareList.length < 2) {
      setCompareList([...compareList, job]);
    }
  }}
  isInCompare={!!compareList.find(j => j._id === job._id)}
/>
            ))
          )}
        </div>

        {/* RIGHT — New Sidebar */}
<div
  className="jobs-right-sidebar"
  style={{ 
    position: 'sticky', 
  top: '84px', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '16px' 
}}>

  {/* PREMIUM AD CARD */}
  {!user?.isPremium && (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a52 0%, #325476 50%, #4B7DAF 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white',
      boxShadow: '0 8px 32px rgba(50,84,118,0.35)',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-10px',
        width: '80px',
        height: '80px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '50%'
      }} />

      <div style={{ fontSize: '32px', marginBottom: '10px' }}>👑</div>

      <div style={{
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#fbbf24',
        marginBottom: '6px'
      }}>
        SkillSync Pro
      </div>

      <h3 style={{
        fontSize: '18px',
        fontWeight: '800',
        marginBottom: '8px',
        lineHeight: '1.3'
      }}>
        Unlock Exclusive Jobs!
      </h3>

      <p style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        Get access to premium job listings, priority applications and career insights.
      </p>

      {[
        '✅ Premium exclusive jobs',
        '✅ Priority application',
        '✅ Company profiles',
        '✅ Invoice download',
      ].map((f, i) => (
        <div
          key={i}
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '6px'
          }}
        >
          {f}
        </div>
      ))}

      <div style={{
        marginTop: '16px',
        padding: '8px 0',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px',
        marginBottom: '14px'
      }}>
        <span style={{ fontSize: '28px', fontWeight: '800' }}>৳299</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          /month
        </span>
      </div>

      <button
        onClick={() => navigate('/premium')}
        style={{
          width: '100%',
          padding: '11px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          color: '#1a1a1a',
          border: 'none',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 4px 12px rgba(251,191,36,0.4)'
        }}
      >
        🚀 Upgrade to Pro →
      </button>

      <p style={{
        fontSize: '10px',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        🔒 Secured by SSLCommerz
      </p>
    </div>
  )}

  {/* PREMIUM ACTIVE */}
  {user?.isPremium && (
    <div style={{
      background: 'linear-gradient(135deg, #fbbf24, #d97706)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '36px', marginBottom: '8px' }}>👑</div>

      <div style={{
        fontWeight: '800',
        fontSize: '16px',
        marginBottom: '4px'
      }}>
        Premium Active!
      </div>

      <div style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.85)'
      }}>
        Valid until{' '}
        {new Date(user.premiumExpiresAt).toLocaleDateString('en-BD', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </div>
    </div>
  )}

</div>
      </div>

      {/* Compare Modal */}
      {showCompare && (
        <CompareModal
          jobs={compareList}
          onClose={() => setShowCompare(false)}
          onRemove={(index) => {
            setCompareList(prev => prev.filter((_, i) => i !== index));
            if (compareList.length <= 1) setShowCompare(false);
          }}
        />
      )}
    </div>
  );
};

export default Jobs;