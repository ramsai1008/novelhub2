// src/lib/firestore.ts
import { db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

// Re-export commonly used firestore helpers
export {
  db,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
};

// Fetch user bookmarks (example: bookmarks collection with userId field)
export const getBookmarksForUser = async (userId: string): Promise<any[]> => {
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

// Fetch chapters by novelId
export async function getChaptersByNovelId(novelId: string) {
  const colRef = collection(db, "novels", novelId, "chapters");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Fetch a single chapter by novelId and chapterId
export async function getChapterById(novelId: string, chapterId: string) {
  const docRef = doc(db, "novels", novelId, "chapters", chapterId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    title: typeof data.title === 'string' ? data.title : '',
    content: typeof data.content === 'string' ? data.content : '',
    ...data,
  };
}
