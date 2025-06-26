// scripts/setAdminRole.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (reuse from your app)
const firebaseConfig = {
  apiKey: 'AIzaSyBreQy9u91K6FMTcoY4rl22zNAw_f0juAo',
  authDomain: 'novelplane.firebaseapp.com',
  projectId: 'novelplane',
  storageBucket: 'novelplane.firebasestorage.app',
  messagingSenderId: '208383799577',
  appId: '1:208383799577:web:ca27cea78d7588d73e9588',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Replace with your admin user's UID
const adminUid = 'REPLACE_WITH_ADMIN_UID';

async function setAdminRole() {
  const userRef = doc(db, 'users', adminUid);
  await setDoc(userRef, { isAdmin: true }, { merge: true });
  console.log('Admin role set for user:', adminUid);
}

setAdminRole().catch(console.error);
