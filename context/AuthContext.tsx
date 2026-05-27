import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STUDENT } from '@/constants/mockData';
import type { Student } from '@/types';

export interface Monster3DConfiguration {
  style: string;    // 'alien', 'robot', 'monster', etc.
  color: string;    // 'teal', 'red', 'purple'
  accessory: string; // 'none', 'hat', 'glasses'
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  student: (Student & { avatarUrl?: string; monster3D?: Monster3DConfiguration }) | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAvatarUrl: (url: string) => Promise<void>;
  updateMonster3D: (config: Monster3DConfiguration) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = '@upf_campus_auth_student';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
const DEFAULT_MONSTER: Monster3DConfiguration = {
  style: 'monster',
  color: 'teal',
  accessory: 'none',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<(Student & { avatarUrl?: string; monster3D?: Monster3DConfiguration }) | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedStudent) {
          const parsed = JSON.parse(storedStudent);
          if (!parsed.avatarUrl) parsed.avatarUrl = DEFAULT_PHOTO;
          if (!parsed.monster3D) parsed.monster3D = DEFAULT_MONSTER;
          setStudent(parsed);
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

  const login = async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const validPattern = /^u\d{6}$/i;
    if (!validPattern.test(username)) {
      return { success: false, error: 'Format error. Use u123456.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password too short.' };
    }

    const currentStudent = {
      ...MOCK_STUDENT,
      id: username.toLowerCase(),
      avatarUrl: DEFAULT_PHOTO,
      monster3D: DEFAULT_MONSTER,
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
      console.error(e);
    }
  };

  const updateAvatarUrl = async (url: string) => {
    if (!student) return;
    const updated = { ...student, avatarUrl: url };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setStudent(updated);
  };

  const updateMonster3D = async (config: Monster3DConfiguration) => {
    if (!student) return;
    const updated = { ...student, monster3D: config };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setStudent(updated);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, student, login, logout, updateAvatarUrl, updateMonster3D }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth error');
  return context;
}