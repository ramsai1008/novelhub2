'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getBookmarksForUser } from '../../lib/firestore';
import { Novel } from '../../types';
import Link from 'next/link';

type Bookmark = Novel & { timestamp?: number };

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
      } else {
        setUser(firebaseUser);
        const data = await getBookmarksForUser(firebaseUser.uid);
        setBookmarks(data);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return <p className="p-6 text-center text-sm">Loading...</p>;

  return (
    <div className="max-w-md w-full mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p className="text-sm">No bookmarks yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="border p-2 sm:p-4 rounded shadow-sm">
              <span className="font-medium text-sm sm:text-base">{bookmark.title}</span>
              <Link href={`/novels/${bookmark.id}`} className="ml-2 text-blue-600 underline text-xs sm:text-sm">Read →</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
