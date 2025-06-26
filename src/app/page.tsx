'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFeaturedNovels, getUserBookmarks } from '../lib/firebase';
import { useAuth } from '../lib/useAuth';
import { Novel } from '../types';

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [bookmarked, setBookmarked] = useState<Novel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const allNovels = await getFeaturedNovels();
      setNovels(allNovels as Novel[]);
      setLoading(false);

      if (user) {
        const bookmarks = await getUserBookmarks(user.uid);
        setBookmarked(bookmarks as Novel[]);
      }
    };

    fetchData();
  }, [user]);

  const filtered = novels.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* 🔍 Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search novels..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <svg
          className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </div>

      {/* 📌 Continue Reading */}
      {user && bookmarked.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📌 Continue Reading</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bookmarked.map(novel => (
              <Link key={novel.id} href={`/novels/${novel.id}`}>
                <div className="p-4 bg-white dark:bg-gray-900 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <p className="text-sm font-medium truncate">{novel.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🎯 Featured Novels */}
      <h2 className="text-2xl font-bold mb-4">🎯 Featured Novels</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filtered.map(novel => (
          <Link key={novel.id} href={`/novels/${novel.id}`}>
            <div className="bg-white dark:bg-gray-900 rounded overflow-hidden shadow hover:shadow-lg transition">
              {novel.cover && (
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-semibold truncate">{novel.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {novel.description?.slice(0, 80)}...
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ❌ No Results */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No novels found for “{searchTerm}”</p>
      )}
    </div>
  );
}
