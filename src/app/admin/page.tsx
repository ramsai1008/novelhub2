'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';

const ADMIN_EMAIL = 'ramsai0014@gmail.com'; // ← Replace this with your admin email

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login');
      } else if (u.email !== ADMIN_EMAIL) {
        alert('Unauthorized access');
        router.push('/');
      } else {
        setUser(u);
      }
    });

    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, 'novels'), {
      title,
      coverUrl,
      description,
      isFeatured,
      createdAt: Date.now(),
    });

    setTitle('');
    setCoverUrl('');
    setDescription('');
    setIsFeatured(false);
    alert('Novel added!');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Admin Panel – Add New Novel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          className="w-full p-2 border"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Feature on Homepage</span>
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Novel
        </button>
      </form>
    </div>
  );
}
