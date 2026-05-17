import React from 'react';
import { useAuth } from '../context/AuthContext';

const CompareModal = ({ jobs, onClose, onRemove }) => {
   const { user } = useAuth();
  if (!jobs || jobs.length === 0) return null;

  const [job1, job2] = jobs;
 

  // ── Detailed Scoring Logic ──────────────────────────────────────
  const scoreJob = (job) => {
    if (!job) return { total: 0, breakdown: {} };

    const userSkills = (user?.skills || []).map(s => s.toLowerCase());
    const jobSkills  = (job.requiredSkills || []).map(s => s.toLowerCase());

    // 1. Skill match — max 40 points
    const matched = jobSkills.filter(s => userSkills.includes(s));
    const skillScore = jobSkills.length > 0
      ? Math.round((matched.length / jobSkills.length) * 40)
      : 0;

    // 2. Work preference — max 20 points
    const workPref = user?.workPreference || 'any';
    let workScore = 0;
    if (workPref === 'any')                          workScore = 15; // any = flexible, decent
    else if (workPref === job.workMode)              workScore = 20; // perfect match
    else if (workPref === 'hybrid')                  workScore = 10; // hybrid = semi-match
    else                                             workScore = 0;

    // 3. Experience match — max 20 points
    const expOrder = { fresher: 1, junior: 2, mid: 3, senior: 4 };
    const userExp  = expOrder[user?.experience] || 1;
    const jobExp   = expOrder[job.experience]   || 1;
    const expDiff  = Math.abs(userExp - jobExp);
    let expScore   = 0;
    if (expDiff === 0) expScore = 20;
    else if (expDiff === 1) expScore = 12;
    else if (expDiff === 2) expScore = 5;
    else expScore = 0;

    // 4. Salary — max 10 points (relative, set after both scored)
    const salaryRaw = parseInt(String(job.salary || '0').replace(/[^0-9]/g, '')) || 0;

    // 5. Job type preference — max 10 points
    // full-time = most stable = highest, internship = lowest
    const typeScore = {
      'full-time': 10,
      'contract': 7,
      'part-time': 5,
      'internship': 3,
    }[job.type] || 5;

    const total = skillScore + workScore + expScore + typeScore; // salary added later

    return {
      total,
      salaryRaw,
      breakdown: {
        skill:  { score: skillScore,  max: 40, matched: matched.length, total: jobSkills.length },
        work:   { score: workScore,   max: 20, userPref: workPref, jobMode: job.workMode },
        exp:    { score: expScore,    max: 20, userExp: user?.experience, jobExp: job.experience },
        type:   { score: typeScore,   max: 10, jobType: job.type },
        salary: { score: 0,           max: 10, raw: salaryRaw }, // filled below
      }
    };
  };

  const s1 = scoreJob(job1);
  const s2 = scoreJob(job2);

  // Salary comparison — higher salary gets 10 pts, lower gets proportional
  const maxSalary = Math.max(s1.salaryRaw, s2.salaryRaw);
  if (maxSalary > 0) {
    s1.breakdown.salary.score = s1.salaryRaw === maxSalary ? 10 : Math.round((s1.salaryRaw / maxSalary) * 10);
    s2.breakdown.salary.score = s2.salaryRaw === maxSalary ? 10 : Math.round((s2.salaryRaw / maxSalary) * 10);
  }
  s1.total += s1.breakdown.salary.score;
  s2.total += s2.breakdown.salary.score;

  const winner = s1.total >= s2.total ? job1 : job2;
  const winnerScore = s1.total >= s2.total ? s1 : s2;
  const loserScore  = s1.total >= s2.total ? s2 : s1;

  // Build reasons
  const buildReasons = (ws, ls, job) => {
    const reasons = [];
    if (ws.breakdown.skill.score > ls.breakdown.skill.score)
      reasons.push(`Better skill match (${ws.breakdown.skill.matched}/${ws.breakdown.skill.total} skills)`);
    if (ws.breakdown.salary.raw > ls.breakdown.salary.raw)
      reasons.push(`Higher salary (৳${ws.breakdown.salary.raw.toLocaleString()}/mo)`);
    if (ws.breakdown.work.score > ls.breakdown.work.score)
      reasons.push(`Better work mode fit (${job.workMode})`);
    if (ws.breakdown.exp.score > ls.breakdown.exp.score)
      reasons.push(`Closer experience level (${job.experience})`);
    if (ws.breakdown.type.score > ls.breakdown.type.score)
      reasons.push(`More stable job type (${job.type})`);
    return reasons.length > 0 ? reasons : ['Overall better profile fit'];
  };

  const winnerReasons = buildReasons(winnerScore, loserScore, winner);

  // ── Render helpers ──────────────────────────────────────────────
  const ScoreBar = ({ label, score, max, color }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
        <span>{label}</span>
        <span style={{ fontWeight: '700', color }}>{score}/{max}</span>
      </div>
      <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(score / max) * 100}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
      </div>
    </div>
  );

  const rows = [
    { label: '🏢 Company',   key: 'company' },
    { label: '📍 Location',  key: 'location' },
    {
      label: '💰 Salary', key: 'salary',
      format: v => `৳${parseInt(String(v || '0').replace(/[^0-9]/g,'')).toLocaleString()}/Mo`,
      better: (a, b) => (parseInt(String(a?.salary||'0').replace(/[^0-9]/g,''))||0) > (parseInt(String(b?.salary||'0').replace(/[^0-9]/g,''))||0),
    },
    { label: '💼 Type',      key: 'type' },
    { label: '🌍 Work Mode', key: 'workMode' },
    { label: '🎯 Experience',key: 'experience' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      zIndex: 300, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '32px',
        maxWidth: '820px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative'
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          borderRadius: '50%', width: '32px', height: '32px',
          cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>✕</button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Compare</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>⚔️ Side-by-Side Comparison</h2>
        </div>

        {/* Job Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div />
          {[job1, job2].map((job, i) => {
            const sc = i === 0 ? s1 : s2;
            const isWinner = job === winner;
            return (
              <div key={i} className="card" style={{
                padding: '16px', textAlign: 'center',
                borderColor: isWinner ? 'var(--green-border)' : 'var(--border)',
                background: isWinner ? 'var(--green-light)' : 'var(--surface2)',
                position: 'relative'
              }}>
                {isWinner && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--green)', color: 'white',
                    fontSize: '10px', fontWeight: '700', padding: '2px 10px',
                    borderRadius: '100px', whiteSpace: 'nowrap'
                  }}>⭐ Better Match</div>
                )}
                <div style={{ fontSize: '20px', fontWeight: '800', color: isWinner ? 'var(--green)' : 'var(--accent)', marginBottom: '4px' }}>
                  {job?.company?.charAt(0) || '?'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{job?.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{job?.company}</div>

                {/* Score breakdown bars */}
                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                  <ScoreBar label="Skills"      score={sc.breakdown.skill.score}  max={40} color={isWinner ? 'var(--green)' : 'var(--accent)'} />
                  <ScoreBar label="Work Mode"   score={sc.breakdown.work.score}   max={20} color={isWinner ? 'var(--green)' : 'var(--accent)'} />
                  <ScoreBar label="Experience"  score={sc.breakdown.exp.score}    max={20} color={isWinner ? 'var(--green)' : 'var(--accent)'} />
                  <ScoreBar label="Salary"      score={sc.breakdown.salary.score} max={10} color={isWinner ? 'var(--green)' : 'var(--accent)'} />
                  <ScoreBar label="Job Type"    score={sc.breakdown.type.score}   max={10} color={isWinner ? 'var(--green)' : 'var(--accent)'} />
                </div>

                <div style={{
                  padding: '6px 12px', borderRadius: '100px',
                  background: isWinner ? 'var(--green)' : 'var(--accent-light)',
                  color: isWinner ? 'white' : 'var(--accent)',
                  fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'inline-block'
                }}>
                  {sc.total}/100 pts
                </div>

                <button onClick={() => onRemove(i)} style={{
                  display: 'block', width: '100%', padding: '5px',
                  borderRadius: '6px', border: '1px solid #fecaca',
                  background: '#fef2f2', color: '#dc2626',
                  fontSize: '11px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}>Remove</button>
              </div>
            );
          })}
        </div>

        {/* Comparison Rows */}
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 1fr',
            gap: '12px', marginBottom: '8px', alignItems: 'center'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{row.label}</div>
            {[job1, job2].map((job, j) => {
              const val = job?.[row.key];
              const formatted = val ? (row.format ? row.format(val) : val) : '—';
              const isBetter = row.better
                ? (j === 0 ? row.better(job1, job2) : row.better(job2, job1))
                : false;
              return (
                <div key={j} style={{
                  padding: '12px 16px', borderRadius: '8px',
                  background: isBetter ? 'var(--green-light)' : 'var(--bg-secondary)',
                  border: `1px solid ${isBetter ? 'var(--green-border)' : 'var(--border)'}`,
                  fontSize: '13px', fontWeight: '500',
                  color: isBetter ? 'var(--green)' : 'var(--text-primary)',
                  textTransform: 'capitalize'
                }}>
                  {isBetter ? '✓ ' : ''}{formatted}
                </div>
              );
            })}
          </div>
        ))}

        {/* Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', paddingTop: '8px' }}>🔧 Required Skills</div>
          {[job1, job2].map((job, i) => {
            const userSkills = (user?.skills || []).map(s => s.toLowerCase());
            return (
              <div key={i} style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {job?.requiredSkills?.map((skill, j) => {
                    const matched = userSkills.includes(skill.toLowerCase());
                    return (
                      <span key={j} style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                        background: matched ? 'var(--green-light)' : 'var(--bg-tertiary)',
                        color: matched ? 'var(--green)' : 'var(--text-muted)',
                        border: `1px solid ${matched ? 'var(--green-border)' : 'var(--border)'}`,
                        fontWeight: matched ? '700' : '400'
                      }}>
                        {matched ? '✓ ' : ''}{skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verdict */}
        {job1 && job2 && (
          <div style={{
            marginTop: '20px', padding: '20px 24px',
            background: 'var(--green-light)', border: '1px solid var(--green-border)',
            borderRadius: '14px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'center' }}>Our Recommendation</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--green)', textAlign: 'center', marginBottom: '12px' }}>
              🏆 {winner?.title} is a better match for you!
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>Why:</div>
            {winnerReasons.map((r, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                ✅ {r}
              </div>
            ))}
            <div style={{
              marginTop: '12px', padding: '8px 14px',
              background: 'rgba(255,255,255,0.5)', borderRadius: '8px',
              fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center'
            }}>
              Score: <strong style={{ color: 'var(--green)' }}>{Math.max(s1.total, s2.total)}/100</strong> vs <strong>{Math.min(s1.total, s2.total)}/100</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareModal;