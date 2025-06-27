// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Link from 'next/link';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const addChapter = async (novelId: string, title: string, content: string): Promise<void> => {
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  await addDoc(chaptersRef, { title, content, createdAt: Date.now() });
};

export const getChapters = async (novelId: string): Promise<any[]> => {
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  const snapshot = await getDocs(chaptersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteChapter = async (novelId: string, chapterId: string): Promise<void> => {
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  await deleteDoc(chapterRef);
};

export const updateChapter = async (
  novelId: string,
  chapterId: string,
  updatedData: { title?: string; content?: string }
): Promise<void> => {
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  await updateDoc(chapterRef, updatedData);
};

// Log a chapter read event for a user
export async function logChapterRead(userId: string, novelId: string, chapterId: string, chapterTitle: string) {
  const ref = doc(db, `users/${userId}/history`, `${novelId}_${chapterId}`);
  await setDoc(ref, {
    novelId,
    chapterId,
    title: chapterTitle,
    readAt: serverTimestamp(),
  });
}

// Set the last read chapter for a user
export const setLastReadChapter = async (userId: string, novelId: string, chapterId: string) => {
  const ref = doc(db, `users/${userId}/lastRead`, novelId);
  await setDoc(ref, { chapterId });
};

// Get the last read chapter for a user
export const getLastReadChapter = async (userId: string, novelId: string): Promise<string | null> => {
  const ref = doc(db, `users/${userId}/lastRead`, novelId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().chapterId || null;
  }
  return null;
};

// Fetch featured novels (example: all novels, or you can filter by a 'featured' field)
export const getFeaturedNovels = async (): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "novels"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch user bookmarks (example: bookmarks collection with userId field)
export const getUserBookmarks = async (userId: string): Promise<any[]> => {
  const bookmarksSnap = await getDocs(collection(db, "bookmarks"));
  // Filter bookmarks by userId and join with novels
  const bookmarks = bookmarksSnap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as { userId?: string; novelId?: string }) }))
    .filter((b) => b.userId === userId && b.novelId);

  // Fetch novels for each bookmark
  const novelIds = bookmarks.map((b) => b.novelId!);
  if (novelIds.length === 0) return [];
  const novelsSnap = await getDocs(collection(db, "novels"));
  const novels = novelsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return novels.filter((n) => novelIds.includes(n.id));
};

// Fetch all novels
export const getAllNovels = async (): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "novels"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get all unique genres from novels
export const getGenres = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "novels"));
  const genresSet = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (Array.isArray(data.tags)) {
      data.tags.forEach((tag: string) => genresSet.add(tag));
    }
  });
  return Array.from(genresSet);
};

// Get novels by genre
export const getNovelsByGenre = async (genre: string): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "novels"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as { tags?: string[] }) }))
    .filter((novel) => Array.isArray(novel.tags) && novel.tags.includes(genre));
};

// Get a single novel by ID, including its chapters
export const getNovelById = async (id: string): Promise<any | null> => {
  const novelDoc = doc(db, "novels", id);
  const novelSnap = await getDocs(collection(db, "novels"));
  let novelData = null;
  novelSnap.forEach((docSnap) => {
    if (docSnap.id === id) {
      novelData = { id: docSnap.id, ...docSnap.data() };
    }
  });
  if (!novelData) return null;
  // Fetch chapters
  const chaptersSnap = await getDocs(collection(db, "novels", id, "chapters"));
  const chapters = chaptersSnap.docs.map((c) => ({ id: c.id, ...c.data() }));
  return { ...novelData, chapters };
};

// Get a single chapter by ID
export const getChapterById = async (novelId: string, chapterId: string): Promise<any | null> => {
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  const chapterSnap = await getDocs(collection(db, "novels", novelId, "chapters"));
  let chapterData = null;
  chapterSnap.forEach((docSnap) => {
    if (docSnap.id === chapterId) {
      chapterData = { id: docSnap.id, ...docSnap.data() };
    }
  });
  return chapterData;
};

// Get all chapters for a novel
export const getChaptersByNovelId = async (novelId: string): Promise<any[]> => {
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  const snapshot = await getDocs(chaptersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get user reading history
export const getUserHistory = async (userId: string): Promise<any[]> => {
  const historySnap = await getDocs(collection(db, `users/${userId}/history`));
  return historySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// In Next.js, use Link from 'next/link' for client-side navigation
// Example usage in a component:
// import Link from 'next/link';
// <Link href="/login">Login</Link>
// <Link href="/register">Register</Link>