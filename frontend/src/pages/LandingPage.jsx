import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../useTheme';
import Navbar from '../components/Navbar';
import API from '../api';
import { useState, useEffect, useRef } from 'react';
// Animated counter hook — add this OUTSIDE the component
const useCountUp = (target, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const isPercent = String(target).includes('%');
    const isK = String(target).includes('k');
    const isPlus = String(target).includes('+');

    let numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isK) numericTarget = numericTarget * 1000;

    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [startCounting, target, duration]);

  const display = () => {
    const isK = String(target).includes('k');
    const isPlus = String(target).includes('+');
    const isPercent = String(target).includes('%');

    if (isK && count >= 1000) return `${(count / 1000).toFixed(0)}k${isPlus ? '+' : ''}`;
    if (isPlus && !isK) return `${count.toLocaleString()}+`;
    if (isPercent) return `${count}%`;
    return count.toLocaleString();
  };

  return display();
};
const StatCard = ({ target, label, index, startCounting }) => {
  const count = useCountUp(target, 2000, startCounting);
  return (
    <div style={{
      textAlign: 'center', padding: '28px 16px',
      borderRight: index % 2 === 0 ? '1px solid var(--border)' : 'none',
      borderBottom: index < 2 ? '1px solid var(--border)' : 'none',
      transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        fontSize: '1.8rem', fontWeight: '800',
        background: 'linear-gradient(135deg, var(--accent), #06b6d4)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        transition: 'all 0.3s',
        minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {startCounting ? count : '0'}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>
        {label}
      </div>
    </div>
  );
};
const LandingPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
const { theme, toggleTheme } = useTheme();
const [newsletterEmail, setNewsletterEmail] = useState('');
const [newsletterMsg, setNewsletterMsg] = useState('');
const heroImages = [
  'https://images.unsplash.com/photo-1664464683525-29b5d442af54?w=1600',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600',
];

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide(prev => (prev + 1) % heroImages.length);
  }, 4000);
  return () => clearInterval(timer);
}, []);
const [statsVisible, setStatsVisible] = useState(false);
const statsRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
    { threshold: 0.3 }
  );
  if (statsRef.current) observer.observe(statsRef.current);
  return () => observer.disconnect();
}, []);
const handleSubscribe = async () => {
  if (!newsletterEmail || !newsletterEmail.includes('@')) {
    setNewsletterMsg('❌ Please enter a valid email address.');
    return;
  }
  try {
    await API.post('/contact/subscribe', { email: newsletterEmail });
    setNewsletterMsg('✅ Subscribed successfully! Thank you.');
    setNewsletterEmail('');
  } catch (err) {
    setNewsletterMsg(err.response?.data?.message || '❌ Already subscribed or error occurred.');
  }
  setTimeout(() => setNewsletterMsg(''), 4000);
};

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-secondary)' }}>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
<div style={{
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}}>
  {/* Slider Images */}
  {heroImages.map((img, i) => (
    <div key={i} style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url(${img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: i === currentSlide ? 1 : 0,
      transition: 'opacity 1.2s ease-in-out',
      zIndex: 0,
    }} />
  ))}

  {/* Dark overlay */}
  <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.72)', zIndex: 1 }} />

  {/* Slide indicators */}
  <div style={{
    position: 'absolute', bottom: '28px', left: '50%',
    transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3
  }}>
    {heroImages.map((_, i) => (
      <div
        key={i}
        onClick={() => setCurrentSlide(i)}
        style={{
          width: i === currentSlide ? '28px' : '8px',
          height: '8px', borderRadius: '100px',
          background: i === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
  </div>

  {/* Content */}
  <div style={{ textAlign: 'center', padding: '60px 20px 48px', position: 'relative', zIndex: 2, width: '100%' }}>
    <h1 style={{ fontSize: 'clamp(2rem,6vw,4.5rem)', fontWeight: '800', letterSpacing: '-2px', lineHeight: '1.05', color: 'white', marginBottom: '20px' }}>
      Your Skills.<br />
      <span style={{ background: 'linear-gradient(135deg, #BFD1E3, #4B7DAF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Your Perfect Match.
      </span>
    </h1>
    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.75' }}>
      SkillSync analyzes your skill set and recommends the best jobs and startup ideas — with a real match percentage for every result.
    </p>
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '10px' }}>
        Build My Profile →
      </button>
      <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '13px 24px', fontSize: '15px', borderRadius: '10px' }}>
        Sign In
      </button>
    </div>
  </div>
</div>
{/* PREMIUM AD BANNER */}
<div style={{
 background: 'linear-gradient(135deg, #1e3a52, #4B7DAF)',
  padding: '20px 24px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
}}>

  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>

    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }}>
      👑
    </div>

    <div style={{ textAlign: 'left' }}>

      <div style={{
        color: '#fbbf24',
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '2px'
      }}>
        SkillSync Pro
      </div>

      <div style={{
        color: 'white',
        fontSize: '15px',
        fontWeight: '700',
        lineHeight: '1.5'
      }}>
        Get hired faster and smarter — plans start at just ৳299/month
      </div>

    </div>
  </div>

  <button
    onClick={() => navigate('/premium')}
    style={{
      padding: '11px 24px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      color: '#1a1a1a',
      border: 'none',
      fontWeight: '800',
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 14px rgba(251,191,36,0.35)',
      transition: 'transform 0.15s ease'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0px)'}
  >
    🚀 Subscribe Now →
  </button>

</div>

     {/* STATS */}
<div ref={statsRef} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', maxWidth: '800px', margin: '0 auto' }}>
    {[
      { target: '2400+', label: 'Jobs Indexed' },
      { target: '850+', label: 'Startup Ideas' },
      { target: '12k+', label: 'Users Matched' },
      { target: '94%', label: 'Match Accuracy' },
    ].map((s, i) => (
      <StatCard key={i} target={s.target} label={s.label} index={i} startCounting={statsVisible} />
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
    {newsletterMsg && <div style={{ fontSize:'13px', marginTop:'8px', fontWeight:'600' }}>{newsletterMsg}</div>}
  </div>
  <div style={{ display:'flex', gap:'8px' }}>
    <input
      placeholder="Enter your email"
      value={newsletterEmail}
      onChange={(e) => setNewsletterEmail(e.target.value)}
      style={{ padding:'10px 16px', borderRadius:'8px', border:'none', fontSize:'14px', width:'240px', outline:'none' }}
    />
    <button
      onClick={handleSubscribe}
      style={{ padding:'10px 20px', background:'white', color:'var(--accent)', border:'none', borderRadius:'8px', fontWeight:'700', cursor:'pointer', fontSize:'14px' }}>
      Subscribe
    </button>
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
      {[
  { label:'About Us', path:'/about' },
  { label:'Blog', path:'/blog' },
  { label:'Contact Us', path:'/contact' },
  { label:'Careers', path:'/careers' }
].map((item, i) => (
  <div key={i} 
    onClick={() => {
      if(item.path === '/blog' || item.path === '/careers') {
        alert('🚧 This page is coming soon!');
      } else {
        navigate(item.path);
      }
    }}
    style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>
    {item.label}
  </div>
))}
    </div>

    {/* Help */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Help Center</div>
      {[
  { label:'Site Help', path:'/contact' },
  { label:'FAQs', path:'/about' },
  { label:'Provide Feedback', path:'/contact' },
  { label:'Report Issue', path:'/contact' }
].map((item, i) => (
  <div key={i}
    onClick={() => navigate(item.path)}
    style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>
    {item.label}
  </div>
))}
    </div>

    {/* Policies */}
    <div>
      <div style={{ fontWeight:'700', marginBottom:'16px', fontSize:'15px' }}>Policies</div>
      {['Privacy Policy', 'Terms & Conditions', 'Trust & Safety', 'Cookie Policy'].map((item, i) => (
  <div key={i}
    onClick={() => alert(`📄 ${item}\n\nSkillSync respects user privacy and data security. Full policy documentation will be available in the production version.`)}
    style={{ fontSize:'13px', opacity:'0.75', marginBottom:'10px', cursor:'pointer' }}>
    {item}
  </div>
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