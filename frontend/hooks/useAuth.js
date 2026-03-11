'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ uid: 'local-user', email: 'vovo@finance.local', displayName: 'Usuário Local' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Modo Local: Sempre logado
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    console.log('Modo Local: Login simulado');
    return true;
  }

  async function signUp(email, password) {
    console.log('Modo Local: Cadastro simulado');
    return true;
  }

  async function signOut() {
    console.log('Modo Local: Logout não disponível agora');
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
