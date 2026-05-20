import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Load saved user from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillsync_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Load saved token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('skillsync_token') || null;
  });

  const [loading, setLoading] = useState(false);

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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        updateUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);