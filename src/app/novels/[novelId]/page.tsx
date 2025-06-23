import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";

interface Params {
  params: {
    novelId: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  createdAt: number;
}

export default async function NovelPage({ params }: Params) {
  const { novelId } = params;

  // Fetch chapters for this novel
  const chapters: Chapter[] = [];

  const chaptersRef = collection(db, "chapters");
  const q = query(
    chaptersRef,
    where("novelId", "==", novelId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const data = doc.data();
    chapters.push({
      id: doc.id,
      title: data.title,
      createdAt: data.createdAt,
    });
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/novels/${novelId}/chapter/${chapter.id}`}
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
