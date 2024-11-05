// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDXW94ZM9llBheEl95JWQlaM_dSaQkBnvU",
    authDomain: "let-s-eat-4d945.firebaseapp.com",
    projectId: "let-s-eat-4d945",
    storageBucket: "let-s-eat-4d945.firebasestorage.app",
    messagingSenderId: "134815047077",
    appId: "1:134815047077:ios:5460405d88033c48cddc4c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
