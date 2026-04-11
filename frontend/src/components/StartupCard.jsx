import React, { useState } from 'react';
import API from '../api';

const difficultyConfig = {
  beginner: { color: 'var(--green)', bg: 'var(--green-light)', border: 'var(--green-border)', label: '🟢 Beginner' },
  intermediate: { color: 'var(--orange)', bg: 'var(--orange-light)', border: 'rgba(234,88,12,0.2)', label: '🟡 Intermediate' },
  advanced: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: '🔴 Advanced' }
};

const StartupCard = ({ startup, onSave, saved = false }) => {
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [copied, setCopied] = useState(false);

  const diff = difficultyConfig[startup.difficulty] || difficultyConfig.beginner;
  const matchScore = startup.matchScore || 0;
  const viability = startup.viabilityScore || 75;

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!isSaved) {
        await API.post('/saved', {
          itemId: startup._id,
          itemType: 'startup',
          itemTitle: startup.title,
          itemCompany: startup.category
        });
        setIsSaved(true);
        if (onSave) onSave(startup._id, true);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/startups/${startup._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="card fade-in" style={{ padding: '20px', marginBottom: '12px' }}>

        {/* TOP ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '10px',
              background: 'var(--accent-light)', border: '1.5px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>💡</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {startup.title}
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                  background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`
                }}>
                  {diff.label}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {startup.category}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score */}
          {matchScore > 0 && (
            <div style={{
              background: matchScore >= 80 ? 'var(--green-light)' : 'var(--accent-light)',
              color: matchScore >= 80 ? 'var(--green)' : 'var(--accent)',
              border: `1px solid ${matchScore >= 80 ? 'var(--green-border)' : 'var(--accent-border)'}`,
              padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '700'
            }}>
              {matchScore >= 80 ? '🎯' : '👍'} {matchScore}% Match
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
          {startup.description}
        </p>

        {/* VIABILITY BAR */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Viability Score</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>{viability}/100</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              background: `linear-gradient(90deg, var(--accent), var(--green))`,
              width: `${viability}%`, transition: 'width 1s ease'
            }} />
          </div>
        </div>

        {/* META */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            💰 Budget: <strong style={{ color: 'var(--text-primary)' }}>{startup.estimatedCost}</strong>
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            ⏱️ Launch: <strong style={{ color: 'var(--text-primary)' }}>{startup.timeToLaunch}</strong>
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            📈 Revenue: <strong style={{ color: 'var(--green)' }}>{startup.potentialRevenue}</strong>
          </span>
        </div>

        {/* SKILLS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {startup.requiredSkills?.slice(0, 4).map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>

        <div className="divider" style={{ margin: '12px 0' }} />

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving || isSaved}
            className="btn-ghost"
            style={{ color: isSaved ? 'var(--accent)' : 'var(--text-muted)', background: isSaved ? 'var(--accent-light)' : 'transparent' }}
          >
            {isSaved ? '🔖 Saved' : '🔖 Save'}
          </button>

          <button onClick={handleShare} className="btn-ghost" style={{ color: copied ? 'var(--green)' : 'var(--text-muted)' }}>
            {copied ? '✅ Copied!' : '🔗 Share'}
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setShowRoadmap(true)}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            View Roadmap →
          </button>
        </div>
      </div>

      {/* ROADMAP MODAL */}
      {showRoadmap && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setShowRoadmap(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '32px', maxWidth: '560px', width: '100%',
              maxHeight: '80vh', overflowY: 'auto', position: 'relative'
            }}
          >
            <button
              onClick={() => setShowRoadmap(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: '50%', width: '32px', height: '32px',
                cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              💡 {startup.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Step-by-step launch roadmap · {startup.timeToLaunch} to launch
            </p>

            {startup.roadmap?.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', minWidth: '28px',
                  background: 'var(--accent-light)', border: '1px solid var(--accent-border)',
                  color: 'var(--accent)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '12px', fontWeight: '700'
                }}>{i + 1}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', paddingTop: '4px' }}>
                  {step}
                </p>
              </div>
            ))}

            <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              {isSaved ? '✅ Saved!' : '🔖 Save This Idea'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StartupCard;
