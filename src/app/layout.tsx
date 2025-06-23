'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex justify-between items-center p-4 bg-gray-100">
          <div className="text-xl font-bold">
            <Link href="/">NovelHub</Link>
          </div>
          <div className="space-x-4">
            <Link href="/bookmarks" className="text-blue-600 hover:underline">
              Bookmarks
            </Link>
            <SignOutButton />
          </div>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
