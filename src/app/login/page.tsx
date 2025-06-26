// app/login/page.tsx
'use client';

import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleEmailLogin} className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
            required
          />
          <div className="mb-4 text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setShowReset(true)}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-2"
          >
            Sign in with Email
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
        <p className="text-sm mt-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
        {showReset && (
          <form onSubmit={handlePasswordReset} className="mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <label className="block mb-2 text-sm">Enter your email to reset password:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Send Reset Email</button>
              <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => { setShowReset(false); setResetMsg(null); }}>Cancel</button>
            </div>
            {resetMsg && <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400">{resetMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
