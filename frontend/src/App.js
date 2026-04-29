import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/Onboarding';
import Jobs from './pages/Jobs';
import Startups from './pages/Startups';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';

import About from './pages/About';
import Contact from './pages/Contact';

import Premium from './pages/Premium';
import JobDetail from './pages/JobDetail';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-secondary)' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/jobs" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/startups" element={<ProtectedRoute><Startups /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
     
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />

<Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
<Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;