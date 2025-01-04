import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "My_API_KEY",
  authDomain: "parkdevblog.firebaseapp.com",
  projectId: "parkdevblog",
  storageBucket: "parkdevblog.firebasestorage.app",
  messagingSenderId: "624615678260",
  appId: "MY_APP_ID",
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