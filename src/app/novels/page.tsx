"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function AllNovelsPage() {
  const [novels, setNovels] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    const fetchNovels = async () => {
      const snap = await getDocs(collection(db, "novels"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNovels(data);
    };
    fetchNovels();
  }, []);

  const filtered = novels.filter((n) => {
    const matchesTitle = n.title.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genreFilter ? n.genres?.includes(genreFilter) : true;
    return matchesTitle && matchesGenre;
  });

  const uniqueGenres = Array.from(
    new Set(novels.flatMap((n) => n.genres || []))
  );

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Browse Novels</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search title..."
          className="border p-2 flex-1 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          {uniqueGenres.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((novel) => (
            <li key={novel.id} className="border p-4 rounded shadow">
              <Link href={`/novels/${novel.id}`}>
                <div className="font-semibold text-lg">{novel.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {novel.genres?.join(", ")}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
