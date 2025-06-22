"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      const snapshot = await getDocs(collection(db, "novels"));
      setNovels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNovels();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">📚 NovelHub</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {novels.map((novel: any) => (
            <div
              key={novel.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {novel.cover && (
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{novel.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {novel.description}
                </p>
                <Link
                  href={`/novels/${novel.id}`}
                  className="inline-block mt-3 text-blue-500 hover:underline text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
