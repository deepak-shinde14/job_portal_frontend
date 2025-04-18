// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { setAuthCookie, removeAuthCookie, getAuthCookie } from '../utils/cookies';
import api from '../utils/api';
import { useStore } from '../store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useStore();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = getAuthCookie();
        if (token) {
          const response = await api.get('/auth/verify');
          setUser(response.data.user);
        }
      } catch (error) {
        removeAuthCookie();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      setAuthCookie(token);
      setUser(user);
      setCurrentUser(user); // Add this line
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      setAuthCookie(token);
      setUser(user);
      setCurrentUser(user);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};