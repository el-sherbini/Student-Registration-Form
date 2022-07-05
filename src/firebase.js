import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserSessionPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "next-level-technology.firebaseapp.com",
  projectId: "next-level-technology",
  storageBucket: "next-level-technology.appspot.com",
  messagingSenderId: "210441713521",
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const firebaseApp = initializeApp(firebaseConfig);

export const auth = initializeAuth(firebaseApp, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
