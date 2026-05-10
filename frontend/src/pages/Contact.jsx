import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newsletter, setNewsletter] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState(user?.email || '');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/contact/submit', form);
      setSubmitted(true);
      setForm({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  const handleNewsletter = async () => {
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    try {
      await API.post('/contact/newsletter', { email: newsletterEmail, name: user?.name || '' });
      setNewsletter('success');
    } catch (err) {
      setNewsletter(err.response?.data?.message || 'Failed to subscribe');
    }
    setNewsletterLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: 'var(--accent)', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '12px' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '500px', margin: '0 auto' }}>
          Have a question or feedback? Send us a message and we'll reply in your dashboard!
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '28px' }}>

        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Get In Touch
          </h2>

          {[
            { icon: '📧', title: 'Email', value: 'meweva@gmail.com', sub: 'Replies appear in your Dashboard' },
            { icon: '🏫', title: 'University', value: 'IUBAT', sub: 'Dhaka, Bangladesh' },
            { icon: '💬', title: 'Response Time', value: 'Within 24 hours', sub: 'Check your Dashboard for replies' },
            { icon: '🔗', title: 'Live Demo', value: 'skillsync-one-rho.vercel.app', sub: 'Try SkillSync now' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '500' }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </div>
          ))}

          {/* Newsletter Box */}
          <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              📨 Subscribe to Newsletter
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Get updates about new features and job opportunities.
            </p>
            {newsletter === 'success' ? (
              <div style={{ padding: '10px', background: 'var(--green-light)', border: '1px solid var(--green-border)', borderRadius: '8px', fontSize: '13px', color: 'var(--green)', fontWeight: '600' }}>
                ✅ Successfully subscribed!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                {newsletter && <p style={{ fontSize: '12px', color: '#dc2626', marginBottom: '8px' }}>{newsletter}</p>}
                <button
                  onClick={handleNewsletter}
                  disabled={newsletterLoading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
                >
                  {newsletterLoading ? 'Subscribing...' : '📨 Subscribe'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Send a Message
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {user ? '💬 Admin reply will appear in your Dashboard.' : '📝 Login to receive replies in your dashboard.'}
          </p>

          {submitted && (
            <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
              ✅ Message sent! Check your Dashboard for admin reply.
            </div>
          )}
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Eva Mew' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Question about recommendations...' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                <input type={f.type} required={f.key !== 'subject'} className="input" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
              <textarea required className="input" placeholder="Write your message here..." rows={5} style={{ resize: 'vertical', minHeight: '120px' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}>
              {loading ? 'Sending...' : '📨 Send Message'}
            </button>
          </form>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        SkillSync © 2026 — Skill-Based Career & Startup Matching Platform
      </footer>
    </div>
  );
};

export default Contact;