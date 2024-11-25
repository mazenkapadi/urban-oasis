import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const FIREBASE_KEY = {
    apiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
    weatherApiKey: process.env.VITE_WEATHER_API_KEY,
    geoApiKey: process.env.VITE_WEATHER_API_KEY,
    gmKey: process.env.VITE_WEATHER_GM_KEY,
    locationKey: process.env.VITE_LOCATION_KEY,
}
const app = initializeApp(FIREBASE_KEY);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);



export { db, auth, googleProvider, storage };