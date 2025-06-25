// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBreQy9u91K6FMTcoY4rl22zNAw_f0juAo",
  authDomain: "novelplane.firebaseapp.com",
  projectId: "novelplane",
  storageBucket: "novelplane.firebasestorage.app",
  messagingSenderId: "208383799577",
  appId: "1:208383799577:web:ca27cea78d7588d73e9588"
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