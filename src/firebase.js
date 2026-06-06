import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnLpurHsoeajpvupmTq65BZ8mCQjezmVk",
  authDomain: "richleaf-e8b87.firebaseapp.com",
  projectId: "richleaf-e8b87",
  storageBucket: "richleaf-e8b87.firebasestorage.app",
  messagingSenderId: "976398924206",
  appId: "1:976398924206:web:cb7d3a730753fed6e4f03f",
  measurementId: "G-DK3GZVMVBY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);