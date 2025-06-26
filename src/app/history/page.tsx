'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import { getUserHistory } from '../../lib/firebase';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserHistory(user.uid).then(setHistory);
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">📖 Reading History</h1>
      <ul className="divide-y">
        {history.map((item, idx) => (
          <li key={idx} className="py-3">
            <a
              href={`/novels/${item.novelId}/chapters/${item.chapterId}`}
              className="text-blue-600 hover:underline"
            >
              {item.title} (Read on {item.readAt?.toDate().toLocaleString()})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
