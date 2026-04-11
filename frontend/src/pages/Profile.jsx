import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const allSkills = [
  'React', 'Node.js', 'MongoDB', 'JavaScript', 'Python',
  'SQL', 'UI/UX Design', 'Digital Marketing', 'Content Writing',
  'Data Analysis', 'Flutter', 'DevOps', 'PHP', 'Laravel',
  'TypeScript', 'Docker', 'AWS', 'Git', 'Figma', 'Express'
];

const allInterests = [
  'Education', 'Healthcare', 'Tech / SaaS', 'E-commerce',
  'Finance', 'Social Impact', 'Gaming', 'Food & Lifestyle',
  'Real Estate', 'Marketing'
];

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    skills: [],
    experience: 'fresher',
    interests: [],
    budget: 'zero',
    workPreference: 'remote'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile');
      setProfile(res.data);
      setForm({
        skills: res.data.skills || [],
        experience: res.data.experience || 'fresher',
        interests: res.data.interests || [],
        budget: res.data.budget || 'zero',
        workPreference: res.data.workPreference || 'remote'
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/profile', form);
      setSuccess('Profile updated successfully!');
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
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
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            👤 My Profile
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Update your skills and preferences to get better matches
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
            ✅ {success}
          </div>
        )}

        {/* Profile Info Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{user?.name}</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-orange' : 'badge-blue'}`}>
              {user?.role}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: profile?.profileComplete >= 80 ? 'var(--green)' : 'var(--accent)' }}>
              {profile?.profileComplete || 0}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Profile Strength</div>
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', width: '100px' }}>
              <div style={{ height: '100%', background: profile?.profileComplete >= 80 ? 'var(--green)' : 'var(--accent)', borderRadius: '3px', width: `${profile?.profileComplete || 0}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            🧠 Technical Skills
            <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({form.skills.length} selected)
            </span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '7px 14px', borderRadius: '100px', border: '1px solid',
                  borderColor: form.skills.includes(skill) ? 'var(--accent)' : 'var(--border2)',
                  background: form.skills.includes(skill) ? 'var(--accent-light)' : 'transparent',
                  color: form.skills.includes(skill) ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '500'
                }}
              >
                {form.skills.includes(skill) ? '✓ ' : ''}{skill}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            🎯 Experience Level
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
            {[
              { val: 'fresher', icon: '🌱', label: 'Fresher', sub: '0–1 yrs' },
              { val: 'junior', icon: '🚀', label: 'Junior', sub: '1–3 yrs' },
              { val: 'mid', icon: '💪', label: 'Mid-level', sub: '3–5 yrs' },
              { val: 'senior', icon: '🏆', label: 'Senior', sub: '5+ yrs' }
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setForm({ ...form, experience: opt.val })}
                style={{
                  padding: '14px', borderRadius: '10px', border: '1px solid',
                  borderColor: form.experience === opt.val ? 'var(--accent)' : 'var(--border)',
                  background: form.experience === opt.val ? 'var(--accent-light)' : 'var(--surface2)',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{opt.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            💡 Startup Interests
            <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({form.interests.length} selected)
            </span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allInterests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                style={{
                  padding: '7px 14px', borderRadius: '100px', border: '1px solid',
                  borderColor: form.interests.includes(interest) ? 'var(--accent)' : 'var(--border2)',
                  background: form.interests.includes(interest) ? 'var(--accent-light)' : 'transparent',
                  color: form.interests.includes(interest) ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '500'
                }}
              >
                {form.interests.includes(interest) ? '✓ ' : ''}{interest}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            ⚙️ Preferences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
                Work Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { val: 'remote', icon: '🌍', label: 'Remote' },
                  { val: 'onsite', icon: '🏢', label: 'Onsite' },
                  { val: 'hybrid', icon: '🔀', label: 'Hybrid' },
                  { val: 'any', icon: '🤷', label: 'Any' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setForm({ ...form, workPreference: opt.val })}
                    style={{
                      padding: '10px', borderRadius: '8px', border: '1px solid',
                      borderColor: form.workPreference === opt.val ? 'var(--accent)' : 'var(--border)',
                      background: form.workPreference === opt.val ? 'var(--accent-light)' : 'var(--surface2)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px',
                      color: form.workPreference === opt.val ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
                Startup Budget
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { val: 'zero', icon: '🪙', label: '$0' },
                  { val: 'low', icon: '💵', label: '$100-1k' },
                  { val: 'medium', icon: '💳', label: '$1k-10k' },
                  { val: 'high', icon: '🏦', label: '$10k+' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setForm({ ...form, budget: opt.val })}
                    style={{
                      padding: '10px', borderRadius: '8px', border: '1px solid',
                      borderColor: form.budget === opt.val ? 'var(--accent)' : 'var(--border)',
                      background: form.budget === opt.val ? 'var(--accent-light)' : 'var(--surface2)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px',
                      color: form.budget === opt.val ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
        >
          {saving ? 'Saving...' : '✅ Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;