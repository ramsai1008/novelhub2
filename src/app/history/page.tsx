// app/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import { getUserHistory, getNovelById } from '../../lib/firebase';

interface HistoryEntry {
  novelId: string;
  chapterId: string;
  title: string;
  readAt?: { toDate: () => Date };
}

interface GroupedHistory {
  novelId: string;
  novelTitle: string;
  cover?: string;
  lastReadAt?: number;
  chapters: HistoryEntry[];
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [grouped, setGrouped] = useState<GroupedHistory[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const entries = await getUserHistory(user.uid);
        const novelMap: Record<string, GroupedHistory> = {};

        for (const entry of entries) {
          if (!novelMap[entry.novelId]) {
            const novel = await getNovelById(entry.novelId);
            novelMap[entry.novelId] = {
              novelId: entry.novelId,
              novelTitle: novel?.title || entry.novelId,
              cover: novel?.cover,
              chapters: [],
              lastReadAt: 0,
            };
          }
          novelMap[entry.novelId].chapters.push(entry);

          const time = entry.readAt?.toDate().getTime() || 0;
          if (time > (novelMap[entry.novelId].lastReadAt || 0)) {
            novelMap[entry.novelId].lastReadAt = time;
          }
        }

        const groupedSorted = Object.values(novelMap).sort(
          (a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0)
        );

        setGrouped(groupedSorted);
      }
    };

    fetchHistory();
  }, [user]);

  const toggleExpand = (novelId: string) => {
    setExpanded(prev => ({ ...prev, [novelId]: !prev[novelId] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">📖 Reading History</h1>

      {grouped.length === 0 ? (
        <p className="text-gray-500">No chapters read yet.</p>
      ) : (
        grouped.map(({ novelId, novelTitle, cover, chapters }) => (
          <div key={novelId} className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
            <button
              onClick={() => toggleExpand(novelId)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                {cover && (
                  <img src={cover} alt={novelTitle} className="w-12 h-18 object-cover rounded" />
                )}
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  📘 {novelTitle}
                </h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {expanded[novelId] ? '▲ Hide' : '▼ Show'}
              </span>
            </button>

            {expanded[novelId] && (
              <ul className="mt-4 divide-y">
                {chapters
                  .sort((a, b) => (b.readAt?.toDate().getTime() || 0) - (a.readAt?.toDate().getTime() || 0))
                  .map((item, idx) => (
                    <li key={idx} className="py-2">
                      <a
                        href={`/novels/${item.novelId}/chapters/${item.chapterId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.title} (Read on {item.readAt?.toDate().toLocaleString()})
                      </a>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
