import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

class SignIn {
    async signInWithGoogle() {
        console.log('Attempting to sign in with Google...');
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            // Extract information from the Google user object
            const nameParts = user.displayName ? user.displayName.split(" ") : [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts[1] || "";
            const email = user.email || ""; // Email should always be available from Google sign-in
            const phoneNumber = user.phoneNumber || ""; // May be null if not provided by Google
            const photoURL = user.photoURL || ""; // Profile picture URL
            const creationTime = user.metadata.creationTime || ""; // Account creation time

            // Check if user already exists in Firestore
            const userDoc = await getDoc(doc(db, "Users", user.uid));

            if (!userDoc.exists()) {
                // Set the user document with the same fields as the email sign-up, including additional info
                const userData = {
                    uid: user.uid,
                    name: {
                        firstName,
                        lastName,
                    },
                    contact: {
                        email, // Google email
                        cellPhone: phoneNumber || '', // Use phone number if available, otherwise initialize as empty
                    },
                    address: {
                        primary: {
                            line1: '',
                            line2: '',
                            city: '',
                            state: '',
                            zip: '',
                        },
                    },
                    profilePicture: photoURL, // Store Google profile picture
                    createdAt: creationTime, // The time when the user account was created
                    hashedPassword: '', // No password for Google sign-in
                    birthday: '', // Optional field to be updated later
                    isHost: false,
                    hostType: 'individual',
                    updatedAt: new Date().toISOString(),
                };

                // Save the new user data to Firestore
                await setDoc(doc(db, 'Users', user.uid), userData);
                console.log('Google sign-up successful and data saved to Firestore:', userData);
            } else {
                console.log('User already exists in Firestore:', userDoc.data());
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
