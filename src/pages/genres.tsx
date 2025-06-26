// pages/genres.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getGenres, getNovelsByGenre } from '@/lib/firebase';
import { Novel } from '@/types';

export default function GenresPage() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [novels, setNovels] = useState<Novel[]>([]);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      getNovelsByGenre(selectedGenre).then(setNovels);
    }
  }, [selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">📚 Browse by Genre</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full border text-sm hover:bg-blue-500 hover:text-white transition ${
              selectedGenre === genre
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Novels in "{selectedGenre}"</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {novels.map(novel => (
              <Link key={novel.id} href={`/novels/${novel.id}`}>
                <div className="rounded-lg overflow-hidden shadow bg-white dark:bg-gray-900 hover:shadow-md transition">
                  {novel.cover && (
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{novel.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {novel.description?.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
