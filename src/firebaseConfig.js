import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const FIREBASE_KEY = {
    apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
    weatherApiKey: import.meta.env.VITE_WEATHER_API_KEY,
    geoApiKey: import.meta.env.VITE_WEATHER_API_KEY,
    gmKey: import.meta.env.VITE_WEATHER_GM_KEY,
    locationKey: import.meta.env.VITE_LOCATION_KEY,
}
const app = initializeApp(FIREBASE_KEY);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);



export { db, auth, googleProvider, storage };