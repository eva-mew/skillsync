import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillsync_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('skillsync_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // On mount — always fetch fresh user data from server to avoid stale localStorage
  useEffect(() => {
    const syncUser = async () => {
      const savedToken = localStorage.getItem('skillsync_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        const freshUser = res.data;
        setUser(freshUser);
        localStorage.setItem('skillsync_user', JSON.stringify(freshUser));
      } catch (err) {
        // Token expired or invalid — log out
        setUser(null);
        setToken(null);
        localStorage.removeItem('skillsync_user');
        localStorage.removeItem('skillsync_token');
      }
      setLoading(false);
    };
    syncUser();
  }, []);

  // LOGIN
  const login = (userData, userToken) => {
    const fullUser = { ...userData };
    setUser(fullUser);
    setToken(userToken);
    localStorage.setItem('skillsync_user', JSON.stringify(fullUser));
    localStorage.setItem('skillsync_token', userToken);
    console.log("LOGIN USER:", fullUser);
  };

  // UPDATE USER — merges partial data and persists to localStorage
  const updateUser = (partialData) => {
    setUser(prev => {
      const updated = { ...prev, ...partialData };
      localStorage.setItem('skillsync_user', JSON.stringify(updated));
      return updated;
    });
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillsync_user');
    localStorage.removeItem('skillsync_token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);