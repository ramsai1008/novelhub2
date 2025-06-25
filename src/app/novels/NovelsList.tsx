"use client";
import { useState } from "react";
import Link from "next/link";

interface Novel {
  id: string;
  title: string;
  description?: string;
}

export default function NovelsList({ novels }: { novels: Novel[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search novels..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/2 p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white"
      />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">📚 All Novels</h1>
        <ul className="space-y-4">
          {filtered.map((novel) => (
            <li key={novel.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{novel.title}</h2>
              <p className="text-sm text-gray-600">{novel.description}</p>
              <Link
                className="text-blue-600 underline"
                href={`/novels/${novel.id}`}
              >
                Read Now →
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="text-gray-500">No novels found.</p>
        )}
      </div>
    </>
  );
}
