'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { getFeaturedNovels, getUserBookmarks, getChaptersByNovelId } from '../lib/firebase';
import { useAuth } from '../lib/useAuth';
import { Novel } from '../types';
import { SearchContext } from '../context/SearchContext';

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [bookmarked, setBookmarked] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestUpdates, setLatestUpdates] = useState<any[]>([]);

  const { user } = useAuth();

  // Use searchTerm from context
  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    const fetchData = async () => {
      const allNovels = await getFeaturedNovels();
      setNovels(allNovels as Novel[]);
      setLoading(false);

      if (user) {
        const bookmarks = await getUserBookmarks(user.uid);
        setBookmarked(bookmarks as Novel[]);
      }

      // Fetch latest updated chapters across all novels
      let updates: any[] = [];
      for (const novel of allNovels) {
        const chapters = await getChaptersByNovelId(novel.id);
        if (chapters && chapters.length > 0) {
          // Find latest chapter by createdAt
          const latest = chapters.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
          updates.push({
            novelId: novel.id,
            novelTitle: novel.title,
            chapterId: latest.id,
            chapterTitle: latest.title,
            chapterNumber: chapters.findIndex(c => c.id === latest.id) + 1,
            updatedAt: latest.createdAt,
          });
        }
      }
      // Only include updates from the last 30 days
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      updates = updates.filter(u => u.updatedAt && now - u.updatedAt <= THIRTY_DAYS);
      // Sort by updatedAt desc, take top 20
      updates.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setLatestUpdates(updates.slice(0, 20));
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

      {/* 📢 Latest Updates */}
      <div className="mt-10">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📢 Latest Updated Chapters</h2>
        <div className="bg-white dark:bg-gray-900 rounded shadow p-3 sm:p-4">
          {latestUpdates.length === 0 ? (
            <div className="text-gray-500 text-sm">No recent updates.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestUpdates.map((item, idx) => (
                <li key={item.novelId + item.chapterId} className="py-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <Link href={`/novels/${item.novelId}`} className="font-semibold text-blue-700 dark:text-blue-400 hover:underline text-sm sm:text-base truncate max-w-xs sm:max-w-sm">{item.novelTitle}</Link>
                  <span className="text-xs text-gray-500">Ch. {item.chapterNumber}: {item.chapterTitle}</span>
                  <span className="text-xs text-gray-400 ml-auto">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
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
