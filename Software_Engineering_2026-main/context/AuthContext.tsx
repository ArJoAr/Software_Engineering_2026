import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_STUDENT } from '@/constants/mockData';
import type { Student } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  student: Student | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const validPattern = /^u\d{6}$/;
    if (!validPattern.test(username)) {
      return {
        success: false,
        error: 'Invalid username format. Use your institutional ID (e.g. u123456).',
      };
    }

    if (password.length < 6) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setStudent(MOCK_STUDENT);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
