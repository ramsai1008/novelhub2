// app/login/page.tsx
'use client';

import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
      setError('Google login failed.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid email or password.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);
    try {
      await import('firebase/auth').then(({ sendPasswordResetEmail }) =>
        sendPasswordResetEmail(auth, resetEmail)
      );
      setResetMsg('Password reset email sent!');
    } catch (err: any) {
      setResetMsg('Failed to send reset email.');
    }
  };

  const ADMIN_EMAIL = 'ramsai0014@gmail.com'; // Change to your admin email

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (adminEmail !== ADMIN_EMAIL) {
      setAdminError('Access denied. Not an admin email.');
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      // Firestore role check
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        setAdminError('Access denied. Not an admin user.');
        return;
      }
      router.push('/admin');
    } catch (err: any) {
      setAdminError('Admin login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-2 sm:px-0">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Sign In</h1>
        {error && <div className="mb-3 sm:mb-4 text-red-500 text-center text-sm">{error}</div>}
        <form onSubmit={handleEmailLogin} className="mb-3 sm:mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-2 sm:mb-3 px-3 py-2 border rounded focus:outline-none focus:ring text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-2 sm:mb-4 px-3 py-2 border rounded focus:outline-none focus:ring text-sm"
            required
          />
          <div className="mb-2 text-right">
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() => setShowReset(true)}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-2 text-sm sm:text-base"
          >
            Sign in with Email
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google icon"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          Sign in with Google
        </button>
        {/* Move the register link here, below user login and above admin login */}
        <p className="text-xs sm:text-sm mt-3 sm:mt-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
        <div className="mt-6 border-t pt-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">Admin Login</h2>
          <form onSubmit={handleAdminLogin} className="mb-3 sm:mb-4 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded">
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full mb-2 sm:mb-3 px-3 py-2 border rounded focus:outline-none focus:ring text-sm"
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="w-full mb-2 sm:mb-4 px-3 py-2 border rounded focus:outline-none focus:ring text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mb-2 text-sm sm:text-base"
            >
              Admin Login
            </button>
            {adminError && <div className="mb-2 text-red-500 text-center text-xs sm:text-sm">{adminError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
