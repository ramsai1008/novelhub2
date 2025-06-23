'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import SignOutButton from '@/components/SignOutButton';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex justify-between items-center p-4 bg-gray-100">
          <div className="text-xl font-bold">
            <Link href="/">NovelHub</Link>
          </div>
          <div className="space-x-4 flex items-center">
            {user && (
              <>
                <Link href="/bookmarks" className="text-blue-600 hover:underline">
                  Bookmarks
                </Link>
                <span className="text-sm text-gray-700">
                  {user.displayName || user.email}
                </span>
                <SignOutButton />
              </>
            )}
            {!user && (
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
