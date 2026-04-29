import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext'; // ← add this import at top
const skillOptions = ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'SQL', 'UI/UX Design', 'Digital Marketing', 'Content Writing', 'Data Analysis', 'Flutter', 'DevOps', 'PHP', 'Laravel', 'TypeScript', 'AWS'];
const interestOptions = ['Education', 'Healthcare', 'Tech / SaaS', 'E-commerce', 'Finance', 'Social Impact', 'Gaming', 'Food & Lifestyle', 'Real Estate', 'Health & Fitness'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    skills: [],
    experience: '',
    interests: [],
    budget: '',
    workPreference: ''
  });

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

 const handleSubmit = async () => {
  setLoading(true);
  try {
    await API.put('/profile', form);

    // redirect by role
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/jobs');
    }

  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};
  const progress = (step / 3) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Step {step} of 3
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {step === 1 && 'What are your skills?'}
            {step === 2 && 'What are your goals?'}
            {step === 3 && 'What are your preferences?'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            This helps us find opportunities that truly match you
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent)', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Step Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[{ n: 1, label: '🧠 Skills' }, { n: 2, label: '🎯 Goals' }, { n: 3, label: '💰 Preferences' }].map(t => (
            <button key={t.n} onClick={() => setStep(t.n)} style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
              borderColor: step === t.n ? 'var(--accent)' : 'var(--border)',
              background: step === t.n ? 'var(--accent-light)' : 'transparent',
              color: step === t.n ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>{t.label}</button>
          ))}
        </div>

        <div className="card" style={{ padding: '28px' }}>

          {/* STEP 1 — Skills */}
          {step === 1 && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '14px' }}>
                Select your technical skills (choose all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {skillOptions.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{
                    padding: '8px 16px', borderRadius: '100px', border: '1px solid',
                    borderColor: form.skills.includes(skill) ? 'var(--accent)' : 'var(--border)',
                    background: form.skills.includes(skill) ? 'var(--accent-light)' : 'transparent',
                    color: form.skills.includes(skill) ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '13px', cursor: 'pointer', fontWeight: '500',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                  }}>
                    {form.skills.includes(skill) ? '✓ ' : ''}{skill}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                Experience Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                {[
                  { val: 'fresher', icon: '🌱', label: 'Fresher', sub: '0–1 years' },
                  { val: 'junior', icon: '🚀', label: 'Junior', sub: '1–3 years' },
                  { val: 'mid', icon: '💪', label: 'Mid-level', sub: '3–5 years' },
                  { val: 'senior', icon: '🏆', label: 'Senior', sub: '5+ years' }
                ].map(opt => (
                  <button key={opt.val} onClick={() => setForm({ ...form, experience: opt.val })} style={{
                    padding: '16px', borderRadius: '10px', border: '1px solid',
                    borderColor: form.experience === opt.val ? 'var(--accent)' : 'var(--border)',
                    background: form.experience === opt.val ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Goals */}
          {step === 2 && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '14px' }}>
                Your Interests (for startup matching)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {interestOptions.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)} style={{
                    padding: '8px 16px', borderRadius: '100px', border: '1px solid',
                    borderColor: form.interests.includes(interest) ? 'var(--accent)' : 'var(--border)',
                    background: form.interests.includes(interest) ? 'var(--accent-light)' : 'transparent',
                    color: form.interests.includes(interest) ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '13px', cursor: 'pointer', fontWeight: '500',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                  }}>
                    {form.interests.includes(interest) ? '✓ ' : ''}{interest}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                Startup Budget
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                {[
                  { val: 'zero', icon: '🪙', label: 'Zero Budget', sub: '$0 — bootstrap' },
                  { val: 'low', icon: '💵', label: 'Low', sub: '$100 – $1,000' },
                  { val: 'medium', icon: '💳', label: 'Medium', sub: '$1,000 – $10,000' },
                  { val: 'high', icon: '🏦', label: 'High', sub: '$10,000+' }
                ].map(opt => (
                  <button key={opt.val} onClick={() => setForm({ ...form, budget: opt.val })} style={{
                    padding: '16px', borderRadius: '10px', border: '1px solid',
                    borderColor: form.budget === opt.val ? 'var(--accent)' : 'var(--border)',
                    background: form.budget === opt.val ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Preferences */}
          {step === 3 && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                Work Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '24px' }}>
                {[
                  { val: 'remote', icon: '🌍', label: 'Remote', sub: 'Work from anywhere' },
                  { val: 'onsite', icon: '🏢', label: 'Onsite', sub: 'Office environment' },
                  { val: 'hybrid', icon: '🔀', label: 'Hybrid', sub: 'Best of both' },
                  { val: 'any', icon: '🤷', label: 'No Preference', sub: 'Open to anything' }
                ].map(opt => (
                  <button key={opt.val} onClick={() => setForm({ ...form, workPreference: opt.val })} style={{
                    padding: '16px', borderRadius: '10px', border: '1px solid',
                    borderColor: form.workPreference === opt.val ? 'var(--accent)' : 'var(--border)',
                    background: form.workPreference === opt.val ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>📋 Your Profile Summary</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <div>🧠 Skills: <strong style={{ color: 'var(--text-primary)' }}>{form.skills.length > 0 ? form.skills.join(', ') : 'None selected'}</strong></div>
                  <div>⭐ Experience: <strong style={{ color: 'var(--text-primary)' }}>{form.experience || 'Not selected'}</strong></div>
                  <div>💡 Interests: <strong style={{ color: 'var(--text-primary)' }}>{form.interests.length > 0 ? form.interests.join(', ') : 'None selected'}</strong></div>
                  <div>💰 Budget: <strong style={{ color: 'var(--text-primary)' }}>{form.budget || 'Not selected'}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
              className="btn-secondary"
            >
              ← Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary">
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Find My Matches 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;