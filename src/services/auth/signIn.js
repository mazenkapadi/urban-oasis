import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate} from "react-router-dom";

class SignIn {
    async signInWithGoogle() {
        console.log('Attempting to sign in with Google...');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userDoc = await getDoc(doc(db,"Users", user.uid));
            if(!userDoc.exists()) {
                await setDoc(doc(db, "Users", user.uid), {
                    prefix: "",
                    firstName: user.displayName.split(" ") [0],
                    lastName: user.displayName.split(" ") [1] || "",
                    email: user.email,
                    createdAt: new Date(),
                    isHost: false,
                });
            }
            return user;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw new Error('Failed to sign in with Google: ' + error.message);
        }
    }

    async signInWithEmail(email, password) {
        console.log('Attempting to sign in with email:', email);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Email sign-in successful:', userCredential);
            return userCredential.user;
        } catch (error) {
            console.error('Error signing in with email:', error);
            throw new Error('Failed to sign in with email: ' + error.message);
        }
    }
}

export default new SignIn();
