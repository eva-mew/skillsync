import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await API.post('/contact/submit', formData);
      setSent(true);
      setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Try again.');
    }
    setSending(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Get In Touch
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '40px' }}>
          Have a question or feedback? We'd love to hear from you.
          {user && <span style={{ color: 'var(--accent)' }}> Your reply will appear in your Dashboard.</span>}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>

          {/* Left — Contact Info */}
          <div>
            {[
              { icon: '📧', label: 'Email', value: 'meweva@gmail.com', sub: 'We reply within 24 hours' },
              { icon: '🏫', label: 'University', value: 'IUBAT', sub: 'International University of Business Agriculture and Technology' },
              { icon: '📍', label: 'Location', value: 'Dhaka, Bangladesh', sub: 'UTC+6' },
              { icon: '💻', label: 'GitHub', value: 'github.com/eva-mew/skillsync', sub: 'View source code' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px', padding: '16px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '20px', width: '40px', height: '40px', background: 'var(--accent-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
                </div>
              </div>
            ))}

            {user && (
              <div style={{ padding: '14px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '10px', marginTop: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', marginBottom: '4px' }}>📬 Internal Messaging</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  You're logged in as <strong>{user.name}</strong>. Admin replies will appear in your Dashboard under "My Messages".
                </div>
              </div>
            )}
          </div>

          {/* Right — Contact Form */}
          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>
              ✉️ Send a Message
            </h2>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Thank you for reaching out. {user ? "Check your Dashboard for admin replies." : "We'll get back to you soon."}
                </p>
                <button onClick={() => setSent(false)} className="btn-primary" style={{ padding: '10px 24px' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                    {error}
                  </div>
                )}
                {[
                  { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Subject', name: 'subject', type: 'text', placeholder: 'What is this about?' },
                ].map((field) => (
                  <div key={field.name}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.label.includes('*')}
                      className="input"
                      style={{ width: '100%' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    rows={5}
                    className="input"
                    style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary"
                  style={{ padding: '13px', fontSize: '15px', justifyContent: 'center' }}
                >
                  {sending ? '⏳ Sending...' : '✉️ Send Message'}
                </button>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  {user ? '📬 Admin replies will appear in your Dashboard.' : 'We typically respond within 24 hours.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;