import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default async function NovelDetailsPage({ params }: { params: { novelId: string } }) {
  const novelRef = doc(db, "novels", params.novelId);
  const novelSnap = await getDoc(novelRef);

  if (!novelSnap.exists()) {
    return <div className="p-6 text-red-500">❌ Novel not found</div>;
  }

  const novel = { id: novelSnap.id, ...novelSnap.data() };

  const chapterQuery = query(collection(db, "chapters"), where("novelId", "==", params.novelId));
  const chapterSnap = await getDocs(chapterQuery);
  const chapters = chapterSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => (a.number || 0) - (b.number || 0));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
      <p className="text-gray-600 mb-1">{novel.genres?.join(" / ")}</p>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{novel.description}</p>

      {chapters.length > 0 && (
        <Link
          href={`/novels/${params.novelId}/chapter/${chapters[0].id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block mb-6"
        >
          ▶️ Start Reading
        </Link>
      )}

      <h2 className="text-xl font-semibold mb-3">📖 Chapters</h2>
      <ul className="space-y-2">
        {chapters.map((chapter: any) => (
          <li key={chapter.id}>
            <Link
              href={`/novels/${params.novelId}/chapter/${chapter.id}`}
              className="text-blue-600 hover:underline"
            >
              {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
