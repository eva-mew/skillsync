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
      } else {
        res = await API.get('/startups');
      }
      setStartups(res.data);
    } catch (err) {
      console.error(err);
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
            filtered.map(s => <StartupCard key={s._id} startup={s} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Startups;