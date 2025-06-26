// app/novels/[id]/chapters/[chapterId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getChapterById, getChaptersByNovelId, setLastReadChapter } from '../../../../../lib/firebase';
import { useAuth } from '../../../../../lib/useAuth';
import { Chapter } from '../../../../../types';

export default function ChapterPage() {
  const { id, chapterId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string' && typeof chapterId === 'string') {
      getChapterById(id, chapterId).then(data => setChapter(data));
      getChaptersByNovelId(id).then(list => {
        setChapterList(list);
        setLoading(false);
      });

      if (user) {
  setLastReadChapter(user.uid, id, chapterId);
  logChapterRead(user.uid, id, chapterId, data.title || `Chapter`);
}

    }
  }, [id, chapterId, user]);

  const currentIndex = chapterList.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapterList[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapterList.length - 1 ? chapterList[currentIndex + 1] : null;

  if (loading) return <p className="p-6 text-center">Loading chapter...</p>;
  if (!chapter) return <p className="p-6 text-center text-red-500">Chapter not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{chapter.title}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chapter {currentIndex + 1} of {chapterList.length}</span>
      </div>

      {/* Chapter Dropdown */}
      <div className="mb-6">
        <label htmlFor="chapter-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Jump to Chapter:
        </label>
        <select
          id="chapter-select"
          value={chapterId as string}
          onChange={(e) => router.push(`/novels/${id}/chapters/${e.target.value}`)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white"
        >
          {chapterList.map(ch => (
            <option key={ch.id} value={ch.id}>
              {ch.title || `Chapter ${chapterList.indexOf(ch) + 1}`}
            </option>
          ))}
        </select>
      </div>

      <article className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-800 dark:text-gray-100">
        {chapter.content?.split('\n').map((line, i) => (
          <p key={i} className="mb-4">{line}</p>
        ))}
      </article>

      <div className="flex justify-between items-center mt-10 border-t pt-6">
        {prevChapter ? (
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded shadow"
            onClick={() => router.push(`/novels/${id}/chapters/${prevChapter.id}`)}
          >
            ← {prevChapter.title}
          </button>
        ) : <div />}

        {nextChapter ? (
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded shadow"
            onClick={() => router.push(`/novels/${id}/chapters/${nextChapter.id}`)}
          >
            {nextChapter.title} →
          </button>
        ) : <div />}
      </div>
    </div>
  );
}
