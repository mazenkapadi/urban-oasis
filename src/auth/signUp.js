import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.js";

const signUpWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing up with email', error);
    }
};

export { signUpWithEmail };