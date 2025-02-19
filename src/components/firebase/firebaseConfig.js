import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "My-App",
  authDomain: "parkdevblog.firebaseapp.com",
  projectId: "parkdevblog",
  storageBucket: "parkdevblog.firebasestorage.app",
  messagingSenderId: "ID",
  appId: "1:NUMBER:web:ID",
  measurementId: "G-ID"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth };
export { storage };
export { database };