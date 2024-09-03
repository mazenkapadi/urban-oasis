// src/firebaseInit.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import FIREBASE_KEY from "./FIREBASE_KEY.js"
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';


// Initialize Firebase
const app = initializeApp(FIREBASE_KEY);


// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult
};


const db = getFirestore(app);

const analytics = getAnalytics(app);

export { db };

export { analytics };