import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebaseConfig.js";

class signIn {

    async signInWithGoogle() {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google', error);
            throw error;
        }
    }

    async signInWithEmail(email, password) {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in with email', error);
            throw error;
        }
    }
}

export default new signIn();