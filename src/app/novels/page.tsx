// src/app/novels/page.tsx
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Novels</h1>
      <ul className="space-y-2">
        {novels.map((novel: any) => (
          <li key={novel.id}>
            <a className="text-blue-600 underline" href={`/novels/${novel.id}`}>
              {novel.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
