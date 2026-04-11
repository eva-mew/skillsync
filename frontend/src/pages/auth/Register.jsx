import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data, res.data.token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>

        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'800', color:'white', margin:'0 auto 12px' }}>S</div>
          <h1 style={{ fontSize:'22px', fontWeight:'800', color:'var(--text-primary)', marginBottom:'4px' }}>Create your account</h1>
          <p style={{ fontSize:'14px', color:'var(--text-muted)' }}>Join SkillSync and get matched today</p>
        </div>

        <div className="card" style={{ padding:'28px' }}>
          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', padding:'12px 16px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Eva Mew" required className="input" />
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="input" />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-secondary)', display:'block', marginBottom:'6px' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:'13px', color:'var(--text-muted)', marginTop:'20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--accent)', fontWeight:'600', textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;