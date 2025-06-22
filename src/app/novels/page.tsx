import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default async function NovelDetail({ params }: { params: { novelId: string } }) {
  const novelRef = doc(db, "novels", params.novelId);
  const novelSnap = await getDoc(novelRef);
  const novel = novelSnap.exists() ? novelSnap.data() : null;

  const chapterQuery = query(
    collection(db, "chapters"),
    where("novelId", "==", params.novelId)
  );
  const chaptersSnap = await getDocs(chapterQuery);
  const chapters = chaptersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (!novel) {
    return <div className="p-6">❌ Novel not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2
