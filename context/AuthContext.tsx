import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STUDENT } from '@/constants/mockData';
import type { Student } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  student: Student | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = '@upf_campus_auth_student';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  // Load session from AsyncStorage on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedStudent) {
          setStudent(JSON.parse(storedStudent));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const validPattern = /^u\d{6}$/i;
    if (!validPattern.test(username)) {
      return {
        success: false,
        error: 'Invalid username format. Use your institutional ID (e.g. u123456).',
      };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Create a mock student profile based on the entered username
    const currentStudent: Student = {
      ...MOCK_STUDENT,
      id: username.toLowerCase(),
      // We could customize the name here if we wanted to be fancy
    };

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentStudent));
      setStudent(currentStudent);
      setIsAuthenticated(true);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to save session.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
      setStudent(null);
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
