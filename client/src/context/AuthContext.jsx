import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const PORTALS = {
  SUPER_ADMIN: 'Super Admin',
  KYC: 'KYC Team',
  PAYMENTS: 'Payments Team',
  QUERIES: 'Queries Team'
};

// Preset credentials for easy one-click testing per portal
export const PORTAL_CREDENTIALS = {
  [PORTALS.SUPER_ADMIN]: {
    email: 'admin@kycops.enterprise',
    password: 'admin',
    role: 'Super Admin',
    name: 'Rajesh Sharma',
    tagline: 'Complete administrative oversight across all teams & operations'
  },
  [PORTALS.KYC]: {
    email: 'tl.kyc@kycops.enterprise',
    password: 'password',
    role: 'KYC TL',
    name: 'Ananya Deshmukh',
    tagline: 'KYC verification, document inspection, approval/rejection'
  },
  [PORTALS.PAYMENTS]: {
    email: 'tl.pay@kycops.enterprise',
    password: 'password',
    role: 'Payments TL',
    name: 'Suresh Menon',
    tagline: 'Subscriptions, dual-cycle billing, and payment processing'
  },
  [PORTALS.QUERIES]: {
    email: 'tl.query@kycops.enterprise',
    password: 'password',
    role: 'Queries TL',
    name: 'Kavita Patel',
    tagline: 'Support queries, ticket routing, response SLAs'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kyc_ops_user');
    return saved ? JSON.parse(saved) : null; // Starts logged out to show login portals
  });

  const [token, setToken] = useState(() => localStorage.getItem('kyc_ops_token') || null);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('kyc_ops_user', JSON.stringify(data.user));
      localStorage.setItem('kyc_ops_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kyc_ops_user');
    localStorage.removeItem('kyc_ops_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      changePassword,
      PORTALS, 
      PORTAL_CREDENTIALS 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
