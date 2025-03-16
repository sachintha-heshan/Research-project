import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyAnXmCL4M8RCvcgdadH1AkMdH4j-NYgYKY",
//   authDomain: "childsup-42ec5.firebaseapp.com",
//   projectId: "childsup-42ec5",
//   storageBucket: "childsup-42ec5.appspot.com",
//   messagingSenderId: "207609905526",
//   appId: "1:207609905526:web:27731eb8d776c0faa4ba57"
// };
const firebaseConfig = {
  apiKey: "AIzaSyD9_HdGR8rRs3wZEUCdygWnAV9BLwAZASU",
  authDomain: "researchproject-4ffaa.firebaseapp.com",
  projectId: "researchproject-4ffaa",
  storageBucket: "researchproject-4ffaa.firebasestorage.app",
  messagingSenderId: "514532280661",
  appId: "1:514532280661:web:59ad5f9587be49a72547dc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };