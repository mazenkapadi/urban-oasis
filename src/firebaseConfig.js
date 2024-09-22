import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import FIREBASE_KEY from "./APIKEY_SECRETS/FIREBASE_KEY.js"
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
} from 'firebase/auth';

const app = initializeApp(FIREBASE_KEY);

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

export { db };
