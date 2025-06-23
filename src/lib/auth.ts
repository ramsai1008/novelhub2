'use client';

import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { useEffect, useState } from 'react';

// Custom hook to get current user
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// Login function
export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Register function
export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Logout function
export async function logout() {
  return signOut(auth);
}
