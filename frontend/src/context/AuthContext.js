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

    // Save complete user data
    const fullUser = { ...userData };

    setUser(fullUser);
    setToken(userToken);

    localStorage.setItem(
      'skillsync_user',
      JSON.stringify(fullUser)
    );

    localStorage.setItem(
      'skillsync_token',
      userToken
    );

    console.log("LOGIN USER:", fullUser);
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
        token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);