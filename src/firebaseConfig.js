import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import FIREBASE_KEY from "./APIKEY_SECRETS/FIREBASE_KEY.js"
import {getStorage} from "firebase/storage";


const app = initializeApp(FIREBASE_KEY);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);



export { db, auth, googleProvider, storage };
