import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../useTheme';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-secondary)' }}>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
<div style={{
  backgroundImage: 'url(https://images.unsplash.com/photo-1664464683525-29b5d442af54?w=1600)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
   minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <div style={{
    position: 'absolute', inset: 0,
    background: 'rgba(3, 7, 18, 0.75)',
  }} />
  <div style={{ textAlign:'center', padding:'60px 20px 48px', position:'relative', zIndex:1, width:'100%' }}>
    <h1 style={{ fontSize:'clamp(2rem,6vw,4.5rem)', fontWeight:'800', letterSpacing:'-2px', lineHeight:'1.05', color:'white', marginBottom:'20px' }}>
      Your Skills.<br />
      <span style={{ background:'linear-gradient(135deg, #1a7a3a, #4ade80)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        Your Perfect Match.
      </span>
    </h1>
    <p style={{ fontSize:'1rem', color:'rgba(255,255,255,0.7)', maxWidth:'500px', margin:'0 auto 32px', lineHeight:'1.75' }}>
      SkillSync analyzes your skill set and recommends the best jobs and startup ideas — with a real match percentage for every result.
    </p>
    <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
      <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding:'13px 28px', fontSize:'15px', borderRadius:'10px' }}>
        Build My Profile →
      </button>
      <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding:'13px 24px', fontSize:'15px', borderRadius:'10px' }}>
        Sign In
      </button>
    </div>
  </div>
</div>

      {/* STATS — 2x2 grid on mobile */}
      <div style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', maxWidth:'800px', margin:'0 auto' }}>
          {[
            { num:'2,400+', label:'Jobs Indexed' },
            { num:'850+', label:'Startup Ideas' },
            { num:'12k+', label:'Users Matched' },
            { num:'94%', label:'Match Accuracy' }
          ].map((s, i) => (
            <div key={i} style={{
              textAlign:'center', padding:'24px 16px',
              borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ fontSize:'1.6rem', fontWeight:'800', background:'linear-gradient(135deg, #1a7a3a, #4ade80)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{s.num}</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'56px 20px' }}>
        <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--accent)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'10px', textAlign:'center' }}>How It Works</div>
        <h2 style={{ fontSize:'clamp(1.6rem,3vw,2rem)', fontWeight:'800', letterSpacing:'-1px', color:'var(--text-primary)', marginBottom:'36px', textAlign:'center' }}>Three steps to your future</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:'16px' }}>

          {/* Card 1 */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <div style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              height: '160px', position: 'relative'
            }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(3,7,18,0.55)' }} />
            </div>
            <div style={{ padding:'24px' }}>
              <h3 style={{ fontSize:'15px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'8px' }}>Build Your Profile</h3>
              <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.65' }}>Enter your skills, experience, interests and budget. Takes under 2 minutes.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <div style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              height: '160px', position: 'relative'
            }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(3,7,18,0.55)' }} />
            </div>
            <div style={{ padding:'24px' }}>
              <h3 style={{ fontSize:'15px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'8px' }}>Get Matched</h3>
              <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.65' }}>Our algorithm scores every opportunity against your profile with a real match percentage.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <div style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              height: '160px', position: 'relative'
            }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(3,7,18,0.55)' }} />
            </div>
            <div style={{ padding:'24px' }}>
              <h3 style={{ fontSize:'15px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'8px' }}>Take Action</h3>
              <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.65' }}>Apply to jobs or follow a step-by-step startup roadmap. Your next chapter starts here.</p>
            </div>
          </div>

        </div>
      </div>
      {/* MODULES */}
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 20px 56px' }}>
        <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--accent)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'10px', textAlign:'center' }}>Two Modules</div>
        <h2 style={{ fontSize:'clamp(1.6rem,3vw,2rem)', fontWeight:'800', letterSpacing:'-1px', color:'var(--text-primary)', marginBottom:'36px', textAlign:'center' }}>One platform, two paths</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'16px' }}>
          <div onClick={() => navigate('/register')} className="card" style={{ padding:'32px', cursor:'pointer', background:'var(--accent-light)', borderColor:'var(--accent-border)' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'14px' }}>💼</div>
            <h3 style={{ fontSize:'1.2rem', fontWeight:'800', color:'var(--text-primary)', marginBottom:'8px' }}>Job Recommender</h3>
            <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.65', marginBottom:'16px' }}>Get matched to jobs that fit your exact skill set with a live match percentage for every role.</p>
            <div style={{ color:'var(--accent)', fontWeight:'600', fontSize:'14px' }}>Explore Jobs →</div>
          </div>
          <div onClick={() => navigate('/register')} className="card" style={{ padding:'32px', cursor:'pointer', background:'var(--green-light)', borderColor:'var(--green-border)' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'14px' }}>💡</div>
            <h3 style={{ fontSize:'1.2rem', fontWeight:'800', color:'var(--text-primary)', marginBottom:'8px' }}>Startup Recommender</h3>
            <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.65', marginBottom:'16px' }}>Discover startup ideas matched to your skills and budget with a full step-by-step roadmap.</p>
            <div style={{ color:'var(--green)', fontWeight:'600', fontSize:'14px' }}>Explore Ideas →</div>
          </div>
        </div>
      </div>

     {/* FOOTER */}
<footer style={{ background:'var(--accent)', color:'white', marginTop:'40px' }}>

  {/* Newsletter */}
  <div style={{ borderBottom:'1px solid rgba(255,255,255,0.15)', padding:'32px 40px', display:'flex', alignItems:'center', justifyContent:'center', gap:'24px', flexWrap:'wrap' }}>
    <div>
      <div style={{ fontSize:'18px', fontWeight:'700' }}>Subscribe to our newsletter</div>
      <div style={{ fontSize:'13px', opacity:'0.8', marginTop:'4px' }}>We'll keep you updated with the best jobs and startup ideas.</div>
    </div>
    <div style={{ display:'flex', gap:'8px' }}>
      <input placeholder="Enter your email" style={{ padding:'10px 16px', borderRadius:'8px', border:'none', fontSize:'14px', width:'240px', outline:'none' }} />
      <button style={{ padding:'10px 20px', background:'white', color:'var(--accent)', border:'none', borderRadius:'8px', fontWeight:'700', cursor:'pointer', fontSize:'14px' }}>Subscribe</button>
    </div>
  </div>

  {/* Links */}
  <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'32px' }}>

    {/* Brand */}
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
        <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', color:'var(--accent)', fontSize:'16px' }}>S</div>
        <span style={{ fontSize:'18px', fontWeight:'800' }}>SkillSync</span>
      </div>
      <p style={{ fontSize:'13px', opacity:'0.75', lineHeight:'1.7' }}>Intelligent Career & Startup Recommendation Platform</p>
      <div style={{ display:'flex', gap:'12px', marginTop:'16px' }}>
       {[
  { icon: <FaFacebookF />, link: 'https://facebook.com' },
  { icon: <FaXTwitter />, link: 'https://twitter.com' },
  { icon: <FaLinkedinIn />, link: 'https://linkedin.com' },
  { icon: <FaGithub />, link: 'https://github.com' },
].map((s, i) => (
  <div key={i}
    onClick={() => window.open(s.link, '_blank')}
    style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', cursor:'pointer' }}>
    {s.icon}
  </div>
))}
      </div>
    </div>

    {/* Platform */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Platform</div>
      {['Find Jobs', 'Startup Ideas', 'Dashboard', 'Build Profile'].map((item, i) => (
        <div key={i} style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}
          onClick={() => navigate(item === 'Find Jobs' ? '/jobs' : item === 'Startup Ideas' ? '/startups' : item === 'Dashboard' ? '/dashboard' : '/register')}>
          {item}
        </div>
      ))}
    </div>

    {/* Company */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Company</div>
      {['About Us', 'Blog', 'Contact Us', 'Careers'].map((item, i) => (
        <div key={i} style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>{item}</div>
      ))}
    </div>

    {/* Help */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Help Center</div>
      {['Site Help', 'FAQs', 'Provide Feedback', 'Report Issue'].map((item, i) => (
        <div key={i} style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>{item}</div>
      ))}
    </div>

    {/* Policies */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Policies</div>
      {['Privacy Policy', 'Terms & Conditions', 'Trust & Safety', 'Cookie Policy'].map((item, i) => (
        <div key={i} style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>{item}</div>
      ))}
    </div>

  </div>

  {/* Bottom */}
  <div style={{ borderTop:'1px solid rgba(255,255,255,0.15)', padding:'20px', textAlign:'center', fontSize:'13px', opacity:'0.7' }}>
    © 2026 SkillSync — Skill-Based Career & Startup Matching Platform. All rights reserved.
  </div>

</footer>

    </div>
  );
};

export default LandingPage;