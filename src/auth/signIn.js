import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig.js";

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // Handle result
    } catch (error) {
        console.error('Error signing in with Google', error);
    }
};

const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Handle userCredential
    } catch (error) {
        console.error('Error signing in with email', error);
    }
};


export { signInWithEmail, signInWithGoogle };