import { db } from '../../../../lib/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

interface Params {
  params: {
    novelId: string;
    chapterId: string;
  };
}

export default async function ChapterPage({ params }: Params) {
  const { novelId, chapterId } = params;

  // Fetch current chapter
  const docRef = doc(db, "novels", novelId, "chapters", chapterId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="p-4 text-red-600">Chapter not found.</div>;
  }

  const chapter = docSnap.data();
  const currentOrder = chapter.order;

  // Fetch all chapters of this novel, ordered by 'order'
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  const q = query(chaptersRef, orderBy("order", "asc"));
  const chaptersSnap = await getDocs(q);
  const chapters = chaptersSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => a.order - b.order);

  const currentIndex = chapters.findIndex((ch: any) => ch.id === chapterId);
  const prevChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{chapter.title}</h1>
      <div className="prose prose-lg mb-6" dangerouslySetInnerHTML={{ __html: chapter.content }} />

      <div className="flex justify-between mt-8">
        {prevChapter ? (
          <Link
            className="text-blue-600 hover:underline"
            href={`/novels/${novelId}/chapter/${prevChapter.id}`}
          >
            ← {prevChapter.title}
          </Link>
        ) : <div />}
        {nextChapter ? (
          <Link
            className="text-blue-600 hover:underline ml-auto"
            href={`/novels/${novelId}/chapter/${nextChapter.id}`}
          >
            {nextChapter.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
