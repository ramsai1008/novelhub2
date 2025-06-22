"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<
    { novelId: string; chapterId: string; title: string }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const bookmarksRef = collection(db, "users", currentUser.uid, "bookmarks");
        const snapshot = await getDocs(bookmarksRef);

        const bookmarkData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const novelId = docSnap.id;
            const chapterId = docSnap.data().chapterId;

            const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
            const chapterSnap = await getDoc(chapterRef);

            const chapterData = chapterSnap.exists() ? chapterSnap.data() : {};
            const title = chapterData.title || `Chapter ${chapterId}`;

            return { novelId, chapterId, title };
          })
        );

        setBookmarks(bookmarkData);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Welcome to NovelHub</h1>

      {user && bookmarks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📌 Continue Reading</h2>
          <ul className="space-y-2">
            {bookmarks.map((bookmark, index) => (
              <li key={index}>
                <Link
                  href={`/novels/${bookmark.novelId}/chapter/${bookmark.chapterId}`}
                  className="text-blue-600 hover:underline"
                >
                  {bookmark.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-gray-600">
        Explore thousands of novels and track your favorites. Login to get started!
      </p>
    </main>
  );
}
