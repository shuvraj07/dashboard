// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlGhbJFq0vOA5uv9Pr1sJNGSceNkntBq4",
  authDomain: "ekcamp-42a64.firebaseapp.com",
  projectId: "ekcamp-42a64",
  storageBucket: "ekcamp-42a64.firebasestorage.app",
  messagingSenderId: "105104782820",
  appId: "1:105104782820:web:2545d41f946be02d8743f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export { collection, getDocs };
export { signInWithPopup, signOut, onAuthStateChanged };
