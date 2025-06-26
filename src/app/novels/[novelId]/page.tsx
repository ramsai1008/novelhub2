// app/novels/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNovelById, getLastReadChapter } from '../../../lib/firebase';
import { useAuth } from '../../../lib/useAuth';
import { Novel } from '../../../types';

export default function NovelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastReadId, setLastReadId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      getNovelById(id).then(data => {
        setNovel(data);
        setLoading(false);
      });

      if (user) {
        getLastReadChapter(user.uid, id).then(chapterId => {
          setLastReadId(chapterId);
        });
      }
    }
  }, [id, user]);

  if (loading) return <p className="p-6 text-center">Loading novel details...</p>;
  if (!novel) return <p className="p-6 text-center text-red-500">Novel not found.</p>;

  const handleReadFirstChapter = () => {
    if (novel?.chapters?.length) {
      const firstChapterId = novel.chapters[0].id;
      router.push(`/novels/${novel.id}/chapters/${firstChapterId}`);
    }
  };

  const handleContinueReading = () => {
    if (lastReadId) {
      router.push(`/novels/${novel.id}/chapters/${lastReadId}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        {novel.cover && (
          <img
            src={novel.cover}
            alt={novel.title}
            className="w-full md:w-64 h-auto object-cover rounded"
          />
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">{novel.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Author: {novel.author || 'Unknown Author'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Chapters: {novel.chapters?.length || 0} | Last updated: {novel.updatedAt || 'N/A'}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {novel.genres?.map(g => (
              <button
                key={g}
                onClick={() => router.push(`/genres?g=${encodeURIComponent(g)}`)}
                className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 hover:underline"
              >
                {g}
              </button>
            ))}
          </div>

          <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
            {novel.description || 'No description available.'}
          </p>

          <div className="flex gap-4">
            {novel.chapters?.length > 0 && (
              <button
                onClick={handleReadFirstChapter}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                📖 Read First Chapter
              </button>
            )}

            {lastReadId && (
              <button
                onClick={handleContinueReading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                🔄 Continue Reading
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📖 Chapters ({novel.chapters?.length || 0})</h2>
        {novel.chapters?.length ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {novel.chapters.map((chapter, index) => (
              <li key={chapter.id || index}>
                <a
                  href={`/novels/${novel.id}/chapters/${chapter.id}`}
                  className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                >
                  {chapter.title || `Chapter ${index + 1}`}
                </a>
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
