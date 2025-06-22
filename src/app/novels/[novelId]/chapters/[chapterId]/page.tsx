"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function ChapterPage() {
  const router = useRouter();
  const { novelId, chapterId } = useParams() as {
    novelId: string;
    chapterId: string;
  };

  const [chapter, setChapter] = useState<any>(null);
  const [chapterList, setChapterList] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      const chapterRef = doc(
        db,
        "novels",
        novelId,
        "chapters",
        chapterId
      );
      const snap = await getDoc(chapterRef);
      if (snap.exists()) setChapter(snap.data());

      const chaptersRef = collection(db, "novels", novelId, "chapters");
      const chapterSnaps = await getDocs(chaptersRef);
      const ids = chapterSnaps.docs.map((doc) => doc.id).sort((a, b) => parseInt(a) - parseInt(b));
      setChapterList(ids);
    };

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    fetchChapter();
    return () => unsubscribe();
  }, [novelId, chapterId]);

  const bookmarkChapter = async () => {
    if (!user) {
      alert("Login required to bookmark!");
      return;
    }
    const bookmarkRef = doc(db, "users", user.uid, "bookmarks", novelId);
    await setDoc(bookmarkRef, { chapterId });
    alert("📌 Chapter bookmarked!");
  };

  if (!chapter) return <div className="p-6">Loading...</div>;

  const currentIndex = chapterList.indexOf(chapterId);
  const prevId = chapterList[currentIndex - 1];
  const nextId = chapterList[currentIndex + 1];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{chapter.title}</h1>
      <article className="prose prose-lg mb-6 whitespace-pre-line">
        {chapter.content}
      </article>

      <div className="flex items-center gap-4 mb-6">
        {prevId && (
          <Link
            href={`/novels/${novelId}/chapter/${prevId}`}
            className="text-blue-600 hover:underline"
          >
            ← Previous
          </Link>
        )}
        {nextId && (
          <Link
            href={`/novels/${novelId}/chapter/${nextId}`}
            className="ml-auto text-blue-600 hover:underline"
          >
            Next →
          </Link>
        )}
      </div>

      <button
        onClick={bookmarkChapter}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📌 Bookmark this chapter
      </button>
    </main>
  );
}
