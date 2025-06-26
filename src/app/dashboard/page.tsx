'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
      } else {
        setUser(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) return <p className="p-6 text-center text-sm">Loading...</p>;

  return (
    <div className="max-w-md w-full mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Welcome, {user.email}</h1>
      <p className="text-sm sm:text-base">Your dashboard content goes here.</p>
    </div>
  );
}
