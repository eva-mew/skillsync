import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: 'var(--accent)', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '12px', letterSpacing: '-1px' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '500px', margin: '0 auto' }}>
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '28px' }}>

        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Get In Touch
          </h2>

          {[
            { icon: '📧', title: 'Email', value: 'meweva@gmail.com', sub: 'We reply within 24 hours' },
            { icon: '🏫', title: 'University', value: 'IUBAT', sub: 'International University of Business Agriculture and Technology' },
            { icon: '📍', title: 'Location', value: 'Dhaka, Bangladesh', sub: 'UTC+6' },
            { icon: '🔗', title: 'GitHub', value: 'github.com/eva-mew/skillsync', sub: 'View source code' },
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

          {/* Quick Links */}
          <div className="card" style={{ padding: '20px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              🔗 Quick Links
            </h3>
            {[
              { label: '💼 Browse Jobs', path: '/jobs' },
              { label: '💡 Startup Ideas', path: '/startups' },
              { label: '📊 Dashboard', path: '/dashboard' },
              { label: 'ℹ️ About SkillSync', path: '/about' },
            ].map((link, i) => (
              <a key={i} href={link.path} style={{ display: 'block', padding: '8px 0', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Send a Message
          </h2>

          {submitted && (
            <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>
              ✅ Message sent! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="Eva Mew"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="input"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Subject
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="Job recommendation issue..."
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Message
              </label>
              <textarea
                required
                className="input"
                placeholder="Write your message here..."
                rows={5}
                style={{ resize: 'vertical', minHeight: '120px' }}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}>
              📨 Send Message
            </button>
          </form>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        SkillSync © 2026 — Intelligent Career & Startup Recommendation System
      </footer>
    </div>
  );
};

export default Contact;