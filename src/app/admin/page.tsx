"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [novelTitle, setNovelTitle] = useState("");
  const [novels, setNovels] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedNovelId, setSelectedNovelId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.email === "ramsai0014@gmail.com") {
        setUser(firebaseUser);
        fetchNovels();
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchNovels = async () => {
    const snapshot = await getDocs(collection(db, "novels"));
    const novelData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNovels(novelData);
  };

  const fetchChapters = async (novelId) => {
    const chaptersRef = collection(db, "novels", novelId, "chapters");
    const snapshot = await getDocs(chaptersRef);
    const chaptersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChapters(chaptersData);
  };

  const handleNovelSubmit = async (e) => {
    e.preventDefault();
    if (!novelTitle) return;
    await addDoc(collection(db, "novels"), {
      title: novelTitle,
      createdAt: Date.now(),
    });
    setNovelTitle("");
    fetchNovels();
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    if (!chapterTitle || !chapterContent || !selectedNovelId) return;
    const chapterData = {
      title: chapterTitle,
      content: chapterContent,
      chapterNumber: parseInt(chapterNumber),
      updatedAt: Date.now(),
    };

    if (editingChapterId) {
      await updateDoc(doc(db, "novels", selectedNovelId, "chapters", editingChapterId), chapterData);
      setEditingChapterId(null);
      setEditingChapter(null);
    } else {
      await addDoc(collection(db, "novels", selectedNovelId, "chapters"), {
        ...chapterData,
        createdAt: Date.now(),
      });
    }

    setChapterTitle("");
    setChapterContent("");
    setChapterNumber("");
    fetchChapters(selectedNovelId);
  };

  const deleteChapter = async (id) => {
    await deleteDoc(doc(db, "novels", selectedNovelId, "chapters", id));
    fetchChapters(selectedNovelId);
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-3 sm:p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Novel Form */}
      <form onSubmit={handleNovelSubmit} className="mb-6">
        <input
          value={novelTitle}
          onChange={(e) => setNovelTitle(e.target.value)}
          placeholder="Novel Title"
          className="border p-2 mr-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2">Add Novel</button>
      </form>

      {/* Novel List */}
      <h2 className="text-xl font-semibold">Novels</h2>
      <ul className="mb-6 max-h-60 overflow-y-auto">
        {novels.map((novel) => (
          <li
            key={novel.id}
            onClick={() => {
              setSelectedNovelId(novel.id);
              fetchChapters(novel.id);
            }}
            className="cursor-pointer text-blue-600 underline"
          >
            {novel.title}
          </li>
        ))}
      </ul>

      {/* Chapter Form */}
      {selectedNovelId && (
        <form onSubmit={handleChapterSubmit} className="mb-6">
          <input
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Chapter Title"
            className="border p-2 mr-2 w-full"
          />
          <input
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            placeholder="Chapter Number"
            className="border p-2 mr-2 w-full"
            type="number"
          />
          <textarea
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            placeholder="Chapter Content"
            className="border p-2 mr-2 w-full"
          />
          <button className="bg-green-600 text-white px-4 py-2">
            {editingChapterId ? "Update Chapter" : "Add Chapter"}
          </button>
          {editingChapterId && (
            <button
              onClick={() => {
                setEditingChapterId(null);
                setEditingChapter(null);
                setChapterTitle("");
                setChapterContent("");
                setChapterNumber("");
              }}
              className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      {/* Chapter List */}
      <h2 className="text-xl font-semibold">Chapters</h2>
      <ul className="max-h-60 overflow-y-auto">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="mb-2">
            <span className="font-bold">{chapter.chapterNumber}. {chapter.title}</span>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  setChapterTitle(chapter.title);
                  setChapterContent(chapter.content);
                  setChapterNumber(chapter.chapterNumber.toString());
                  setEditingChapterId(chapter.id);
                  setEditingChapter(chapter);
                }}
                className="text-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteChapter(chapter.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
