import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STUDENT } from '@/constants/mockData';
import type { Student } from '@/types';

// ─── 1. NUEVOS TIPOS PARA EL AVATAR 3D ───
export interface Monster3DConfiguration {
  style: string;     // 'robot', 'ghost', 'monster', etc.
  color: string;     // 'white', 'teal', 'red'
  accessory: string; // 'none', 'gorra_upf', 'cascos', etc.
  pin?: string;      // 'none', 'heart' (Añadido para soportar tu nueva capa de pins)
}

// Extendemos el tipo Student original para que acepte las propiedades del avatar
type ExtendedStudent = Student & { 
  photoUrl?: string; 
  monster3D?: Monster3DConfiguration 
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  student: ExtendedStudent | null;
  // Métodos de MAIN
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }>;
  register: (username: string, password: string, email: string) => Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }>;
  updateProfile: (updates: Partial<ExtendedStudent>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Métodos de AVATAR BRANCH
  updateMonster3D: (config: Monster3DConfiguration) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = '@upf_campus_auth_student';
const USERS_DB_KEY = '@upf_users_db'; // Base de datos de MAIN

const DEFAULT_MONSTER: Monster3DConfiguration = {
  style: 'robot',
  color: 'white',
  accessory: 'none',
  pin: 'none',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<ExtendedStudent | null>(null);

  // ─── CARGA DE SESIÓN (Fusionada) ───
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedStudent) {
          const parsed: ExtendedStudent = JSON.parse(storedStudent);
          // Inyectamos el avatar por defecto si es un usuario antiguo que no lo tiene
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

  // ─── VALIDACIONES DE MAIN ───
  const validateEmail = (email: string) => {
    const emailPattern = /^([a-zA-Z]+)\.([a-zA-Z]+)(?:\d{2})?@([a-zA-Z0-9-]+\.)?upf\.edu$/i;
    const match = email.match(emailPattern);
    if (!match) return { valid: false, firstName: '', lastName: '', fullName: '', role: '' };
    
    const name = match[1];
    const surname = match[2];
    const subdomain = match[3];

    const firstName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const lastName = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    const role = (subdomain && subdomain.toLowerCase() === 'estudiant.') ? 'STUDENT' : 'TEACHER';
    
    return { valid: true, firstName, lastName, fullName, role };
  };

  const getUsersDB = async () => {
    try {
      const db = await AsyncStorage.getItem(USERS_DB_KEY);
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveUsersDB = async (db: any[]) => {
    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  };

  // ─── LÓGICA DE LOGIN & REGISTRO (MAIN) ───
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const db = await getUsersDB();
    const userRecord = db.find((u: any) => u.student.id === username.toLowerCase() && u.password === password);

    if (userRecord) {
      try {
        const studentData = userRecord.student;
        if (!studentData.monster3D) studentData.monster3D = DEFAULT_MONSTER; // Asignamos avatar si no tiene

        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(studentData));
        setStudent(studentData);
        setIsAuthenticated(true);
        const needsOnboarding = !studentData.faculty || !studentData.degree;
        return { success: true, needsOnboarding };
      } catch (e) {
        return { success: false, error: 'Failed to save session.' };
      }
    }
    return { success: false, error: 'Invalid username or password.' };
  };

  const register = async (username: string, password: string, email: string): Promise<{ success: boolean; error?: string; needsOnboarding?: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    const validPattern = /^u\d{6}$/i;
    if (!validPattern.test(username)) return { success: false, error: 'Invalid username format (e.g. u123456).' };

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, error: 'Invalid email. Must be like name.surname01@upf.edu' };
    }

    const db = await getUsersDB();
    if (db.find((u: any) => u.student.id === username.toLowerCase())) {
      return { success: false, error: 'User already exists.' };
    }

    const newStudent: ExtendedStudent = {
      ...MOCK_STUDENT,
      id: username.toLowerCase(),
      studentIdNumber: username.toLowerCase(),
      email: email,
      firstName: emailValidation.firstName,
      lastName: emailValidation.lastName,
      fullName: emailValidation.fullName,
      role: emailValidation.role,
      faculty: '',
      degree: '',
      monster3D: DEFAULT_MONSTER, // 🆕 Añadimos el avatar por defecto al registrarse
    };

    db.push({ student: newStudent, password });
    await saveUsersDB(db);

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newStudent));
      setStudent(newStudent);
      setIsAuthenticated(true);
      return { success: true, needsOnboarding: true };
    } catch (e) {
      return { success: false, error: 'Failed to login after register.' };
    }
  };

  // ─── ACTUALIZACIÓN DE PERFIL (MAIN) ───
  const updateProfile = async (updates: Partial<ExtendedStudent>): Promise<{ success: boolean; error?: string }> => {
    if (!student) return { success: false, error: 'Not logged in' };
    
    if (updates.email) {
      const emailValidation = validateEmail(updates.email);
      if (!emailValidation.valid) {
        return { success: false, error: 'Invalid email format' };
      }
      updates.firstName = emailValidation.firstName;
      updates.lastName = emailValidation.lastName;
      updates.fullName = emailValidation.fullName;
      updates.role = emailValidation.role;
    }

    const updatedStudent = { ...student, ...updates };
    
    try {
      // 1. Guardamos en la sesión actual
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedStudent));
      setStudent(updatedStudent);

      // 2. Guardamos en la base de datos global de Main
      const db = await getUsersDB();
      const index = db.findIndex((u: any) => u.student.id === student.id);
      if (index !== -1) {
        db[index].student = updatedStudent;
        await saveUsersDB(db);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  // ─── FUNCIÓN EXCLUSIVA DEL AVATAR (AVATAR BRANCH) ───
  // Aprovecha la función updateProfile de Main para que el avatar se guarde en la BD y no se borre
  const updateMonster3D = async (config: Monster3DConfiguration) => {
    await updateProfile({ monster3D: config });
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
    <AuthContext.Provider value={{ isAuthenticated, isLoading, student, login, register, updateProfile, updateMonster3D, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}