'use client';

import { useEffect, useState } from 'react';
import { auth } from 'src/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getBookmarksForUser } from 'src/lib/firestore';

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="p-3 border rounded shadow-sm">
              <p className="font-semibold">{bookmark.title}</p>
              <p className="text-sm text-gray-600">Last read: {new Date(bookmark.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
