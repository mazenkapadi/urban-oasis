import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig.js";

const signInWithGoogle = async () => {
    try {
        const googleSignInResult = await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error('Error signing in with Google', error);
    }
};

const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in with email', error);
    }
};

const signInWithApple = async () => {
    try {
        const appleSignInResult = await signInWithPopup(auth, googleProvider);
                                // find a way for appleProvider not direct as googleProvider
    } catch (error) {
        console.error('Error signing in with Apple', error);
    }
};


export { signInWithEmail, signInWithGoogle, signInWithApple };