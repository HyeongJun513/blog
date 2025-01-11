import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAaduAavCCwknw0P-0nbjjFGHY7TEpnGqo",
  authDomain: "parkdevblog.firebaseapp.com",
  projectId: "parkdevblog",
  storageBucket: "parkdevblog.firebasestorage.app",
  messagingSenderId: "624615678260",
  appId: "1:624615678260:web:bb36fe75e98d73bc9e0561",
  measurementId: "G-RQ3LNFLW9S"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth };
export { storage };
export { database };