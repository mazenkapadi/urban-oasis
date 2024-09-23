import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

class SignIn {
    async signInWithGoogle() {
        console.log('Attempting to sign in with Google...');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user already exists in Firestore
            const userDoc = await getDoc(doc(db, "Users", user.uid));
            if (!userDoc.exists()) {
                // User does not exist, create a new user document
                const nameParts = user.displayName ? user.displayName.split(" ") : [];
                await setDoc(doc(db, "Users", user.uid), {
                    firstName: nameParts[0],
                    lastName: nameParts[1] || "",
                    email: user.email,
                    createdAt: new Date(),
                    isHost: false,
                });
                console.log('User data saved to Firestore:', {
                    uid: user.uid,
                    email: user.email,
                    firstName: nameParts[0],
                    lastName: nameParts[1],
                });
            } else {
                console.log('User already exists:', userDoc.data());
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
