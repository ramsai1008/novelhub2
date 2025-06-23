import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { initAuth } from '@/lib/auth';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NovelHub',
  description: 'Read your favorite novels online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAuth(); // Initializes auth listener on app load
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 bg-gray-900 text-white flex justify-between">
          <Link href="/" className="font-bold text-xl">NovelHub</Link>
          <nav className="space-x-4">
            <Link href="/bookmarks">Bookmarks</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
