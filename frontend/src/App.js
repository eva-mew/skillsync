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
import StartupDetails from './pages/StartupDetails';
import AdminPanel from './pages/AdminPanel';

import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';

import About from './pages/About';
import Contact from './pages/Contact';

import Premium from './pages/Premium';
import JobDetail from './pages/JobDetail';

/* =========================
   Protected Route
========================= */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-secondary)'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

/* =========================
   Admin Route
========================= */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-secondary)'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/jobs" />;

  return children;
};

/* =========================
   Startup Access Control
========================= */
const StartupRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.onboardingType === 'job') {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

/* =========================
   Job Access Control
========================= */
const JobRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.onboardingType === 'startup') {
    return <Navigate to="/startups" replace />;
  }

  return children;
};

/* =========================
   Routes
========================= */
function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      {/* Jobs */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobRoute>
              <Jobs />
            </JobRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetail />
          </ProtectedRoute>
        }
      />

      {/* Startups */}
      <Route
        path="/startups"
        element={
          <ProtectedRoute>
            <StartupRoute>
              <Startups />
            </StartupRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/startups/:id"
        element={
          <ProtectedRoute>
            <StartupRoute>
              <StartupDetails />
            </StartupRoute>
          </ProtectedRoute>
        }
      />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

      {/* User */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

      {/* Info */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Premium */}
      <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

    </Routes>
  );
}

/* =========================
   Main App
========================= */
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