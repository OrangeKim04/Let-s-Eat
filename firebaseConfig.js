// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXW94ZM9llBheEl95JWQlaM_dSaQkBnvU",
  authDomain: "let-s-eat-4d945.firebaseapp.com", 
  projectId: "let-s-eat-4d945",
  storageBucket: "let-s-eat-4d945.firebasestorage.app",
  messagingSenderId: "134815047077",
  appId: "1:134815047077:ios:5460405d88033c48cddc4c",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase has been initialized successfully!");

// Firebase Auth 초기화
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(app);
export { auth };