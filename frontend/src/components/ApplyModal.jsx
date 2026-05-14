import React, { useState, useRef } from 'react';
import API from '../api';

const ApplyModal = ({ job, userSkills, onClose, onSuccess }) => {
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  // Normalize helper
const normalizeSkill = (skill) => {
  if (!skill) return '';

  // object support
  if (typeof skill === 'object') {
    skill = skill.name || '';
  }

  return skill
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, '')
    .trim();
};

// Calculate match
const jobSkills = Array.isArray(job.requiredSkills)
  ? job.requiredSkills
  : [];

const normalizedUserSkills = (userSkills || []).map(normalizeSkill);

const matchedSkills = jobSkills.filter(skill =>
  normalizedUserSkills.includes(normalizeSkill(skill))
);

const unmatched = jobSkills.filter(skill =>
  !normalizedUserSkills.includes(normalizeSkill(skill))
);

const matchPct = jobSkills.length > 0
  ? Math.round((matchedSkills.length / jobSkills.length) * 100)
  : 0;

const canApply = matchedSkills.length > 0;

console.log('USER SKILLS:', userSkills);
console.log('NORMALIZED USER:', normalizedUserSkills);
console.log('JOB SKILLS:', jobSkills);
console.log('MATCHED:', matchedSkills);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setError('Only PDF or Word (.doc, .docx) files allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }
    setError('');
    setCvFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

 const handleSubmit = async () => {
  // Deadline check
  if (job.deadline && new Date(job.deadline) < new Date()) {
    setError('This job application deadline has passed.');
    return;
  }
  if (!job.isActive) {
    setError('This job is no longer accepting applications.');
    return;
  }
  if (!canApply) {
    setError('You need at least 1 matching skill to apply.');
    return;
  }
  if (!cvFile) {
    setError('Please upload your CV before applying.');
    return;
  }
  setApplying(true);
  setError('');
  try {
    const formData = new FormData();
    formData.append('jobId', job._id);
    formData.append('cv', cvFile);
    await API.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    onSuccess();
  } catch (err) {
    setError(err.response?.data?.message || 'Application failed. Try again.');
  }
  setApplying(false);
};

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: '16px', width: '100%',
        maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Apply for {job.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{job.company}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-muted)' }}>×</button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Skill Match Section */}
          <div style={{
            padding: '16px', borderRadius: '10px', marginBottom: '20px',
            background: canApply ? 'var(--green-light)' : '#fef2f2',
            border: `1px solid ${canApply ? 'var(--green-border)' : '#fecaca'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: canApply ? 'var(--green)' : '#dc2626' }}>
                {canApply ? '✅ Skill Match' : '❌ Insufficient Skills'}
              </span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: canApply ? 'var(--green)' : '#dc2626' }}>
                {matchPct}%
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ height: '100%', width: `${matchPct}%`, background: canApply ? 'var(--green)' : '#dc2626', borderRadius: '3px' }} />
            </div>

            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              <strong>Matched skills ({matchedSkills.length}):</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {matchedSkills.length > 0 ? matchedSkills.map((s, i) => (
                  <span key={i} style={{ padding: '2px 8px', background: 'var(--green)', color: 'white', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>
                    ✓ {s}
                  </span>
                )) : <span style={{ color: '#dc2626', fontSize: '12px' }}>No matching skills</span>}
              </div>
            </div>

            {unmatched.length > 0 && (
              <div style={{ fontSize: '12px' }}>
                <strong>Missing skills ({unmatched.length}):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {unmatched.map((s, i) => (
                    <span key={i} style={{ padding: '2px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '100px', fontSize: '11px' }}>
                      ✗ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!canApply && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>
                ⚠️ You need at least 1 matching skill to apply. Update your profile first.
              </div>
            )}
          </div>

          {/* CV Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              📄 Upload Your CV *
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--accent)' : cvFile ? 'var(--green)' : 'var(--border2)'}`,
                borderRadius: '10px', padding: '24px', textAlign: 'center',
                cursor: 'pointer', background: dragOver ? 'var(--accent-light)' : cvFile ? 'var(--green-light)' : 'var(--bg-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="file"
                ref={fileRef}
                onChange={(e) => handleFile(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              {cvFile ? (
                <>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--green)' }}>{cvFile.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {(cvFile.size / 1024).toFixed(0)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Drag & drop your CV here, or click to browse
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    PDF or Word (.doc, .docx) — max 5MB
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={applying || !canApply}
              className="btn-primary"
              style={{
                flex: 2, padding: '12px', justifyContent: 'center',
                opacity: (!canApply || applying) ? 0.6 : 1,
                cursor: !canApply ? 'not-allowed' : 'pointer'
              }}
            >
              {applying ? '⏳ Submitting...' : canApply ? '🚀 Submit Application' : '❌ Skills Required'}
            </button>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
            Your CV will be reviewed by the admin. Status updates will appear in your Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;