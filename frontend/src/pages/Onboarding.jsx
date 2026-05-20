import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const skillOptions = [
  'React', 'Node.js', 'MongoDB', 'JavaScript', 'Python',
  'SQL', 'UI/UX Design', 'Digital Marketing', 'Content Writing',
  'Data Analysis', 'Flutter', 'DevOps', 'PHP', 'Laravel',
  'TypeScript', 'AWS'
];

const interestOptions = [
  'Education', 'Healthcare', 'Tech / SaaS', 'E-commerce',
  'Finance', 'Social Impact', 'Gaming', 'Food & Lifestyle',
  'Real Estate', 'Health & Fitness'
];

const onboardingOptions = [
  {
    val: 'job',
    icon: '💼',
    label: 'Find a Job',
    sub: 'I want to apply for jobs matching my skills'
  },
  {
    val: 'startup',
    icon: '💡',
    label: 'Build a Startup',
    sub: 'I want startup ideas matched to my interests'
  },
  {
    val: 'both',
    icon: '🚀',
    label: 'Both',
    sub: 'I want jobs and startup ideas'
  }
];

// Step definitions per onboardingType
// job:     step0=Type, step1=Skills+Exp, step2=WorkPref
// startup: step0=Type, step1=Interests+Budget, step2=Skills (optional)
// both:    step0=Type, step1=Skills+Exp, step2=Interests+Budget, step3=WorkPref

const getSteps = (type) => {
  if (type === 'job') {
    return [
      { key: 'type',    label: '🔍 Looking For' },
      { key: 'skills',  label: '🧠 Skills' },
      { key: 'prefs',   label: '💼 Preferences' },
    ];
  }
  if (type === 'startup') {
    return [
      { key: 'type',  label: '🔍 Looking For' },
      { key: 'goals', label: '🎯 Goals' },
    ];
  }
  // both or not yet selected
  return [
    { key: 'type',    label: '🔍 Looking For' },
    { key: 'skills',  label: '🧠 Skills' },
    { key: 'goals',   label: '🎯 Goals' },
    { key: 'prefs',   label: '💼 Preferences' },
  ];
};

const getStepTitle = (stepKey, type) => {
  const titles = {
    type:   'What are you looking for?',
    skills: type === 'startup' ? 'What are your skills?' : 'What are your skills?',
    goals:  'What are your goals & budget?',
    prefs:  'What are your work preferences?',
  };
  return titles[stepKey] || '';
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    onboardingType: '',
    skills: [],
    experience: '',
    interests: [],
    budget: '',
    workPreference: ''
  });

  const steps = getSteps(form.onboardingType);
  const totalSteps = steps.length;
  const currentStepKey = steps[step]?.key;
  const finalStepIndex = totalSteps - 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleSkill = (skill) =>
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));

  const toggleInterest = (interest) =>
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));

  const handleNext = () => {
    if (step < finalStepIndex) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate('/');
  };

  const handleSelectType = (val) => {
    setForm({ onboardingType: val, skills: [], experience: '', interests: [], budget: '', workPreference: '' });
    setStep(1);
  };

const handleSubmit = async () => {
  setLoading(true);
  try {
    await API.put('/profile', { ...form });
    const profileRes = await API.get('/profile');
    
    const updated = { 
      ...JSON.parse(localStorage.getItem('skillsync_user')), 
      ...profileRes.data 
    };
    
    // localStorage সরাসরি update করো
    localStorage.setItem('skillsync_user', JSON.stringify(updated));
    
    if (setUser) setUser(updated);

    if (updated.role === 'admin') {
      navigate('/admin');
    } else if (form.onboardingType === 'startup') {
      navigate('/startups');
    } else {
      navigate('/jobs');
    }
  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '12px', fontWeight: '700', color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'
          }}>
            Step {step + 1} of {totalSteps}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {getStepTitle(currentStepKey, form.onboardingType)}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            This helps us find opportunities that truly match you
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--accent)', borderRadius: '2px',
            width: `${progress}%`, transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Step Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {steps.map((t, i) => (
            <button
              key={t.key}
              onClick={() => i < step && setStep(i)} // only allow going back via tabs
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                borderColor: step === i ? 'var(--accent)' : 'var(--border)',
                background: step === i ? 'var(--accent-light)' : 'transparent',
                color: step === i ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '13px', fontWeight: '600',
                cursor: i < step ? 'pointer' : 'default',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: '28px' }}>

          {/* STEP: type */}
          {currentStepKey === 'type' && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                What are you looking for on SkillSync?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {onboardingOptions.map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => handleSelectType(opt.val)}
                    style={{
                      padding: '18px 20px', borderRadius: '12px', border: '1px solid',
                      borderColor: form.onboardingType === opt.val ? 'var(--accent)' : 'var(--border)',
                      background: form.onboardingType === opt.val ? 'var(--accent-light)' : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '16px',
                      alignItems: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '28px' }}>{opt.icon}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{opt.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: skills — shown for job & both (with experience), and for startup (skills only, no experience) */}
          {currentStepKey === 'skills' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '14px' }}>
                Select your technical skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '8px 16px', borderRadius: '100px', border: '1px solid',
                      borderColor: form.skills.includes(skill) ? 'var(--accent)' : 'var(--border)',
                      background: form.skills.includes(skill) ? 'var(--accent-light)' : 'transparent',
                      color: form.skills.includes(skill) ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: '13px', cursor: 'pointer', fontWeight: '500',
                      fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    {form.skills.includes(skill) ? '✓ ' : ''}{skill}
                  </button>
                ))}
              </div>

              {/* Experience level — only for job seekers and both */}
              {(form.onboardingType === 'job' || form.onboardingType === 'both') && (
                <>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                    Experience Level
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                    {[
                      { val: 'fresher', icon: '🌱', label: 'Fresher', sub: '0–1 years' },
                      { val: 'junior',  icon: '🚀', label: 'Junior',  sub: '1–3 years' },
                      { val: 'mid',     icon: '💪', label: 'Mid-level', sub: '3–5 years' },
                      { val: 'senior',  icon: '🏆', label: 'Senior',  sub: '5+ years' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setForm({ ...form, experience: opt.val })}
                        style={{
                          padding: '16px', borderRadius: '10px', border: '1px solid',
                          borderColor: form.experience === opt.val ? 'var(--accent)' : 'var(--border)',
                          background: form.experience === opt.val ? 'var(--accent-light)' : 'transparent',
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP: goals — interests + budget (startup & both) */}
          {currentStepKey === 'goals' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '14px' }}>
                Your Startup Interests
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: '8px 16px', borderRadius: '100px', border: '1px solid',
                      borderColor: form.interests.includes(interest) ? 'var(--accent)' : 'var(--border)',
                      background: form.interests.includes(interest) ? 'var(--accent-light)' : 'transparent',
                      color: form.interests.includes(interest) ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: '13px', cursor: 'pointer', fontWeight: '500',
                      fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    {form.interests.includes(interest) ? '✓ ' : ''}{interest}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                Startup Budget
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                {[
                  { val: 'zero',   icon: '🪙', label: 'Zero Budget', sub: '$0 — bootstrap' },
                  { val: 'low',    icon: '💵', label: 'Low',         sub: '$100 – $1,000' },
                  { val: 'medium', icon: '💳', label: 'Medium',      sub: '$1,000 – $10,000' },
                  { val: 'high',   icon: '🏦', label: 'High',        sub: '$10,000+' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setForm({ ...form, budget: opt.val })}
                    style={{
                      padding: '16px', borderRadius: '10px', border: '1px solid',
                      borderColor: form.budget === opt.val ? 'var(--accent)' : 'var(--border)',
                      background: form.budget === opt.val ? 'var(--accent-light)' : 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: prefs — work preference (job & both only) */}
          {currentStepKey === 'prefs' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                Work Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '24px' }}>
                {[
                  { val: 'remote', icon: '🌍', label: 'Remote',       sub: 'Work from anywhere' },
                  { val: 'onsite', icon: '🏢', label: 'Onsite',       sub: 'Office environment' },
                  { val: 'hybrid', icon: '🔀', label: 'Hybrid',       sub: 'Best of both' },
                  { val: 'any',    icon: '🤷', label: 'No Preference', sub: 'Open to anything' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setForm({ ...form, workPreference: opt.val })}
                    style={{
                      padding: '16px', borderRadius: '10px', border: '1px solid',
                      borderColor: form.workPreference === opt.val ? 'var(--accent)' : 'var(--border)',
                      background: form.workPreference === opt.val ? 'var(--accent-light)' : 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button onClick={handleBack} className="btn-secondary">
              ← Back
            </button>

            {step > 0 && step < finalStepIndex && (
              <button onClick={handleNext} className="btn-primary">
                Continue →
              </button>
            )}

            {step > 0 && step === finalStepIndex && (
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