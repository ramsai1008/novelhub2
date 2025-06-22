import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    return (
      <div className="p-6 text-center text-red-500">
        Please log in to see your bookmarks.
      </div>
    );
  }

  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", session.user.uid)
  );

  const snapshot = await getDocs(q);
  const bookmarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔖 Your Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500">No bookmarks found.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bm: any) => (
            <li key={bm.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">📘 {bm.novelId}</h2>
              <p className="text-sm text-gray-600">
                Chapter: {bm.chapterId}
              </p>
              <Link
                href={`/novels/${bm.novelId}/chapter/${bm.chapterId}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                ➤ Continue Reading
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
