import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [startups, setStartups] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '', company: '', description: '',
    requiredSkills: '', location: '', salary: '',
    type: 'full-time', workMode: 'remote', experience: 'fresher'
  });

  const [startupForm, setStartupForm] = useState({
    title: '', description: '', category: '',
    requiredSkills: '', budget: 'zero', difficulty: 'beginner',
    estimatedCost: '', potentialRevenue: '', timeToLaunch: '',
    viabilityScore: 80, roadmap: ''
  });

 const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, startupsRes, usersRes, statsRes,appRes] = await Promise.all([
        API.get('/jobs'),
        API.get('/startups'),
        API.get('/admin/users'),
        API.get('/admin/stats'),
        API.get('/applications/all')
      ]);
      setJobs(jobsRes.data);
      setStartups(startupsRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/jobs', {
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setSuccess('Job posted successfully!');
      setShowJobForm(false);
      setJobForm({ title:'', company:'', description:'', requiredSkills:'', location:'', salary:'', type:'full-time', workMode:'remote', experience:'fresher' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleStartupSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/startups', {
        ...startupForm,
        requiredSkills: startupForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        roadmap: startupForm.roadmap.split('\n').filter(Boolean),
        viabilityScore: Number(startupForm.viabilityScore)
      });
      setSuccess('Startup idea posted successfully!');
      setShowStartupForm(false);
      setStartupForm({ title:'', description:'', category:'', requiredSkills:'', budget:'zero', difficulty:'beginner', estimatedCost:'', potentialRevenue:'', timeToLaunch:'', viabilityScore:80, roadmap:'' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      setSuccess('Job deleted!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) { console.error(err); }
  };

  const handleDeleteStartup = async (id) => {
    if (!window.confirm('Delete this startup idea?')) return;
    try {
      await API.delete(`/startups/${id}`);
      setStartups(prev => prev.filter(s => s._id !== id));
      setSuccess('Startup idea deleted!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) { console.error(err); }
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface)', border: '1px solid var(--border2)',
    color: 'var(--text-primary)', borderRadius: '8px', padding: '10px 14px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', outline: 'none',
    marginBottom: '12px', transition: 'all 0.2s'
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)',
    display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              Admin Panel
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
              🛡️ Content Management
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowJobForm(true); setShowStartupForm(false); }} className="btn-primary" style={{ fontSize: '13px' }}>
              + Post Job
            </button>
            <button onClick={() => { setShowStartupForm(true); setShowJobForm(false); }} className="btn-secondary" style={{ fontSize: '13px' }}>
              + Add Startup Idea
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
            ✅ {success}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { num: stats.totalUsers, label: 'Total Users', icon: '👥', color: 'var(--accent)' },
  { num: stats.totalJobs, label: 'Total Jobs', icon: '💼', color: 'var(--green)' },
  { num: stats.totalStartups, label: 'Startup Ideas', icon: '💡', color: 'var(--orange)' },
  { num: stats.totalApplications || 0, label: 'Applications', icon: '📋', color: '#9333ea' }
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '28px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* POST JOB FORM */}
        {showJobForm && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💼 Post New Job</h2>
              <button onClick={() => setShowJobForm(false)} className="btn-ghost">✕ Cancel</button>
            </div>
            <form onSubmit={handleJobSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Job Title *</label>
                  <input style={inputStyle} placeholder="Full Stack Developer" required value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Company *</label>
                  <input style={inputStyle} placeholder="TechNova BD" required value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} placeholder="Dhaka, Bangladesh" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Salary (per month)</label>
                  <input style={inputStyle} placeholder="60,000" value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Job Type</label>
                  <select style={inputStyle} value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Work Mode</label>
                  <select style={inputStyle} value={jobForm.workMode} onChange={e => setJobForm({ ...jobForm, workMode: e.target.value })}>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <select style={inputStyle} value={jobForm.experience} onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}>
                    <option value="fresher">Fresher</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Required Skills (comma separated) *</label>
                  <input style={inputStyle} placeholder="React, Node.js, MongoDB" required value={jobForm.requiredSkills} onChange={e => setJobForm({ ...jobForm, requiredSkills: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Job description..." required value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: '8px' }}>
                {submitting ? 'Posting...' : '✅ Post Job'}
              </button>
            </form>
          </div>
        )}

        {/* POST STARTUP FORM */}
        {showStartupForm && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💡 Add Startup Idea</h2>
              <button onClick={() => setShowStartupForm(false)} className="btn-ghost">✕ Cancel</button>
            </div>
            <form onSubmit={handleStartupSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} placeholder="Online Tutoring Platform" required value={startupForm.title} onChange={e => setStartupForm({ ...startupForm, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <input style={inputStyle} placeholder="education / tech / health" required value={startupForm.category} onChange={e => setStartupForm({ ...startupForm, category: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Budget</label>
                  <select style={inputStyle} value={startupForm.budget} onChange={e => setStartupForm({ ...startupForm, budget: e.target.value })}>
                    <option value="zero">Zero ($0)</option>
                    <option value="low">Low ($100-$1000)</option>
                    <option value="medium">Medium ($1k-$10k)</option>
                    <option value="high">High ($10k+)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select style={inputStyle} value={startupForm.difficulty} onChange={e => setStartupForm({ ...startupForm, difficulty: e.target.value })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Estimated Cost</label>
                  <input style={inputStyle} placeholder="$0" value={startupForm.estimatedCost} onChange={e => setStartupForm({ ...startupForm, estimatedCost: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Time to Launch</label>
                  <input style={inputStyle} placeholder="4 weeks" value={startupForm.timeToLaunch} onChange={e => setStartupForm({ ...startupForm, timeToLaunch: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Potential Revenue</label>
                  <input style={inputStyle} placeholder="High" value={startupForm.potentialRevenue} onChange={e => setStartupForm({ ...startupForm, potentialRevenue: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Viability Score (0-100)</label>
                  <input style={inputStyle} type="number" min="0" max="100" value={startupForm.viabilityScore} onChange={e => setStartupForm({ ...startupForm, viabilityScore: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Required Skills (comma separated)</label>
                  <input style={inputStyle} placeholder="React, Node.js, MongoDB" value={startupForm.requiredSkills} onChange={e => setStartupForm({ ...startupForm, requiredSkills: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="What is this startup idea about?" required value={startupForm.description} onChange={e => setStartupForm({ ...startupForm, description: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Roadmap Steps (one per line)</label>
                <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder={"Step 1: Define your niche\nStep 2: Build landing page\nStep 3: Get first users"} value={startupForm.roadmap} onChange={e => setStartupForm({ ...startupForm, roadmap: e.target.value })} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: '8px' }}>
                {submitting ? 'Adding...' : '✅ Add Startup Idea'}
              </button>
            </form>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', width: 'fit-content' }}>
          {['jobs', 'startups', 'users', 'applications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'jobs' ? '💼' : tab === 'startups' ? '💡' : '👥'} {tab}
            </button>
          ))}
        </div>

        {/* JOBS TABLE */}
        {activeTab === 'jobs' && (
          <div className="card" style={{ overflow: 'hidden' }}>
<div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  {['Job Title', 'Company', 'Work Mode', 'Experience', 'Salary', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{job.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{job.company}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-blue">{job.workMode}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{job.experience}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: 'var(--green)' }}>৳{job.salary}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDeleteJob(job._id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '12px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '500' }}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
          </div>
        )}

        {/* STARTUPS TABLE */}
        {activeTab === 'startups' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Difficulty', 'Budget', 'Viability', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {startups.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.category}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${s.difficulty === 'beginner' ? 'badge-green' : s.difficulty === 'intermediate' ? 'badge-orange' : 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                        {s.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.budget}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>{s.viabilityScore}/100</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDeleteStartup(s._id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '12px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '500' }}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* USERS TABLE */}
        {activeTab === 'users' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Role', 'Skills', 'Profile %', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-orange' : 'badge-blue'}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.skills?.length || 0} skills</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                          <div style={{ height: '100%', background: u.profileComplete >= 80 ? 'var(--green)' : 'var(--accent)', borderRadius: '3px', width: `${u.profileComplete || 0}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{u.profileComplete || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
        {/* APPLICATIONS TABLE */}
{activeTab === 'applications' && (
  <div className="card" style={{ overflow:'hidden' }}>
    <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h3 style={{ fontSize:'16px', fontWeight:'700', color:'var(--text-primary)' }}>
        📋 All Job Applications
      </h3>
      <span className="badge badge-blue">{applications.length} total</span>
    </div>
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>
            {['Applicant', 'Email', 'Job', 'Company', 'Experience', 'Skills', 'Status', 'Applied', 'Action'].map(h => (
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ padding:'40px', textAlign:'center', color:'var(--text-muted)', fontSize:'14px' }}>
                No applications yet
              </td>
            </tr>
          ) : (
            applications.map((app, i) => (
              <tr key={app._id} style={{ borderBottom:'1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--accent)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>
                      {app.applicantName?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)', whiteSpace:'nowrap' }}>{app.applicantName}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{app.applicantEmail}</td>
                <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', whiteSpace:'nowrap' }}>{app.jobTitle}</td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{app.company}</td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text-secondary)', textTransform:'capitalize' }}>{app.experience}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', maxWidth:'160px' }}>
                    {app.skills?.slice(0, 3).map((s, j) => (
                      <span key={j} className="skill-tag" style={{ fontSize:'11px', padding:'2px 6px' }}>{s}</span>
                    ))}
                    {app.skills?.length > 3 && <span className="badge badge-gray">+{app.skills.length - 3}</span>}
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{
                    padding:'3px 10px', borderRadius:'100px',
                    fontSize:'12px', fontWeight:'600',
                    background: app.status === 'shortlisted' ? 'var(--green-light)' :
                                app.status === 'rejected' ? '#fef2f2' :
                                app.status === 'viewed' ? 'var(--accent-light)' : 'var(--orange-light)',
                    color: app.status === 'shortlisted' ? 'var(--green)' :
                           app.status === 'rejected' ? '#dc2626' :
                           app.status === 'viewed' ? 'var(--accent)' : 'var(--orange)',
                    textTransform:'capitalize'
                  }}>
                    {app.status === 'pending' ? '🕐 Pending' :
                     app.status === 'viewed' ? '👁️ Viewed' :
                     app.status === 'shortlisted' ? '⭐ Shortlisted' : '❌ Rejected'}
                  </span>
                </td>
                <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <select
                    value={app.status}
                    onChange={async (e) => {
                      try {
                        await API.put(`/applications/${app._id}/status`, { status: e.target.value });
                        setApplications(prev => prev.map(a =>
                          a._id === app._id ? { ...a, status: e.target.value } : a
                        ));
                        setSuccess(`Status updated to ${e.target.value}!`);
                        setTimeout(() => setSuccess(''), 2000);
                      } catch (err) { console.error(err); }
                    }}
                    style={{
                      padding:'5px 10px', borderRadius:'6px',
                      border:'1px solid var(--border2)',
                      background:'var(--surface)', color:'var(--text-primary)',
                      fontSize:'12px', cursor:'pointer',
                      fontFamily:'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="viewed">Viewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AdminPanel;