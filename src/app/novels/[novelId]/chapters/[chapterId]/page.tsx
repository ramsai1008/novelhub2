import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function ChapterPage({ params }: { params: { novelId: string; chapterId: string } }) {
  const { novelId, chapterId } = params;
  const [chapter, setChapter] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Get current logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Load chapter content from Firestore
  useEffect(() => {
    const fetchChapter = async () => {
      const docRef = doc(db, "novels", novelId, "chapters", chapterId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChapter(docSnap.data());
      } else {
        console.error("Chapter not found");
      }
    };
    fetchChapter();
  }, [novelId, chapterId]);

  // Save bookmark in Firestore
  const saveBookmark = async () => {
    if (!user) {
      alert("Please login to bookmark.");
      return;
    }
    const bookmarkRef = doc(db, "users", user.uid, "bookmarks", novelId);
    await setDoc(bookmarkRef, { chapterId });
    alert("Chapter bookmarked!");
  };

  if (!chapter) {
    return <div className="p-8">Loading chapter...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{chapter.title || `Chapter ${chapterId}`}</h1>
      <div className="prose prose-lg mb-6" dangerouslySetInnerHTML={{ __html: chapter.content }} />

      <button
        onClick={saveBookmark}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📌 Bookmark this Chapter
      </button>
    </div>
  );
}
