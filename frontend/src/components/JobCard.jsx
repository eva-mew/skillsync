import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
// Company logo color map
const logoColors = {
  'A': '#2563eb', 'B': '#16a34a', 'C': '#dc2626', 'D': '#9333ea',
  'E': '#ea580c', 'F': '#0891b2', 'G': '#65a30d', 'H': '#db2777',
  'I': '#7c3aed', 'J': '#059669', 'K': '#d97706', 'L': '#0284c7',
  'M': '#be185d', 'N': '#15803d', 'O': '#b45309', 'P': '#7c3aed',
  'Q': '#0e7490', 'R': '#dc2626', 'S': '#2563eb', 'T': '#16a34a',
  'U': '#9333ea', 'V': '#ea580c', 'W': '#0891b2', 'X': '#65a30d',
  'Y': '#db2777', 'Z': '#7c3aed'
};

const getMatchClass = (score) => {
  if (score >= 80) return 'match-high';
  if (score >= 50) return 'match-mid';
  return 'match-low';
};

const getMatchLabel = (score) => {
  if (score >= 80) return '🎯 Great Match';
  if (score >= 50) return '👍 Good Match';
  return '📋 Possible';
};

const JobCard = ({ job, onSave, saved = false, onCompare, isInCompare = false }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  const firstLetter = job.company?.charAt(0).toUpperCase() || 'C';
  const logoColor = logoColors[firstLetter] || '#2563eb';

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!isSaved) {
        await API.post('/saved', {
          itemId: job._id,
          itemType: 'job',
          itemTitle: job.title,
          itemCompany: job.company
        });
        setIsSaved(true);
        if (onSave) onSave(job._id, true);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jobs/${job._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async () => {
  if (applied) return;
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
};

  return (
    <div className="card fade-in" style={{ padding: '20px', marginBottom: '12px' }}>

      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>

        {/* Company Logo + Info */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div className="company-logo" onClick={() => navigate(`/jobs/${job._id}`)} style={{ background: `${logoColor}15`, color: logoColor, border: `1.5px solid ${logoColor}30`, fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}>
  {firstLetter}
</div>
          <div>
           <h3 onClick={() => navigate(`/jobs/${job._id}`)} style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: '1.3', cursor: 'pointer' }}>
  {job.title}
</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {job.company}
            </div>
          </div>
        </div>

        {/* Match Score */}
        {job.matchScore !== undefined && (
          <div className={`match-score ${getMatchClass(job.matchScore)}`}>
            {getMatchLabel(job.matchScore)} · {job.matchScore}%
          </div>
        )}
        {/* Premium Badge */}
{job.isPremium && (
  <span style={{
    padding: '4px 10px', borderRadius: '100px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white', fontSize: '11px', fontWeight: '700',
    marginLeft: '6px'
  }}>
    👑 Premium
  </span>
)}
      </div>

      {/* META INFO */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          📍 {job.location || 'Bangladesh'}
        </span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          💼 {job.type?.replace('-', ' ')}
        </span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {job.workMode === 'remote' ? '🌍' : job.workMode === 'hybrid' ? '🔀' : '🏢'} {job.workMode}
        </span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          💰 ৳{job.salary}/mo
        </span>
      </div>

      {/* SKILLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {job.requiredSkills?.slice(0, 5).map((skill, i) => (
          <span
            key={i}
            className="skill-tag"
            style={{
              background: job.matchedSkills?.includes(skill) ? 'var(--green-light)' : 'var(--accent-light)',
              color: job.matchedSkills?.includes(skill) ? 'var(--green)' : 'var(--accent)',
              border: `1px solid ${job.matchedSkills?.includes(skill) ? 'var(--green-border)' : 'var(--accent-border)'}`
            }}
          >
            {job.matchedSkills?.includes(skill) ? '✓ ' : ''}{skill}
          </span>
        ))}
        {job.requiredSkills?.length > 5 && (
          <span className="badge badge-gray">+{job.requiredSkills.length - 5} more</span>
        )}
      </div>

      {/* DIVIDER */}
      <div className="divider" style={{ margin: '12px 0' }} />

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || isSaved}
          className="btn-ghost tooltip"
          data-tip={isSaved ? 'Saved!' : 'Save job'}
          style={{
            color: isSaved ? 'var(--accent)' : 'var(--text-muted)',
            background: isSaved ? 'var(--accent-light)' : 'transparent'
          }}
        >
          {isSaved ? '🔖 Saved' : saving ? '...' : '🔖 Save'}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="btn-ghost tooltip"
          data-tip={copied ? 'Link copied!' : 'Share job'}
          style={{ color: copied ? 'var(--green)' : 'var(--text-muted)' }}
        >
          {copied ? '✅ Copied!' : '🔗 Share'}
        </button>
{/* Compare Button */}
<button
  onClick={(e) => { e.stopPropagation(); if(onCompare) onCompare(); }}
  className="btn-ghost tooltip"
  data-tip={isInCompare ? 'Remove from compare' : 'Add to compare'}
  style={{
    color: isInCompare ? 'var(--orange)' : 'var(--text-muted)',
    background: isInCompare ? 'var(--orange-light)' : 'transparent'
  }}
>
  {isInCompare ? '⚔️ Added' : '⚔️ Compare'}
</button>
        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Experience Badge */}
        <span className="badge badge-gray" style={{ fontSize: '11px' }}>
          {job.experience}
        </span>
{/* Apply Button */}
{job.locked ? (
  <button
    onClick={() => navigate(`/jobs/${job._id}`)}
    style={{
      padding: '8px 18px', borderRadius: '8px', border: 'none',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white', fontSize: '13px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
      display: 'flex', alignItems: 'center', gap: '4px'
    }}
  >
    👑 View & Upgrade
  </button>
) : (
  <button
    onClick={handleApply}
    className="btn-primary"
    style={{
      background: applied ? 'var(--green)' : 'var(--accent)',
      padding: '8px 18px', fontSize: '13px'
    }}
  >
    {applied ? '✅ Applied!' : 'Apply Now →'}
  </button>
)}
      </div>
    </div>
  );
};

export default JobCard;
