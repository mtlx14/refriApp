import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-WPf1iAQ54oRths-fr1ayZsOm2v9BQko",
  authDomain: "vistasgestion.firebaseapp.com",
  projectId: "vistasgestion",
  storageBucket: "vistasgestion.firebasestorage.app",
  messagingSenderId: "1052740350992",
  appId: "1:1052740350992:web:8d6ed8f210180df4658695",
  measurementId: "G-0W9S2Z9V5M",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
