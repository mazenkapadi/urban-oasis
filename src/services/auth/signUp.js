import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";

class SignUp {
    async signUpWithEmail(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential; // Return userCredential if needed
        } catch (error) {
            console.error('Error signing up with email', error);
            throw error; // Re-throw the error to handle it in the calling code if needed
        }
    }
}

export default new SignUp();