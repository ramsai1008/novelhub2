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
    <div className="px-2 py-4 sm:px-4 sm:py-6 max-w-7xl mx-auto">
      {/* 🔗 Login/Register Links */}
      {/* Removed homepage login/register links to avoid duplicate navbar buttons */}

      {/* 🔍 Search Bar */}
      <div className="relative max-w-full sm:max-w-2xl mx-auto mb-8 sm:mb-10">
        <input
          type="text"
          placeholder="Search novels..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
        />
        <svg
          className="absolute left-4 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
      </div>

      {/* 📌 Continue Reading */}
      {user && bookmarked.length > 0 && (
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">📌 Continue Reading</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {bookmarked.map(novel => (
              <Link key={novel.id} href={`/novels/${novel.id}`}>
                <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <p className="text-xs sm:text-sm font-medium truncate">{novel.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🎯 Featured Novels */}
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🎯 Featured Novels</h2>
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 sm:gap-4 min-h-[200px]">
          {/* Large slot */}
          <div className="sm:col-span-5 row-span-2">
            {filtered[0] ? (
              <Link href={`/novels/${filtered[0].id}`}>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition h-full flex flex-col">
                  {filtered[0].cover && (
                    <img src={filtered[0].cover} alt={filtered[0].title} className="w-full h-48 sm:h-80 object-cover rounded-t-lg" />
                  )}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg sm:text-xl mb-1 truncate">{filtered[0].title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{filtered[0].description?.slice(0, 120)}...</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-full flex items-center justify-center min-h-[200px]">No featured novel</div>
            )}
          </div>
          {/* 5 small slots left (vertical on desktop, horizontal on mobile) */}
          <div className="sm:col-span-3 flex sm:flex-col flex-row gap-2">
            {[1,2,3,4,5].map((i) => (
              filtered[i] ? (
                <Link key={filtered[i].id} href={`/novels/${filtered[i].id}`}> 
                  <div className="bg-white dark:bg-gray-900 rounded shadow hover:shadow-lg transition flex items-center gap-2 p-2 min-w-[120px]">
                    {filtered[i].cover && <img src={filtered[i].cover} alt={filtered[i].title} className="w-12 h-16 object-cover rounded" />}
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm truncate">{filtered[i].title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{filtered[i].description?.slice(0, 40)}...</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center h-16 min-w-[120px]">Empty</div>
              )
            ))}
          </div>
          {/* 5 small slots right (vertical on desktop, horizontal on mobile) */}
          <div className="sm:col-span-3 flex sm:flex-col flex-row gap-2">
            {[6,7,8,9,10].map((i) => (
              filtered[i] ? (
                <Link key={filtered[i].id} href={`/novels/${filtered[i].id}`}> 
                  <div className="bg-white dark:bg-gray-900 rounded shadow hover:shadow-lg transition flex items-center gap-2 p-2 min-w-[120px]">
                    {filtered[i].cover && <img src={filtered[i].cover} alt={filtered[i].title} className="w-12 h-16 object-cover rounded" />}
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm truncate">{filtered[i].title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{filtered[i].description?.slice(0, 40)}...</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center h-16 min-w-[120px]">Empty</div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* ❌ No Results */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-8 sm:mt-10 text-sm sm:text-base">
          No novels found for “{searchTerm}”
        </p>
      )}
    </div>
  );
}
