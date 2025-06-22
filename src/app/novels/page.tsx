"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function NovelsPage() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      const snapshot = await getDocs(collection(db, "novels"));
      setNovels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNovels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Novels</h1>
      <ul className="space-y-3">
        {novels.map((novel: any) => (
          <li key={novel.id}>
            <a href={`/novels/${novel.id}`} className="text-blue-600 underline">
              {novel.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
