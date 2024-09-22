import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

class SignUp {
    async signUpWithEmail(firstName, lastName, email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Password hashing (await for async operation)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Setting documents in Users collection
            await setDoc(doc(db, "Users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                isHost: false,
                uid: user.uid
            });

            console.log('Email sign-up successful:', user);
            return user;
        } catch (error) {
            console.error('Error signing up with email', error);
            throw new Error(error.message);

        }
    }
}

export default new SignUp();