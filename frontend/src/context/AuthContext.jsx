import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (err) {
          console.error('Session restore failed:', err.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      // Fetch full profile to get initial likedProducts list & stats
      const profileRes = await api.get('/auth/profile');
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, mobile, password, confirmPassword) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        mobile,
        password,
        confirmPassword,
      });
      localStorage.setItem('token', res.data.token);
      
      // Fetch profile to get initial likedProducts list & stats
      const profileRes = await api.get('/auth/profile');
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Refresh profile details (stats, liked list, name etc)
  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to refresh profile:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
