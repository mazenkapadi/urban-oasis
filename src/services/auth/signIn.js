import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebaseConfig.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

class SignIn {
    async signInWithGoogle() {
        console.log('Attempting to sign in with Google...');
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            console.log(userCredential)

            const nameParts = user.displayName ? user.displayName.split(" ") : [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts[1] || "";
            const email = user.email || "";
            const phoneNumber = user.phoneNumber || "";
            const photoURL = user.photoURL || "";
            const creationTime = user.metadata.creationTime || "";

            const userDoc = await getDoc(doc(db, "Users", user.uid));

            if (!userDoc.exists()) {
                const userData = {
                    uid: user.uid,
                    name: {
                        firstName,
                        lastName,
                    },
                    contact: {
                        email, // Google email
                        cellPhone: phoneNumber || '',
                    },
                    address: {
                        line1: '',
                        line2: '',
                        city: '',
                        state: '',
                        zip: '',
                    },
                    profilePicture: photoURL,
                    createdAt: creationTime,
                    hashedPassword: '',
                    birthday: '',
                    isHost: false,
                    hostType: 'individual',
                    ratings: {
                        ratingsTotaled: 0,
                        numRatings: 0,
                        overall: 0
                    },
                    updatedAt: new Date().toISOString(),
                };

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