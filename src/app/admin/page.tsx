
'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [novelId, setNovelId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapters, setChapters] = useState([]);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
const [editingChapter, setEditingChapter] = useState<any>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === 'admin@example.com') {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (novelId) {
      const q = query(collection(db, 'novels', novelId, 'chapters'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [novelId]);

  const handleAddChapter = async () => {
    if (!novelId || !title || !content) return;
    const chapterRef = collection(db, 'novels', novelId, 'chapters');
    await addDoc(chapterRef, {
      title,
      content,
      chapterNumber,
      timestamp: Date.now()
    });
    setTitle('');
    setContent('');
    setChapterNumber(prev => prev + 1);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    const chapterRef = doc(db, 'novels', novelId, 'chapters', chapterId);
    await deleteDoc(chapterRef);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <input
        type="text"
        placeholder="Novel ID"
        value={novelId}
        onChange={(e) => setNovelId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="number"
        placeholder="Chapter Number"
        value={chapterNumber}
        onChange={(e) => setChapterNumber(Number(e.target.value))}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <textarea
        placeholder="Chapter Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded w-full h-40 mb-2"
      />
      <button
        onClick={handleAddChapter}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Chapter
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Chapters</h2>
        {chapters.map((ch: any) => (
          <div key={ch.id} className="border rounded p-2 mb-2">
            <p><strong>{ch.chapterNumber}. {ch.title}</strong></p>
            <button
              onClick={() => handleDeleteChapter(ch.id)}
              className="text-red-500 text-sm mt-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/app/novels/[novelId]/page.tsx

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function NovelPage({ params }: { params: { novelId: string } }) {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const q = query(
        collection(db, 'novels', params.novelId, 'chapters'),
        orderBy('chapterNumber', 'asc')
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChapters(list);
    };
    fetchChapters();
  }, [params.novelId]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>
      {chapters.map((chapter: any) => (
        <div key={chapter.id} className="mb-3 p-3 border rounded">
          <p className="font-semibold">{chapter.chapterNumber}. {chapter.title}</p>
        </div>
      ))}
    </div>
  );
}
