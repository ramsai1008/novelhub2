import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user?.uid) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <p>Please <Link href="/login" className="underline">log in</Link> to view your dashboard.</p>
      </main>
    );
  }

  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", session.user.uid),
    orderBy("timestamp", "desc")
  );
  const snap = await getDocs(q);
  const bookmarks = snap.docs.map((doc) => doc.data());

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📌 Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>You haven’t bookmarked anything yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bm, idx) => (
            <li key={idx}>
              <Link
                href={`/novels/${bm.novelId}/chapter/${bm.chapterId}`}
                className="block p-3 bg-white border rounded shadow hover:bg-gray-100"
              >
                📖 Novel: {bm.novelId} — Chapter: {bm.chapterId}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
