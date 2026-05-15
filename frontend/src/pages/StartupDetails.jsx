import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/startups/${id}`);
        setStartup(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleSave = async () => {
    try {
      await API.post('/saved', { itemId: startup._id, itemType: 'startup', itemTitle: startup.title });
      setSaved(true);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (!startup) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
        <h2 style={{ color: 'var(--text-primary)' }}>Startup not found</h2>
        <button onClick={() => navigate('/startups')} className="btn-primary" style={{ marginTop: '16px' }}>Back to Startups</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {showRoadmap && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '28px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>🗺️ Launch Roadmap</h3>
              <button onClick={() => setShowRoadmap(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>
            {(startup.roadmap || []).map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '4px 0 0' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => navigate('/startups')} className="btn-ghost" style={{ marginBottom: '20px' }}>← Back to Startups</button>

        <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>{startup.title}</h1>
              <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '12px', fontWeight: '700' }}>{startup.category}</span>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)' }}>{startup.viabilityScore}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Viability Score</div>
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                <div style={{ height: '100%', width: `${startup.viabilityScore}%`, background: 'var(--accent)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Budget', value: startup.budget, icon: '💰' },
              { label: 'Difficulty', value: startup.difficulty, icon: '⚡' },
              { label: 'Time to Launch', value: startup.timeToLaunch, icon: '⏱️' },
              { label: 'Est. Cost', value: startup.estimatedCost, icon: '💵' },
              { label: 'Revenue Potential', value: startup.potentialRevenue, icon: '📈' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.value || '—'}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>📋 Description</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>{startup.description}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>🔧 Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {startup.requiredSkills?.map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowRoadmap(true)} className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>🗺️ View Roadmap</button>
            <button onClick={handleSave} disabled={saved} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
              {saved ? '🔖 Saved!' : '🔖 Save Idea'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;