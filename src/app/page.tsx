import { auth, db } from "@/lib/firebase";
import { getDocs, collection, doc, getDoc, query, where } from "firebase/firestore";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth"; // You may have your own auth util

export default async function HomePage() {
  const session = await getAuthSession(); // or auth.currentUser if using client-side
  let bookmarkData = null;

  if (session?.user?.uid) {
    const bookmarkRef = doc(db, "bookmarks", `${session.user.uid}_novelId`);
    const bookmarkSnap = await getDoc(bookmarkRef);
    if (bookmarkSnap.exists()) {
      const data = bookmarkSnap.data();
      bookmarkData = {
        novelId: data.novelId,
        chapterId: data.chapterId,
      };
    }
  }

  const novelsSnap = await getDocs(collection(db, "novels"));
  const novels = novelsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {bookmarkData && (
        <div className="mb-8 bg-yellow-100 border border-yellow-300 p-4 rounded">
          <p className="text-sm">📌 Continue Reading</p>
          <Link
            href={`/novels/${bookmarkData.novelId}/chapter/${bookmarkData.chapterId}`}
            className="text-lg font-bold underline"
          >
            Go to your last read chapter →
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">📚 All Novels</h1>
      <div className="space-y-3">
        {novels.ma
