import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [startups, setStartups] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [jobReport, setJobReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // Forms
  const [showJobForm, setShowJobForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingStartup, setEditingStartup] = useState(null);

  // Search
  const [jobSearch, setJobSearch] = useState('');
  const [startupSearch, setStartupSearch] = useState('');

  // Reply
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const emptyJob = { title: '', company: '', description: '', requiredSkills: '', location: 'Dhaka', salary: '', type: 'full-time', workMode: 'remote', experience: 'fresher', isPremium: false, companyDescription: '', companyWebsite: '', companySize: '' };
  const emptyStartup = { title: '', description: '', category: '', requiredSkills: '', budget: 'low', difficulty: 'beginner', estimatedCost: '', potentialRevenue: '', timeToLaunch: '', viabilityScore: 70, roadmap: '' };
  const [jobForm, setJobForm] = useState(emptyJob);
  const [startupForm, setStartupForm] = useState(emptyStartup);
  const [monthlyData, setMonthlyData] = useState([]);
const [filteredApps, setFilteredApps] = useState([]);
const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
const [dateSearched, setDateSearched] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/jobs');
    fetchData();
  }, []);

 const fetchData = async () => {
  setLoading(true);

  try {
    const statsR = await API.get('/admin/stats');
    console.log('stats', statsR.data);

    const jobsR = await API.get('/jobs');
    console.log('jobs', jobsR.data);

    const startupsR = await API.get('/startups');
    console.log('startups', startupsR.data);

    const usersR = await API.get('/admin/users');
    console.log('users', usersR.data);

    const appsR = await API.get('/applications/all');
    console.log('applications', appsR.data);

    const msgsR = await API.get('/contact/all');
    console.log('messages', msgsR.data);

    const newsR = await API.get('/contact/subscribers');
    console.log('newsletters', newsR.data);

    const jobRepR = await API.get('/admin/job-report');
    console.log('jobReport', jobRepR.data);

    const userRepR = await API.get('/admin/user-report');
    console.log('userReport', userRepR.data);

    setStats(statsR.data);
    setJobs(jobsR.data);
    setStartups(startupsR.data);
    setUsers(usersR.data);
    setApplications(appsR.data);
    setMessages(msgsR.data);
    setNewsletters(newsR.data);
    setJobReport(jobRepR.data);
    setUserReport(userRepR.data);

  } catch (err) {
    console.error('FETCH ERROR:', err.response || err);
  }

  try {
    const monthlyR = await API.get('/admin/monthly-applications');
    console.log('monthly', monthlyR.data);
    setMonthlyData(monthlyR.data);
  } catch (err) {
    console.error('Monthly error:', err.response?.data || err.message);
  }

  setLoading(false);
};

  // ── Job CRUD ──────────────────────────────────────────────────
  const handleJobSubmit = async () => {
    try {
      const data = { ...jobForm, requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) };
      if (editingJob) {
        await API.put(`/jobs/${editingJob._id}`, data);
      } else {
        await API.post('/jobs', data);
      }
      setShowJobForm(false); setEditingJob(null); setJobForm(emptyJob); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({ ...job, requiredSkills: job.requiredSkills?.join(', ') || '' });
    setShowJobForm(true);
    setActiveTab('jobs');
    window.scrollTo(0, 0);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await API.delete(`/jobs/${id}`); fetchData();
  };

  // ── Startup CRUD ──────────────────────────────────────────────
  const handleStartupSubmit = async () => {
    try {
      const data = {
        ...startupForm,
        requiredSkills: startupForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        roadmap: startupForm.roadmap.split('\n').map(s => s.trim()).filter(Boolean)
      };
      if (editingStartup) {
        await API.put(`/startups/${editingStartup._id}`, data);
      } else {
        await API.post('/startups', data);
      }
      setShowStartupForm(false); setEditingStartup(null); setStartupForm(emptyStartup); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleEditStartup = (startup) => {
    setEditingStartup(startup);
    setStartupForm({ ...startup, requiredSkills: startup.requiredSkills?.join(', ') || '', roadmap: startup.roadmap?.join('\n') || '' });
    setShowStartupForm(true);
    setActiveTab('startups');
    window.scrollTo(0, 0);
  };

  const handleDeleteStartup = async (id) => {
    if (!window.confirm('Delete this startup?')) return;
    await API.delete(`/startups/${id}`); fetchData();
  };

  // ── Application Status ────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/applications/${id}/status`, { status });
      fetchData();
    } catch (err) { alert('Failed to update status'); }
  };

  // ── Messages ─────────────────────────────────────────────────
  const handleReply = async (id) => {
    if (!replyText.trim()) return alert('Reply cannot be empty');
    try {
      await API.put(`/contact/${id}/reply`, { reply: replyText });
      setReplyText(''); setReplyingTo(null); fetchData();
    } catch (err) { alert('Failed to send reply'); }
  };

  const handleMarkRead = async (id) => {
    await API.put(`/contact/${id}/read`); fetchData();
  };

  const handleDeleteMsg = async (id) => {
    if (!window.confirm('Delete message?')) return;
    await API.delete(`/contact/${id}`); fetchData();
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Delete subscriber?')) return;
    await API.delete(`/contact/subscribers/${id}`); fetchData();
  };

  // ── CSV Downloads ─────────────────────────────────────────────
  const downloadCSV = (data, filename, headers, rowFn) => {
    const rows = [headers, ...data.map(rowFn)];
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const downloadApplicationsCSV = () => downloadCSV(
    applications, 'SkillSync_Applications',
    ['Applicant Name', 'Email', 'Job Title', 'Company', 'Experience', 'Skills', 'Status', 'Applied Date'],
    a => [a.applicantName, a.applicantEmail, a.jobTitle, a.company, a.experience, (a.skills || []).join(' | '), a.status, new Date(a.appliedAt).toLocaleDateString()]
  );

  const downloadUsersCSV = () => downloadCSV(
    users, 'SkillSync_Users',
    ['Name', 'Email', 'Role', 'Skills', 'Experience', 'Work Preference', 'Premium', 'Profile %', 'Joined'],
    u => [u.name, u.email, u.role, (u.skills || []).join(' | '), u.experience, u.workPreference, u.isPremium ? 'Yes' : 'No', u.profileComplete || 0, new Date(u.createdAt).toLocaleDateString()]
  );

  const downloadJobReportCSV = () => downloadCSV(
    jobReport, 'SkillSync_Job_Report',
    ['Job Title', 'Company', 'Premium', 'Total Applications', 'Posted Date'],
    j => [j.title, j.company, j.isPremium ? 'Yes' : 'No', j.totalApplications, new Date(j.createdAt).toLocaleDateString()]
  );

  // ── Styles ────────────────────────────────────────────────────
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans, sans-serif', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'jobs', label: '💼 Jobs' },
    { key: 'startups', label: '💡 Startups' },
    { key: 'users', label: '👥 Users' },
    { key: 'applications', label: '📋 Applications' },
    { key: 'reports', label: '📈 Reports' },
    { key: 'messages', label: `💬 Messages ${messages.filter(m => m.status === 'unread').length > 0 ? `(${messages.filter(m => m.status === 'unread').length})` : ''}` },
    { key: 'newsletters', label: '📨 Newsletter' },
  ];

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.company?.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j._id?.includes(jobSearch)
  );

  const filteredStartups = startups.filter(s =>
    s.title?.toLowerCase().includes(startupSearch.toLowerCase()) ||
    s.category?.toLowerCase().includes(startupSearch.toLowerCase()) ||
    s._id?.includes(startupSearch)
  );

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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>🛡️ Admin Panel</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage SkillSync platform content and users</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px', background: 'var(--surface)', padding: '8px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Plus Jakarta Sans, sans-serif',
              background: activeTab === t.key ? 'var(--accent)' : 'transparent',
              color: activeTab === t.key ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══ DASHBOARD TAB ══ */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { icon: '👥', label: 'Total Users', value: stats.totalUsers || 0, color: '#3b82f6' },
                { icon: '💼', label: 'Total Jobs', value: stats.totalJobs || 0, color: '#1a7a3a' },
                { icon: '💡', label: 'Startups', value: stats.totalStartups || 0, color: '#f59e0b' },
                { icon: '📋', label: 'Applications', value: stats.totalApplications || 0, color: '#8b5cf6' },
                { icon: '💬', label: 'Messages', value: messages.length, color: '#ef4444' },
                { icon: '📨', label: 'Subscribers', value: newsletters.length, color: '#06b6d4' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '14px' }}>
              {[
                { label: '💼 Post New Job', action: () => { setShowJobForm(true); setEditingJob(null); setJobForm(emptyJob); setActiveTab('jobs'); } },
                { label: '💡 Add Startup Idea', action: () => { setShowStartupForm(true); setEditingStartup(null); setStartupForm(emptyStartup); setActiveTab('startups'); } },
                { label: '📋 View Applications', action: () => setActiveTab('applications') },
                { label: '📈 View Reports', action: () => setActiveTab('reports') },
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} className="btn-primary" style={{ padding: '14px', fontSize: '14px', justifyContent: 'center' }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ JOBS TAB ══ */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💼 Jobs Management</h2>
              <button onClick={() => { setShowJobForm(!showJobForm); setEditingJob(null); setJobForm(emptyJob); }} className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                {showJobForm ? 'Cancel' : '+ Post New Job'}
              </button>
            </div>

            {/* Job Form */}
            {showJobForm && (
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  {editingJob ? '✏️ Edit Job' : '+ Post New Job'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '14px' }}>
                  {[
                    { label: 'Job Title', key: 'title', ph: 'Full Stack Developer' },
                    { label: 'Company', key: 'company', ph: 'Tech Company BD' },
                    { label: 'Location', key: 'location', ph: 'Dhaka, Bangladesh' },
                    { label: 'Salary (BDT/month)', key: 'salary', ph: '50000' },
                    { label: 'Company Website', key: 'companyWebsite', ph: 'https://company.com' },
                    { label: 'Company Size', key: 'companySize', ph: '50-200 employees' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input style={inputStyle} placeholder={f.ph} value={jobForm[f.key] || ''} onChange={e => setJobForm({ ...jobForm, [f.key]: e.target.value })} />
                    </div>
                  ))}

                  <div>
                    <label style={labelStyle}>Job Type</label>
                    <select style={inputStyle} value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
                      {['full-time', 'part-time', 'contract', 'internship'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Work Mode</label>
                    <select style={inputStyle} value={jobForm.workMode} onChange={e => setJobForm({ ...jobForm, workMode: e.target.value })}>
                      {['remote', 'onsite', 'hybrid'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Experience</label>
                    <select style={inputStyle} value={jobForm.experience} onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}>
                      {['fresher', 'junior', 'mid', 'senior'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Required Skills (comma separated)</label>
                    <input style={inputStyle} placeholder="React, Node.js, MongoDB" value={jobForm.requiredSkills} onChange={e => setJobForm({ ...jobForm, requiredSkills: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Job Description</label>
                    <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Job description..." value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Company Description</label>
                    <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="About the company..." value={jobForm.companyDescription} onChange={e => setJobForm({ ...jobForm, companyDescription: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={jobForm.isPremium || false} onChange={e => setJobForm({ ...jobForm, isPremium: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>👑 Mark as Premium Job</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={handleJobSubmit} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                    {editingJob ? '✅ Update Job' : '✅ Post Job'}
                  </button>
                  <button onClick={() => { setShowJobForm(false); setEditingJob(null); }} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '14px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: '16px' }}>
              <input style={{ ...inputStyle, maxWidth: '400px' }} placeholder="🔍 Search by title, company or job ID..." value={jobSearch} onChange={e => setJobSearch(e.target.value)} />
            </div>

            {/* Jobs Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Title', 'Company', 'Type', 'Mode', 'Exp', 'Premium', 'Applications', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, i) => {
                      const appCount = applications.filter(a => String(a.jobId) === String(job._id)).length;
                      return (
                        <tr key={job._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{job.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{job._id}</div>
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{job.company}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{job.type}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{job.workMode}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{job.experience}</td>
                          <td style={{ padding: '10px 14px' }}>
                            {job.isPremium ? <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '700' }}>👑 Yes</span>
                              : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No</span>}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: '100px', background: appCount > 0 ? 'var(--accent-light)' : 'var(--bg-secondary)', color: appCount > 0 ? 'var(--accent)' : 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
                              {appCount}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => handleEditJob(job)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--accent)', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                ✏️ Edit
                              </button>
                              <button onClick={() => handleDeleteJob(job._id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ STARTUPS TAB ══ */}
        {activeTab === 'startups' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💡 Startups Management</h2>
              <button onClick={() => { setShowStartupForm(!showStartupForm); setEditingStartup(null); setStartupForm(emptyStartup); }} className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                {showStartupForm ? 'Cancel' : '+ Add Startup'}
              </button>
            </div>

            {showStartupForm && (
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  {editingStartup ? '✏️ Edit Startup' : '+ Add Startup Idea'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '14px' }}>
                  {[
                    { label: 'Title', key: 'title', ph: 'EdTech Platform' },
                    { label: 'Category', key: 'category', ph: 'Education' },
                    { label: 'Estimated Cost', key: 'estimatedCost', ph: '$5,000' },
                    { label: 'Potential Revenue', key: 'potentialRevenue', ph: '$50,000/year' },
                    { label: 'Time to Launch', key: 'timeToLaunch', ph: '3-6 months' },
                    { label: 'Viability Score (0-100)', key: 'viabilityScore', ph: '75' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input style={inputStyle} placeholder={f.ph} value={startupForm[f.key] || ''} onChange={e => setStartupForm({ ...startupForm, [f.key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Budget</label>
                    <select style={inputStyle} value={startupForm.budget} onChange={e => setStartupForm({ ...startupForm, budget: e.target.value })}>
                      {['zero', 'low', 'medium', 'high'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Difficulty</label>
                    <select style={inputStyle} value={startupForm.difficulty} onChange={e => setStartupForm({ ...startupForm, difficulty: e.target.value })}>
                      {['beginner', 'intermediate', 'advanced'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Required Skills (comma separated)</label>
                    <input style={inputStyle} placeholder="React, Node.js, Firebase" value={startupForm.requiredSkills} onChange={e => setStartupForm({ ...startupForm, requiredSkills: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} placeholder="Startup description..." value={startupForm.description} onChange={e => setStartupForm({ ...startupForm, description: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Roadmap Steps (one per line)</label>
                    <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} placeholder={'Step 1: Market Research\nStep 2: Build MVP\nStep 3: Launch'} value={startupForm.roadmap} onChange={e => setStartupForm({ ...startupForm, roadmap: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={handleStartupSubmit} className="btn-primary" style={{ padding: '10px 24px' }}>
                    {editingStartup ? '✅ Update Startup' : '✅ Add Startup'}
                  </button>
                  <button onClick={() => { setShowStartupForm(false); setEditingStartup(null); }} className="btn-secondary" style={{ padding: '10px 18px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: '16px' }}>
              <input style={{ ...inputStyle, maxWidth: '400px' }} placeholder="🔍 Search by title, category or ID..." value={startupSearch} onChange={e => setStartupSearch(e.target.value)} />
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Title', 'Category', 'Budget', 'Difficulty', 'Viability', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStartups.map((s, i) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s._id}</div>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.category}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.budget}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.difficulty}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', minWidth: '50px' }}>
                              <div style={{ height: '100%', background: 'var(--accent)', borderRadius: '3px', width: `${s.viabilityScore}%` }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>{s.viabilityScore}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleEditStartup(s)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--accent)', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => handleDeleteStartup(s._id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ USERS TAB ══ */}
        {activeTab === 'users' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>👥 All Registered Users</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span className="badge badge-blue">{users.length} total</span>
                <button onClick={downloadUsersCSV} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>📥 Download CSV</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Name', 'Email', 'Role', 'Skills', 'Experience', 'Premium', 'Profile %', 'Apps', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const appCount = applications.filter(a => String(a.userId) === String(u._id)).length;
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-orange' : 'badge-blue'}`}>{u.role}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '140px' }}>
                            {(u.skills || []).slice(0, 2).map((s, j) => <span key={j} className="skill-tag" style={{ fontSize: '10px', padding: '2px 6px' }}>{s}</span>)}
                            {(u.skills || []).length > 2 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{u.skills.length - 2}</span>}
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{u.experience || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          {u.isPremium ? <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '700' }}>👑 Yes</span>
                            : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Free</span>}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ flex: 1, height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', minWidth: '40px' }}>
                              <div style={{ height: '100%', background: 'var(--accent)', borderRadius: '3px', width: `${u.profileComplete || 0}%` }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>{u.profileComplete || 0}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '100px', background: appCount > 0 ? 'var(--accent-light)' : 'var(--bg-secondary)', color: appCount > 0 ? 'var(--accent)' : 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
                            {appCount}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS TAB ══ */}
{activeTab === 'applications' && (
  <div>
    {success && (
      <div style={{ background:'var(--green-light)', border:'1px solid var(--green-border)', color:'var(--green)', padding:'10px 16px', borderRadius:'8px', marginBottom:'16px', fontWeight:'600' }}>
        ✅ {success}
      </div>
    )}
    <div className="card" style={{ overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ fontSize:'16px', fontWeight:'700', color:'var(--text-primary)' }}>📋 All Job Applications</h3>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <span className="badge badge-blue">{applications.length} total</span>
          <button onClick={downloadApplicationsCSV} className="btn-secondary" style={{ fontSize:'13px', padding:'7px 16px' }}>
            📥 Download CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>
              {['Applicant','Email','Job','Company','Match Score','Skills','CV','Status','Action'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'var(--text-muted)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan="9" style={{ padding:'40px', textAlign:'center', color:'var(--text-muted)' }}>No applications yet</td></tr>
            ) : applications.map((app, i) => (
              <tr key={app._id} style={{ borderBottom:'1px solid var(--border)', background: i%2===0 ? 'var(--surface)' : 'var(--surface2)' }}>

                {/* Applicant */}
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--accent)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>
                      {app.applicantName?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', whiteSpace:'nowrap' }}>{app.applicantName}</span>
                  </div>
                </td>

                <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{app.applicantEmail}</td>
                <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', whiteSpace:'nowrap' }}>{app.jobTitle}</td>
                <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{app.company}</td>

                {/* Match Score */}
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'50px', height:'6px', background:'var(--bg-tertiary)', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${app.matchScore || 0}%`, background: app.matchScore >= 70 ? 'var(--green)' : app.matchScore >= 40 ? 'var(--orange)' : '#dc2626', borderRadius:'3px' }} />
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:'700', color: app.matchScore >= 70 ? 'var(--green)' : app.matchScore >= 40 ? 'var(--orange)' : '#dc2626' }}>
                      {app.matchScore || 0}%
                    </span>
                  </div>
                </td>

                {/* Skills */}
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'3px', maxWidth:'150px' }}>
                    {app.skills?.slice(0,2).map((s,j) => (
                      <span key={j} className="skill-tag" style={{ fontSize:'10px', padding:'1px 5px' }}>{s}</span>
                    ))}
                    {app.skills?.length > 2 && <span className="badge badge-gray" style={{ fontSize:'10px' }}>+{app.skills.length-2}</span>}
                  </div>
                </td>

   {/* CV */}
<td style={{ padding:'12px 16px' }}>
  {app.cvFileName ? (
    <a
      href={`${process.env.REACT_APP_API_URL}/applications/cv/${app._id}`}
      target="_blank"
      rel="noreferrer"
      style={{
        padding:'5px 10px',
        background:'var(--accent-light)',
        color:'var(--accent)',
        border:'1px solid var(--accent-border)',
        borderRadius:'6px',
        fontSize:'12px',
        fontWeight:'600',
        textDecoration:'none',
        display:'inline-flex',
        alignItems:'center',
        gap:'4px',
        whiteSpace:'nowrap'
      }}
    >
      📄 View CV
    </a>
  ) : (
    <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>No CV</span>
  )}
</td>

                {/* Status badge */}
                <td style={{ padding:'12px 16px' }}>
                  <span style={{
                    padding:'3px 10px', borderRadius:'100px', fontSize:'11px', fontWeight:'600',
                    background: app.status === 'selected' ? '#1a7a3a' :
                                app.status === 'shortlisted' ? 'var(--green-light)' :
                                app.status === 'rejected' ? '#fef2f2' :
                                app.status === 'viewed' ? 'var(--accent-light)' : 'var(--orange-light)',
                    color: app.status === 'selected' ? 'white' :
                           app.status === 'shortlisted' ? 'var(--green)' :
                           app.status === 'rejected' ? '#dc2626' :
                           app.status === 'viewed' ? 'var(--accent)' : 'var(--orange)',
                  }}>
                    {app.status === 'pending' ? '🕐 Pending' :
                     app.status === 'viewed' ? '👁️ Viewed' :
                     app.status === 'shortlisted' ? '⭐ Shortlisted' :
                     app.status === 'selected' ? '🏆 Selected' : '❌ Rejected'}
                  </span>
                </td>

                {/* Status dropdown */}
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
                        setTimeout(() => setSuccess(''), 2500);
                      } catch (err) { console.error(err); }
                    }}
                    style={{
                      padding:'5px 8px', borderRadius:'6px', border:'1px solid var(--border2)',
                      background:'var(--surface)', color:'var(--text-primary)',
                      fontSize:'12px', cursor:'pointer', fontFamily:'inherit', minWidth:'110px'
                    }}
                  >
                    <option value="pending">🕐 Pending</option>
                    <option value="viewed">👁️ Viewed</option>
                    <option value="shortlisted">⭐ Shortlisted</option>
                    <option value="selected">🏆 Selected</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                  <button
  onClick={async () => {
    if (!window.confirm('Delete this application permanently?')) return;

    try {
      await API.delete(`/applications/${app._id}`);

      setApplications(prev =>
        prev.filter(a => a._id !== app._id)
      );

      setSuccess('Application deleted!');
      setTimeout(() => setSuccess(''), 2500);

    } catch (err) {
      console.error(err);
    }
  }}
  style={{
    padding:'5px 8px',
    background:'#fef2f2',
    color:'#dc2626',
    border:'1px solid #fecaca',
    borderRadius:'6px',
    cursor:'pointer',
    fontSize:'11px',
    marginLeft:'6px'
  }}
>
  🗑️
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

       {/* ══ REPORTS TAB ══ */}
{activeTab === 'reports' && (
  <div>
    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📈 Reports & Analytics</h2>

    {/* ── Monthly Bar Chart ─────────────────────────────────── */}
    <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
        📊 Monthly Application Trends
      </h3>

      {monthlyData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No application data yet</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          {/* Simple hand-rolled bar chart — no recharts dep needed for this one */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', minHeight: '160px', padding: '0 4px 0 4px' }}>
            {monthlyData.map((d, i) => {
              const maxTotal = Math.max(...monthlyData.map(x => x.total), 1);
              const barH = Math.max((d.total / maxTotal) * 130, 8);
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1', minWidth: '44px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{d.total}</span>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
                    <div style={{ height: `${Math.round((d.shortlisted / d.total) * barH) || 2}px`, background: '#22c55e', transition: 'height 0.5s' }} title={`Shortlisted: ${d.shortlisted}`} />
                    <div style={{ height: `${Math.round((d.pending / d.total) * barH) || 2}px`, background: '#f59e0b', transition: 'height 0.5s' }} title={`Pending: ${d.pending}`} />
                    <div style={{ height: `${Math.round((d.rejected / d.total) * barH) || 2}px`, background: '#ef4444', transition: 'height 0.5s' }} title={`Rejected: ${d.rejected}`} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
            {[['#22c55e', 'Shortlisted'], ['#f59e0b', 'Pending'], ['#ef4444', 'Rejected']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Summary Table */}
      {monthlyData.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                {['Month', 'Total', 'Pending', 'Shortlisted', 'Rejected'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{d.label}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '14px' }}>{d.total}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '100px', background: '#fef3c7', color: '#b45309', fontSize: '12px', fontWeight: '700' }}>{d.pending}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '100px', background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: '700' }}>{d.shortlisted}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '100px', background: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: '700' }}>{d.rejected}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => downloadCSV(
                monthlyData, 'SkillSync_Monthly_Report',
                ['Month', 'Total', 'Pending', 'Shortlisted', 'Rejected'],
                d => [d.label, d.total, d.pending, d.shortlisted, d.rejected]
              )}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '7px 16px' }}
            >📥 Download Monthly CSV</button>
          </div>
        </div>
      )}
    </div>

    {/* ── Date Range Filter ─────────────────────────────────── */}
    <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
        📅 Filter Applications by Date
      </h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            style={{ ...inputStyle, maxWidth: '180px' }}
            value={dateFilter.start}
            onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>End Date</label>
          <input
            type="date"
            style={{ ...inputStyle, maxWidth: '180px' }}
            value={dateFilter.end}
            onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
          />
        </div>
        <button
          onClick={async () => {
            try {
              const params = new URLSearchParams();
              if (dateFilter.start) params.append('start', dateFilter.start);
              if (dateFilter.end)   params.append('end', dateFilter.end);
              const r = await API.get(`/admin/applications-by-date?${params.toString()}`);
              setFilteredApps(r.data);
              setDateSearched(true);
            } catch (err) { alert('Failed to fetch'); }
          }}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '13px' }}
        >🔍 Search</button>
        {dateSearched && (
          <button
            onClick={() => { setFilteredApps([]); setDateFilter({ start: '', end: '' }); setDateSearched(false); }}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >✖ Clear</button>
        )}
      </div>

      {dateSearched && (
        <div style={{ marginTop: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Found <strong style={{ color: 'var(--accent)' }}>{filteredApps.length}</strong> application{filteredApps.length !== 1 ? 's' : ''}
              {dateFilter.start && ` from ${new Date(dateFilter.start).toLocaleDateString()}`}
              {dateFilter.end && ` to ${new Date(dateFilter.end).toLocaleDateString()}`}
            </span>
            {filteredApps.length > 0 && (
              <button
                onClick={() => downloadCSV(
                  filteredApps, `SkillSync_Apps_${dateFilter.start || 'all'}_to_${dateFilter.end || 'now'}`,
                  ['Applicant', 'Email', 'Job Title', 'Company', 'Status', 'Applied Date'],
                  a => [a.applicantName, a.applicantEmail, a.jobTitle, a.company, a.status, new Date(a.appliedAt).toLocaleDateString()]
                )}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >📥 Download CSV</button>
            )}
          </div>

          {filteredApps.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              No applications found for this date range.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Applicant', 'Email', 'Job Title', 'Company', 'Status', 'Applied Date'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app, i) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{app.applicantName}</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{app.applicantEmail}</td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-primary)' }}>{app.jobTitle}</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{app.company}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                          background: app.status === 'shortlisted' ? '#d1fae5' : app.status === 'rejected' ? '#fee2e2' : app.status === 'viewed' ? '#dbeafe' : '#fef3c7',
                          color: app.status === 'shortlisted' ? '#065f46' : app.status === 'rejected' ? '#991b1b' : app.status === 'viewed' ? '#1e40af' : '#92400e'
                        }}>{app.status}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(app.appliedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>

    {/* ── Per-Job Applicant Export ──────────────────────────── */}
    <div className="card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>💼 Applications Per Job</h3>
        <button onClick={downloadJobReportCSV} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>📥 Download Summary CSV</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'Job Title', 'Company', 'Premium', 'Total Apps', 'Posted', 'Export'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobReport.map((j, i) => (
              <tr key={j.jobId} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{j.title}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{j.company}</td>
                <td style={{ padding: '10px 14px' }}>
                  {j.isPremium
                    ? <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '700' }}>👑</span>
                    : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: `${Math.min(j.totalApplications * 10, 80)}px`, height: '6px', background: 'var(--accent)', borderRadius: '3px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>{j.totalApplications}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(j.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button
                    disabled={j.totalApplications === 0}
                    onClick={async () => {
                      try {
                        const r = await API.get(`/admin/job/${j.jobId}/applicants`);
                        downloadCSV(
                          r.data,
                          `Applicants_${j.title.replace(/\s+/g, '_')}`,
                          ['Name', 'Email', 'Experience', 'Skills', 'Status', 'Applied Date'],
                          a => [a.applicantName, a.applicantEmail, a.experience, (a.skills || []).join(' | '), a.status, new Date(a.appliedAt).toLocaleDateString()]
                        );
                      } catch (err) { alert('Failed to fetch applicants'); }
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--accent)',
                      background: j.totalApplications === 0 ? 'var(--bg-secondary)' : 'var(--accent-light)',
                      color: j.totalApplications === 0 ? 'var(--text-muted)' : 'var(--accent)',
                      fontSize: '12px', fontWeight: '600', cursor: j.totalApplications === 0 ? 'not-allowed' : 'pointer',
                      opacity: j.totalApplications === 0 ? 0.5 : 1
                    }}
                  >📥 Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ── Applications Per User ─────────────────────────────── */}
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>👥 Applications Per User</h3>
  <button
    onClick={() => downloadCSV(
      userReport,
      'SkillSync_User_Report',
      ['Name', 'Email', 'Premium', 'Profile %', 'Total Applied', 'Jobs Applied'],
      u => [u.name, u.email, u.isPremium ? 'Yes' : 'No', u.profileComplete || 0, u.totalApplications, u.applications.map(a => a.jobTitle).join(' | ')]
    )}
    className="btn-secondary"
    style={{ fontSize: '12px', padding: '6px 14px' }}
  >📥 Download CSV</button>
</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'User Name', 'Email', 'Premium', 'Profile %', 'Total Applied', 'Jobs Applied'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userReport.map((u, i) => (
              <tr key={u.userId} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '10px 14px' }}>
                  {u.isPremium
                    ? <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '700' }}>👑</span>
                    : <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Free</span>}
                </td>
                <td style={{ padding: '10px 14px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{u.profileComplete || 0}%</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '100px', background: u.totalApplications > 0 ? 'var(--accent-light)' : 'var(--bg-secondary)', color: u.totalApplications > 0 ? 'var(--accent)' : 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
                    {u.totalApplications}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '200px' }}>
                    {u.applications.slice(0, 2).map((a, j) => (
                      <span key={j} style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{a.jobTitle}</span>
                    ))}
                    {u.applications.length > 2 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{u.applications.length - 2} more</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

        {/* ══ MESSAGES TAB ══ */}
        {activeTab === 'messages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💬 Contact Messages</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: '700' }}>
                  {messages.filter(m => m.status === 'unread').length} unread
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'var(--green-light)', color: 'var(--green)', fontSize: '12px', fontWeight: '700' }}>
                  {messages.filter(m => m.status === 'replied').length} replied
                </span>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                <p>No messages yet. Messages from Contact page will appear here.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className="card" style={{ padding: '20px', marginBottom: '14px', borderLeft: `4px solid ${msg.status === 'unread' ? '#ef4444' : msg.status === 'replied' ? 'var(--accent)' : '#94a3b8'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                        {msg.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{msg.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent)' }}>{msg.email}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(msg.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                      background: msg.status === 'unread' ? '#fee2e2' : msg.status === 'replied' ? 'var(--green-light)' : '#eff6ff',
                      color: msg.status === 'unread' ? '#dc2626' : msg.status === 'replied' ? 'var(--green)' : '#1d4ed8'
                    }}>
                      {msg.status === 'unread' ? '🔴 Unread' : msg.status === 'replied' ? '✅ Replied' : '👁️ Read'}
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>📌 {msg.subject}</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>{msg.message}</p>
                  </div>

                  {msg.reply && (
                    <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--green)', marginBottom: '6px' }}>
                        ✅ Reply by {msg.repliedBy} · {new Date(msg.repliedAt).toLocaleDateString()}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>{msg.reply}</p>
                    </div>
                  )}

                  {replyingTo === msg._id ? (
                    <div>
                      <textarea className="input" placeholder="Type your reply..." rows={3} value={replyText} onChange={e => setReplyText(e.target.value)} style={{ marginBottom: '10px', resize: 'vertical' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleReply(msg._id)} className="btn-primary" style={{ fontSize: '13px', padding: '8px 20px' }}>📨 Send Reply</button>
                        <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setReplyingTo(msg._id); if (msg.status === 'unread') handleMarkRead(msg._id); }} className="btn-primary" style={{ fontSize: '12px', padding: '7px 16px' }}>
                        {msg.reply ? '✏️ Edit Reply' : '💬 Reply'}
                      </button>
                      {msg.status === 'unread' && (
                        <button onClick={() => handleMarkRead(msg._id)} className="btn-secondary" style={{ fontSize: '12px', padding: '7px 14px' }}>👁️ Mark Read</button>
                      )}
                      <button onClick={() => handleDeleteMsg(msg._id)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}>🗑️ Delete</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ══ NEWSLETTER TAB ══ */}
        {activeTab === 'newsletters' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>📨 Newsletter Subscribers</h3>
              <span className="badge badge-blue">{newsletters.length} subscribers</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Name', 'Email', 'Subscribed On', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newsletters.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No subscribers yet</td></tr>
                  ) : (
                    newsletters.map((sub, i) => (
                      <tr key={sub._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{sub.name}</td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--accent)' }}>{sub.email}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {new Date(sub.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button onClick={() => handleDeleteSubscriber(sub._id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}>
                            🗑️ Remove
                          </button>
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