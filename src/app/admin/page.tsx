'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [novels, setNovels] = useState<any[]>([]);

  // 🔐 Step 1: Check Admin Access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'ramsai0014@gmail.com') {
        router.push('/');
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Step 2: Fetch existing novels
  useEffect(() => {
    const fetchNovels = async () => {
      const snapshot = await getDocs(collection(db, 'novels'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNovels(list);
    };

    if (user) fetchNovels();
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || !description || !coverImage) return;

    await addDoc(collection(db, 'novels'), {
      title,
      description,
      coverImage,
      featured,
      createdAt: Date.now(),
    });

    setTitle('');
    setDescription('');
    setCoverImage('');
    setFeatured(false);

    // Refresh novel list
    const snapshot = await getDocs(collection(db, 'novels'));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNovels(list);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel – Add Novel</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span>Featured</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Novel
        </button>
      </form>

      {/* 📦 List of Novels */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Existing Novels</h2>
      <ul className="space-y-2">
        {novels.map((novel) => (
          <li key={novel.id} className="border p-2 rounded">
            <p className="font-bold">{novel.title}</p>
            <p className="text-sm text-gray-600">{novel.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
