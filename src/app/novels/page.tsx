import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default async function BrowseNovelsPage() {
  const novelsRef = collection(db, "novels");
  const snapshot = await getDocs(novelsRef);
  const novels = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Browse Novels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {novels.map((novel: any) => (
          <Link
            key={novel.id}
            href={`/novels/${novel.id}`}
            className="border p-4 rounded hover:shadow transition"
          >
            <h2 className="text-xl font-semibold">{novel.title}</h2>
            <p className="text-gray-600 text-sm">{novel.genres?.join(" / ")}</p>
            <p className="mt-2 text-gray-700 line-clamp-3">{novel.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
