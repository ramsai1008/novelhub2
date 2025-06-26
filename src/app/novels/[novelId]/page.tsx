// app/novels/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getNovelById } from '../../../lib/firebase';
import { Novel } from '../../../types';
import Image from 'next/image';

export default function NovelDetailPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getNovelById(id).then(data => {
        setNovel(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <p className="p-6 text-center">Loading novel...</p>;
  }

  if (!novel) {
    return <p className="p-6 text-center text-red-500">Novel not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {novel.cover && (
          <img
            src={novel.cover}
            alt={novel.title}
            className="w-full md:w-64 h-auto object-cover rounded shadow"
          />
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{novel.author || 'Unknown Author'}</p>

          <div className="mb-4">
            {novel.genres?.map(g => (
              <span
                key={g}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
            {novel.description || 'No description available.'}
          </p>
        </div>
      </div>

      {/* Chapters list can go here */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Chapters</h2>
        {novel.chapters?.length > 0 ? (
          <ul className="space-y-2">
            {novel.chapters.map((chapter, index) => (
              <li
                key={index}
                className="border-b pb-2 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <a href={`#`}>{chapter.title || `Chapter ${index + 1}`}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No chapters available.</p>
        )}
      </div>
    </div>
  );
}
