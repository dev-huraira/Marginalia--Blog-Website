import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validation on startup
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('marginalia_token');
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('marginalia_token');
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.removeItem('marginalia_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.user) {
        localStorage.setItem('marginalia_token', res.user.token);
        setUser({
          _id: res.user._id,
          name: res.user.name,
          email: res.user.email
        });
        setLoading(false);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.register(name, email, password);
      if (res.success && res.user) {
        localStorage.setItem('marginalia_token', res.user.token);
        setUser({
          _id: res.user._id,
          name: res.user.name,
          email: res.user.email
        });
        setLoading(false);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('marginalia_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
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
