"use client";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ChapterPage() {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const chapRef = doc(db, "novels", novelId as string, "chapters", chapterId as string);
      const chapSnap = await getDoc(chapRef);
      if (chapSnap.exists()) {
        setChapter({ id: chapterId, ...chapSnap.data() });
      }

      const allChaptersSnap = await getDocs(collection(db, "novels", novelId as string, "chapters"));
      const all = allChaptersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.number - b.number);

      setChapters(all);
    };

    if (novelId && chapterId) fetchData();
  }, [novelId, chapterId]);

  if (!chapter) return <div className="p-4">Loading chapter...</div>;

  const currentIndex = chapters.findIndex(c => c.id === chapter.id);
  const prevChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{chapter.title}</h1>
      <article className="prose prose-lg text-gray-800 whitespace-pre-wrap">
        {chapter.content}
      </article>

      <div className="mt-6 flex justify-between">
        {prevChapter ? (
          <Link
            href={`/novels/${novelId}/chapter/${prevChapter.id}`}
            className="text-blue-500 hover:underline"
          >
            ← {prevChapter.title}
          </Link>
        ) : <div />}

        {nextChapter ? (
          <Link
            href={`/novels/${novelId}/chapter/${nextChapter.id}`}
            className="text-blue-500 hover:underline"
          >
            {nextChapter.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
