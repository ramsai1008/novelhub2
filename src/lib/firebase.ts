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

// Initialize Firebase app (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export initialized Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
