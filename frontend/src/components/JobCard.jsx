import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import ApplyModal from './ApplyModal';
import { useAuth } from '../context/AuthContext';

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

const JobCard = ({
  job,
  onSave,
  saved = false,
  onCompare,
  isInCompare = false,
  profileSkills = []
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userSkills = profileSkills.length > 0 ? profileSkills : (user?.skills || []);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const firstLetter = job.company?.charAt(0).toUpperCase() || 'C';
  const logoColor = logoColors[firstLetter] || '#2563eb';

  // Premium user check
  const isPremiumUser = user?.isPremium;
  const isTopApplicant = isPremiumUser && job.matchScore >= 80;

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

  return (
    <div className="card fade-in" style={{ padding: '20px', marginBottom: '12px' }}>

      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>

        {/* Company Logo + Info */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div
            className="company-logo"
            onClick={() => navigate(`/jobs/${job._id}`)}
            style={{ background: `${logoColor}15`, color: logoColor, border: `1.5px solid ${logoColor}30`, fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}
          >
            {firstLetter}
          </div>
          <div>
            <h3
              onClick={() => navigate(`/jobs/${job._id}`)}
              style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px 0', lineHeight: '1.3', cursor: 'pointer' }}
            >
              {job.title}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {job.company}
            </div>
          </div>
        </div>

        {/* Right side badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          {/* Match Score */}
          {job.matchScore !== undefined && (
            <div className={`match-score ${getMatchClass(job.matchScore)}`}>
              {getMatchLabel(job.matchScore)} · {job.matchScore}%
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Premium Badge */}
            {job.isPremium && (
              <span style={{
                padding: '3px 9px', borderRadius: '100px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white', fontSize: '11px', fontWeight: '700'
              }}>
                👑 Premium
              </span>
            )}

            {/* TOP APPLICANT badge — only for premium users with 80%+ match */}
            {isTopApplicant && (
              <span style={{
                padding: '3px 9px', borderRadius: '100px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', fontSize: '11px', fontWeight: '700'
              }}>
                ⚡ Top Applicant
              </span>
            )}
          </div>
        </div>
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

        {job.deadline && (
          <>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{
              fontSize: '12px',
              color: new Date(job.deadline) < new Date() ? '#dc2626' : '#d97706',
              fontWeight: '600'
            }}>
              📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-BD')}
              {new Date(job.deadline) < new Date() && ' (Expired)'}
            </span>
          </>
        )}

        {!job.isActive && (
          <>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ padding: '2px 8px', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
              🔒 Closed
            </span>
          </>
        )}

        {/* PREMIUM ONLY — applicant count */}
        {isPremiumUser && job.applicationCount !== undefined && (
          <>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              👥 {job.applicationCount} applied
            </span>
          </>
        )}
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

      {/* PREMIUM INSIGHT BAR — only for premium users */}
      {isPremiumUser && job.applicationCount !== undefined && job.matchScore !== undefined && (
        <div style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--accent-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
            👑 Premium Insight
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {job.applicationCount === 0
              ? '🚀 Be the first to apply!'
              : job.applicationCount <= 5
              ? `🔥 Only ${job.applicationCount} applicants — apply fast!`
              : `👥 ${job.applicationCount} people applied`}
          </span>
          {isTopApplicant && (
            <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: '600' }}>
              ⚡ Your profile is among top candidates
            </span>
          )}
        </div>
      )}

      {/* DIVIDER */}
      <div className="divider" style={{ margin: '12px 0' }} />

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

        <button
          onClick={handleSave}
          disabled={saving || isSaved}
          className="btn-ghost tooltip"
          data-tip={isSaved ? 'Saved!' : 'Save job'}
          style={{ color: isSaved ? 'var(--accent)' : 'var(--text-muted)', background: isSaved ? 'var(--accent-light)' : 'transparent' }}
        >
          {isSaved ? '🔖 Saved' : saving ? '...' : '🔖 Save'}
        </button>

        <button
          onClick={handleShare}
          className="btn-ghost tooltip"
          data-tip={copied ? 'Link copied!' : 'Share job'}
          style={{ color: copied ? 'var(--green)' : 'var(--text-muted)' }}
        >
          {copied ? '✅ Copied!' : '🔗 Share'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); if (onCompare) onCompare(); }}
          className="btn-ghost tooltip"
          data-tip={isInCompare ? 'Remove from compare' : 'Add to compare'}
          style={{ color: isInCompare ? 'var(--orange)' : 'var(--text-muted)', background: isInCompare ? 'var(--orange-light)' : 'transparent' }}
        >
          {isInCompare ? '⚔️ Added' : '⚔️ Compare'}
        </button>

        <div style={{ flex: 1 }} />

        <span className="badge badge-gray" style={{ fontSize: '11px' }}>
          {job.experience}
        </span>

        {/* Apply Button */}
        {!job.isActive ? (
          <button disabled style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#e5e7eb', color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>
            🔒 Job Closed
          </button>
        ) : (job.isPremium && !user?.isPremium) ? (
          <button
            onClick={() => navigate('/premium')}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            👑 Unlock Premium
          </button>
        ) : applied ? (
          <button disabled className="btn-primary" style={{ background: 'var(--green)', padding: '8px 18px', fontSize: '13px', opacity: 0.9 }}>
            ✅ Applied!
          </button>
        ) : (
          <button onClick={() => setShowApplyModal(true)} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Apply Now →
          </button>
        )}

        {showApplyModal && (
          <ApplyModal
            job={job}
            userSkills={userSkills}
            onClose={() => setShowApplyModal(false)}
            onSuccess={() => { setApplied(true); setShowApplyModal(false); }}
          />
        )}
      </div>
    </div>
  );
};

export default JobCard;