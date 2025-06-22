import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Props {
  params: {
    novelId: string;
  };
}

export default async function NovelPage({ params }: Props) {
  const { novelId } = params;
  const session = await getAuthSession();

  let bookmarkedChapter: string | null = null;

  if (session?.user?.uid) {
    const bookmarkRef = doc(db, "bookmarks", `${session.user.uid}_${novelId}`);
    const snap = await getDoc(bookmarkRef);
    if (snap.exists()) {
      const data = snap.data();
      bookmarkedChapter = data.chapterId;
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📚 Novel: {novelId}</h1>

      {bookmarkedChapter ? (
        <Link
          href={`/novels/${novelId}/chapter/${bookmarkedChapter}`}
          className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔖 Continue Reading Chapter {bookmarkedChapter}
        </Link>
      ) : (
        <p className="text-gray-500 mb-4">No bookmark found.</p>
      )}

      {/* Other novel details or chapter list goes here */}
    </main>
  );
}
