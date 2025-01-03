import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "MY_Firebase_Key",
  authDomain: "parkdevblog.firebaseapp.com",
  projectId: "parkdevblog",
  storageBucket: "parkdevblog.firebasestorage.app",
  messagingSenderId: "624615678260",
  appId: "AppId",
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