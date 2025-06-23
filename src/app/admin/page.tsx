'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const adminEmail = 'youremail@example.com'; // 🔐 Replace with your admin email

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [novels, setNovels] = useState<any[]>([]);

  // Chapter states
  const [selectedNovel, setSelectedNovel] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);

  useEffect(() => {
    if (!user) return;

    // 🔐 Redirect non-admins
    if (user.email !== adminEmail) {
      alert('Access denied');
      router.push('/');
    }

    // Fetch all novels
    const fetchNovels = async () => {
      const snap = await getDocs(collection(db, 'novels'));
      setNovels(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchNovels();
  }, [user]);

  const handleNovelSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || !description || !image) return;

    await addDoc(collection(db, 'novels'), {
      title,
      description,
      image,
      createdAt: Date.now(),
    });

    setTitle('');
    setDescription('');
    setImage('');
    alert('Novel added!');
  };

  const handleChapterSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedNovel || !chapterTitle || !chapterContent || !chapterNumber) return;

    await addDoc(collection(db, 'novels', selectedNovel, 'chapters'), {
      title: chapterTitle,
      content: chapterContent,
      number: chapterNumber,
      createdAt: Date.now(),
    });

    setChapterTitle('');
    setChapterContent('');
    setChapterNumber(1);
    alert('Chapter added!');
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* 🔹 Novel Form */}
      <form onSubmit={handleNovelSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Novel Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Novel
        </button>
      </form>

      {/* 🔹 Novel List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Novels</h2>
        <ul className="list-disc pl-5 space-y-1">
          {novels.map((novel) => (
            <li key={novel.id}>
              {novel.title}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Chapter Upload Form */}
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4">Add Chapter</h2>

      <form onSubmit={handleChapterSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
        <select
          value={selectedNovel}
          onChange={(e) => setSelectedNovel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Novel</option>
          {novels.map((novel) => (
            <option key={novel.id} value={novel.id}>
              {novel.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Chapter Title"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Chapter Number"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Chapter Content"
          value={chapterContent}
          onChange={(e) => setChapterContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Chapter
        </button>
      </form>
    </main>
  );
}
