"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";

export default function NovelDetailPage() {
  const params = useParams();
  const novelId = params?.id as string;

  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const novelRef = doc(db, "novels", novelId);
      const novelSnap = await getDoc(novelRef);
      if (novelSnap.exists()) {
        setNovel(novelSnap.data());
      }

      const chaptersRef = collection(novelRef, "chapters");
      const chaptersSnap = await getDocs(chaptersRef);
      const chapterList = chaptersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.number - b.number);
      setChapters(chapterList);
    };

    if (novelId) fetchData();
  }, [novelId]);

  if (!novel) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
      <p className="text-gray-700 mb-6">{novel.description}</p>

      <h2 className="text-xl font-semibold mb-3">📖 Chapters</h2>
      <ul className="list-disc pl-5 space-y-1">
        {chapters.map(chap => (
          <li key={chap.id}>
            <Link
              href={`/novels/${novelId}/chapter/${chap.id}`}
              className="text-blue-600 hover:underline"
            >
              {chap.title || `Chapter ${chap.number}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
