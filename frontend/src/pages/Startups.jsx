import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StartupCard from '../components/StartupCard';
import API from '../api';

const Startups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ budget: '', difficulty: '' });
  
  const [mode, setMode] = useState('recommended');
  const [compareList, setCompareList] = useState([]);
const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    fetchStartups();
  // eslint-disable-next-line
  }, [mode]);

  const fetchStartups = async () => {
  setLoading(true);
  try {
    let res;
    if (mode === 'recommended') {
      res = await API.get('/recommend/startups');
      console.log('RECOMMEND RESPONSE:', res.data); 
    } else {
      res = await API.get('/startups');
    }
    setStartups(res.data);
  } catch (err) {
    console.error('RECOMMEND ERROR:', err.response?.data); 
  }
  setLoading(false);
};

  const filtered = startups.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchBudget = !filters.budget || s.budget === filters.budget;
    const matchDiff = !filters.difficulty || s.difficulty === filters.difficulty;
    return matchSearch && matchBudget && matchDiff;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}
  className="page-grid">

        {/* SIDEBAR */}
          <div className="sidebar-col">
        <div className="sidebar" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>🔍 Filters</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Budget</label>
            {['', 'zero', 'low', 'medium', 'high'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="radio" name="budget" value={opt} checked={filters.budget === opt} onChange={e => setFilters({ ...filters, budget: e.target.value })} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{opt === '' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
              </label>
            ))}
          </div>

          <div className="divider" />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Difficulty</label>
            {['', 'beginner', 'intermediate', 'advanced'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="radio" name="difficulty" value={opt} checked={filters.difficulty === opt} onChange={e => setFilters({ ...filters, difficulty: e.target.value })} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{opt === '' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
              </label>
            ))}
          </div>

          <button onClick={() => setFilters({ budget: '', difficulty: '' })} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Clear Filters
          </button>
        </div>
</div>
        {/* MAIN */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {mode === 'recommended' ? '🎯 Recommended Startups' : '💡 All Startup Ideas'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{filtered.length} ideas found</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setMode('recommended')} className={mode === 'recommended' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px', fontSize: '13px' }}>
                🎯 For You
              </button>
              <button onClick={() => setMode('all')} className={mode === 'all' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px', fontSize: '13px' }}>
                📋 All Ideas
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input type="text" className="input" placeholder="Search startup ideas..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Finding your best matches...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💡</div>
              <h3>No startup ideas found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map(startup => (
  <StartupCard
    key={startup._id}
    startup={startup}
    onCompare={() => {
      if (compareList.find(s => s._id === startup._id)) {
        setCompareList(compareList.filter(s => s._id !== startup._id));
      } else if (compareList.length < 2) {
        setCompareList([...compareList, startup]);
      }
    }}
    isInCompare={!!compareList.find(s => s._id === startup._id)}
  />
))
          )}
        </div>
      </div>
      {/* Compare Bar */}
{compareList.length > 0 && (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'var(--surface)', borderTop: '2px solid var(--accent)',
    padding: '12px 24px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
  }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
        ⚔️ Comparing {compareList.length}/2 startups
      </span>
      {compareList.map(s => (
        <span key={s._id} style={{ padding: '4px 12px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
          {s.title}
        </span>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      {compareList.length === 2 && (
        <button onClick={() => setShowCompare(true)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
          Compare Now →
        </button>
      )}
      <button onClick={() => setCompareList([])} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
        Clear
      </button>
    </div>
  </div>
)}

{/* Startup Compare Modal */}
{showCompare && compareList.length === 2 && (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  }}>
    <div style={{
      background: 'var(--surface)', borderRadius: '16px', width: '100%',
      maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>⚔️ Startup Comparison</h2>
        <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
      </div>
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {compareList.map((s, idx) => (
          <div key={s._id} style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', border: `2px solid ${idx === 0 ? 'var(--accent)' : 'var(--green)'}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>{s.title}</h3>
            {[
              { label: '📂 Category', value: s.category },
              { label: '⚡ Difficulty', value: s.difficulty },
              { label: '💰 Est. Cost', value: s.estimatedCost },
              { label: '⏱️ Time to Launch', value: s.timeToLaunch },
              { label: '💵 Revenue Potential', value: s.potentialRevenue },
              { label: '💼 Budget', value: s.budget },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{item.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', textTransform: 'capitalize' }}>{item.value || '—'}</span>
              </div>
            ))}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>VIABILITY SCORE</div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.viabilityScore || 0}%`, background: 'var(--green)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--green)', marginTop: '4px' }}>{s.viabilityScore || 0}%</div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>REQUIRED SKILLS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {s.requiredSkills?.map((skill, i) => (
                  <span key={i} className="skill-tag" style={{ fontSize: '11px' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Startups;