import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: 'var(--accent)', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '12px', letterSpacing: '-1px' }}>
          About SkillSync
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.75' }}>
          An intelligent career and startup recommendation platform built to bridge the gap between skills and opportunity.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Mission */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '14px' }}>
            🎯 Our Mission
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            SkillSync was created to solve a real problem faced by thousands of students and fresh graduates in Bangladesh —
            the difficulty of finding career opportunities that truly match their skills. Unlike traditional job portals,
            SkillSync uses a content-based filtering algorithm to calculate a real match percentage for every opportunity,
            making job hunting smarter, faster and more personalized.
          </p>
        </div>

        {/* What We Do */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '20px' }}>
            💡 What SkillSync Does
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '16px' }}>
            {[
              { icon: '💼', title: 'Job Recommendations', desc: 'Get matched to jobs based on your skills with a real match percentage for every role.' },
              { icon: '🚀', title: 'Startup Ideas', desc: 'Discover startup opportunities that fit your skills, interests and budget with a launch roadmap.' },
              { icon: '⚔️', title: 'Job Comparison', desc: 'Compare two jobs side by side and get a recommendation on which is the better match for you.' },
              { icon: '📋', title: 'Application Tracking', desc: 'Apply to jobs and track your application status — from pending to shortlisted in real time.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '20px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '16px' }}>
            🛠️ Built With
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT Auth', 'Tailwind CSS', 'Render.com', 'Vercel', 'bcryptjs', 'Nodemailer'].map(tech => (
              <span key={tech} className="skill-tag" style={{ fontSize: '13px', padding: '6px 14px' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '20px' }}>
            👩‍💻 The Developer
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', flexShrink: 0 }}>
              E
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Eva Mew</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Stack Developer Intern — IUBAT</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', maxWidth: '500px' }}>
                SkillSync was developed as a practicum project at IUBAT — International University of Business
                Agriculture and Technology. Built solo over 3 months using the MERN stack with a focus on
                creating a real-world, production-grade web application.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { num: '13', label: 'Modules Built', icon: '🧩' },
            { num: '25+', label: 'API Endpoints', icon: '⚡' },
            { num: '9', label: 'React Pages', icon: '📱' },
            { num: '3', label: 'Months of Work', icon: '📅' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)' }}>{stat.num}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px', borderRadius: '10px', marginRight: '12px' }}>
            Get Started Free →
          </button>
          <button onClick={() => navigate('/jobs')} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '10px' }}>
            Browse Jobs
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        SkillSync © 2026 — Intelligent Career & Startup Recommendation System
      </footer>
    </div>
  );
};

export default About;