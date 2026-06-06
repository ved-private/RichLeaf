import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkoh7MvZsVtXuc9a0aNVORu0gzC0qyk7I",
  authDomain: "richleaf.vercel.app",
  projectId: "richleaf-c75bd",
  storageBucket: "richleaf-c75bd.firebasestorage.app",
  messagingSenderId: "510924443852",
  appId: "1:510924443852:web:679b8320e253b51958f269",
  measurementId: "G-FBKG20HB89"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);