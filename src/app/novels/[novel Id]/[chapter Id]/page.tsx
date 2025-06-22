// src/app/novels/[novelId]/[chapterId]/page.tsx
"use client";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function ChapterPage({ params }: any) {
  const { novelId, chapterId } = params;
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  const chapterSnap = await getDoc(chapterRef);

  if (!chapterSnap.exists()) return <p>Chapter not found</p>;

  const chapter = chapterSnap.data();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{chapter.title}</h2>
      <p className="mt-4 whitespace-pre-line">{chapter.content}</p>
    </div>
  );
}
