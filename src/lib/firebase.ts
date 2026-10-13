import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ14jjGAgV-1XzEvOqCi8vXKmKAMlNSB0",
  authDomain: "clothing-6f5de.firebaseapp.com",
  projectId: "clothing-6f5de",
  storageBucket: "clothing-6f5de.firebasestorage.app",
  messagingSenderId: "400919210276",
  appId: "1:400919210276:web:1d2abfac6a4be6a9e2abb1",
  measurementId: "G-6VCFE7T09Q"
};

// Initialize Firebase safely for Next.js SSR and Hot Reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics helper (only runs on client-side / browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export default app;