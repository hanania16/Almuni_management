import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../../services/api.js';

type UserRole = 'admin' | 'student';

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bitsId?: string; // For students
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, bitsId: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success && response.data) {
        // Backend returns user fields inside response.data with a token property
        const token = response.data.token;
        // Build user object from returned data (exclude token)
        const { token: _t, ...userData } = response.data;

        // Store auth data
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData as User);
        return { success: true, data: userData };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string, bitsId: string) => {
    try {
      const response = await authAPI.register({ name, email, password, bitsId });

      if (response.success && response.data) {
        const token = response.data.token;
        const { token: _t, ...userData } = response.data;

        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData as User);
        return { success: true, data: userData };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user,
      user,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
      login, 
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
