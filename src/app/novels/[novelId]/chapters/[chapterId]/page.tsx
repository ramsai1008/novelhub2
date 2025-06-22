import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { getAuthSession } from "@/lib/auth"; // If using Firebase Auth session utility
import { BookmarkButton } from "@/components/BookmarkButton"; // Optional bookmark component
import Link from "next/link";

export default async function ChapterPage({
  params,
}: {
  params: { novelId: string; chapterId: string };
}) {
  const { novelId, chapterId } = params;

  const chapterRef = doc(db, "chapters", chapterId);
  const chapterSnap = await getDoc(chapterRef);

  if (!chapterSnap.exists()) {
    return <div className="p-6 text-red-500">❌ Chapter not found</div>;
  }

  const chapter = { id: chapterSnap.id, ...chapterSnap.data() };

  // Fetch all chapters to get previous/next links
  const chapterQuery = query(
    collection(db, "chapters"),
    where("novelId", "==", novelId),
    orderBy("number")
  );
  const chapterSnapAll = await getDocs(chapterQuery);
  const chapters = chapterSnapAll.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{chapter.title}</h1>

      <div className="mb-4 flex justify-between text-sm text-gray-500">
        {prevChapter ? (
          <Link href={`/novels/${novelId}/chapter/${prevChapter.id}`}>
            ⬅️ {prevChapter.title}
          </Link>
        ) : (
          <span></span>
        )}
        {nextChapter ? (
          <Link href={`/novels/${novelId}/chapter/${nextChapter.id}`}>
            {nextChapter.title} ➡️
          </Link>
        ) : (
          <span></span>
        )}
      </div>

      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
        {chapter.content}
      </div>

      {/* Optional Bookmark Button */}
      <div className="mt-6">
        <BookmarkButton chapterId={chapterId} novelId={novelId} />
      </div>
    </div>
  );
}
