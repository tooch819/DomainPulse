import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  const checkAuth = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Setup header for this request specifically if needed, 
      // though the interceptor should handle it if userId is already in localStorage.
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      
      // Check subscription status
      const subRes = await api.get('/subscriptions/status');
      const sub = subRes.data.subscription;
      
      if (sub && (sub.status === 'active' || sub.plan === 'Lifetime')) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
        // Calculate trial (7 days from user creation)
        const createdAt = new Date(response.data.user.createdAt);
        const now = new Date();
        const diffTime = now - createdAt;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, 7 - diffDays));
      }
    } catch (error) {
      console.error('Auth check failed', error);
      localStorage.removeItem('userId');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, name) => {
    try {
      const response = await api.post('/auth/login', { email, name });
      const userData = response.data.user;
      localStorage.setItem('userId', userData.id);
      setUser(userData);
      await checkAuth(); // Refresh premium state etc
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setIsPremium(false);
    setTrialDaysLeft(0);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isPremium, 
      trialDaysLeft, 
      login, 
      logout,
      refreshAuth: checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
