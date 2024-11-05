// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트

const firebaseConfig = {
    apiKey: "AIzaSyDXW94ZM9llBheEl95JWQlaM_dSaQkBnvU",
    authDomain: "let-s-eat-4d945.firebaseapp.com",
    projectId: "let-s-eat-4d945",
    storageBucket: "let-s-eat-4d945.firebasestorage.app",
    messagingSenderId: "134815047077",
    appId: "1:134815047077:ios:5460405d88033c48cddc4c",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) // AsyncStorage를 사용하여 인증 상태 지속
});
const db = getFirestore(app); // Firestore 초기화

export { auth, db }; // db도 export
