"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);

      const userBookmarksRef = collection(
        db,
        "users",
        u.uid,
        "bookmarks"
      );
      const bookmarkSnaps = await getDocs(userBookmarksRef);
      const bookmarkData = await Promise.all(
        bookmarkSnaps.docs.map(async (docSnap) => {
          const novelId = docSnap.id;
          const data = docSnap.data();
          const chapterId = data.chapterId;

          const novelDoc = await getDoc(doc(db, "novels", novelId));
          const novel = novelDoc.exists() ? novelDoc.data() : null;

          return {
            novelId,
            chapterId,
            novelTitle: novel?.title ?? "Unknown Novel",
          };
        })
      );

      setBookmarks(bookmarkData);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Your Dashboard</h1>

      <button
        onClick={handleLogout}
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        🚪 Logout
      </button>

      {bookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((b, i) => (
            <li key={i}>
              <Link
                href={`/novels/${b.novelId}/chapter/${b.chapterId}`}
                className="text-blue-600 hover:underline"
              >
                Continue reading: <strong>{b.novelTitle}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
