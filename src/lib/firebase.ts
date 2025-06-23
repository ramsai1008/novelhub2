// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

export const addChapter = async (novelId: string, title: string, content: string) => {
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  await addDoc(chaptersRef, { title, content, createdAt: Date.now() });
};

export const getChapters = async (novelId: string) => {
  const chaptersRef = collection(db, "novels", novelId, "chapters");
  const snapshot = await getDocs(chaptersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteChapter = async (novelId: string, chapterId: string) => {
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  await deleteDoc(chapterRef);
};

export const updateChapter = async (novelId: string, chapterId: string, updatedData: { title?: string; content?: string }) => {
  const chapterRef = doc(db, "novels", novelId, "chapters", chapterId);
  await updateDoc(chapterRef, updatedData);
};