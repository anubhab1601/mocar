'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('mo_car_admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(true);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.token) {
        setToken(data.token);
        setIsAdmin(true);
        localStorage.setItem('mo_car_admin_token', data.token);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('mo_car_admin_token');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
