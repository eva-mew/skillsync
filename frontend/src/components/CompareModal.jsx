import React from 'react';

const CompareModal = ({ jobs, onClose, onRemove }) => {
  if (!jobs || jobs.length === 0) return null;

  const [job1, job2] = jobs;

  const rows = [
    { label: '🏢 Company', key: 'company' },
    { label: '📍 Location', key: 'location' },
    { label: '💰 Salary', key: 'salary', format: v => `৳${v}/mo` },
    { label: '💼 Type', key: 'type' },
    { label: '🌍 Work Mode', key: 'workMode' },
    { label: '🎯 Experience', key: 'experience' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 300,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px', padding: '32px',
          maxWidth: '780px', width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
            borderRadius: '50%', width: '32px', height: '32px',
            cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >✕</button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            Compare
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
            ⚔️ Side-by-Side Comparison
          </h2>
        </div>

        {/* Job Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '12px', marginBottom: '8px' }}>
          <div />
          {[job1, job2].map((job, i) => (
            <div key={i} className="card" style={{
              padding: '16px', textAlign: 'center',
              borderColor: i === 0 ? 'var(--accent-border)' : 'var(--border)',
              background: i === 0 ? 'var(--accent-light)' : 'var(--surface2)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent)', marginBottom: '4px' }}>
                {job?.company?.charAt(0) || '?'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {job?.title || 'Select a job'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {job?.company || ''}
              </div>
              {job && (
                <>
                  {job.matchScore !== undefined && (
                    <div style={{
                      display: 'inline-block', padding: '3px 10px',
                      borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                      background: job.matchScore >= 80 ? 'var(--green-light)' : 'var(--accent-light)',
                      color: job.matchScore >= 80 ? 'var(--green)' : 'var(--accent)',
                      border: `1px solid ${job.matchScore >= 80 ? 'var(--green-border)' : 'var(--accent-border)'}`,
                      marginBottom: '8px'
                    }}>
                      {job.matchScore}% Match
                    </div>
                  )}
                  <button
                    onClick={() => onRemove(i)}
                    style={{
                      display: 'block', width: '100%', padding: '5px',
                      borderRadius: '6px', border: '1px solid #fecaca',
                      background: '#fef2f2', color: '#dc2626',
                      fontSize: '11px', cursor: 'pointer',
                      fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '160px 1fr 1fr',
              gap: '12px', marginBottom: '8px', alignItems: 'center'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {row.label}
            </div>
            {[job1, job2].map((job, j) => {
              const val = job?.[row.key];
              const formatted = val ? (row.format ? row.format(val) : val) : '—';
              const isBetter = row.key === 'salary' && job1 && job2 &&
                parseInt(job?.salary?.replace(/,/g, '') || 0) ===
                Math.max(
                  parseInt(job1?.salary?.replace(/,/g, '') || 0),
                  parseInt(job2?.salary?.replace(/,/g, '') || 0)
                );
              return (
                <div
                  key={j}
                  style={{
                    padding: '12px 16px', borderRadius: '8px',
                    background: isBetter ? 'var(--green-light)' : 'var(--bg-secondary)',
                    border: `1px solid ${isBetter ? 'var(--green-border)' : 'var(--border)'}`,
                    fontSize: '13px', fontWeight: '500',
                    color: isBetter ? 'var(--green)' : 'var(--text-primary)',
                    textTransform: 'capitalize'
                  }}
                >
                  {isBetter ? '✓ ' : ''}{formatted}
                </div>
              );
            })}
          </div>
        ))}

        {/* Skills Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', paddingTop: '8px' }}>
            🔧 Required Skills
          </div>
          {[job1, job2].map((job, i) => (
            <div key={i} style={{
              padding: '12px 16px', borderRadius: '8px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {job?.requiredSkills?.map((skill, j) => (
                  <span key={j} className="skill-tag" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {skill}
                  </span>
                )) || <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Match Score Comparison */}
        {job1?.matchScore !== undefined && job2?.matchScore !== undefined && (
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', paddingTop: '8px' }}>
              🎯 Match Score
            </div>
            {[job1, job2].map((job, i) => {
              const isHigher = job?.matchScore === Math.max(job1?.matchScore || 0, job2?.matchScore || 0);
              return (
                <div key={i} style={{
                  padding: '12px 16px', borderRadius: '8px',
                  background: isHigher ? 'var(--green-light)' : 'var(--bg-secondary)',
                  border: `1px solid ${isHigher ? 'var(--green-border)' : 'var(--border)'}`,
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: isHigher ? 'var(--green)' : 'var(--accent)', marginBottom: '6px' }}>
                    {isHigher ? '🏆 ' : ''}{job?.matchScore}%
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: isHigher ? 'var(--green)' : 'var(--accent)', borderRadius: '3px', width: `${job?.matchScore}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Verdict */}
        {job1 && job2 && job1.matchScore !== undefined && job2.matchScore !== undefined && (
          <div style={{
            marginTop: '20px', padding: '16px 20px',
            background: 'var(--accent-light)', border: '1px solid var(--accent-border)',
            borderRadius: '12px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Our Recommendation</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>
              🏆 {job1.matchScore >= job2.matchScore ? job1.title : job2.title} is a better match for you!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareModal;