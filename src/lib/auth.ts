// src/lib/auth.ts
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

let currentUser: User | null = null;

export function initAuth(callback?: (user: User | null) => void) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (callback) callback(user);
  });
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function isLoggedIn(): boolean {
  return currentUser !== null;
}
