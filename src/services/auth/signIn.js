// import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../firebaseConfig.js";
//
// class signIn {
//
//     async signInWithGoogle() {
//         try {
//             return await signInWithPopup(auth, googleProvider);
//         } catch (error) {
//             console.error('Error signing in with Google', error);
//             throw error;
//         }
//     }
//
//     async signInWithEmail(email, password) {
//         try {
//             return await signInWithEmailAndPassword(auth, email, password);
//         } catch (error) {
//             console.error('Error signing in with email', error);
//             throw error;
//         }
//     }
// }
//
// export default new signIn();

// signIn.js
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebaseConfig.js";

class SignIn {
    async signInWithGoogle() {
        console.log('Attempting to sign in with Google...');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in successful:', result);
            return result.user;
        } catch (error) {
            console.error('Errosr signing in with Google:', error);
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
