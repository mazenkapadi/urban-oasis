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
            const userData = {
                uid: user.uid,
                name: {
                    firstName,
                    lastName,
                },
                contact: {
                    email: user.email,
                    cellPhone: '',
                },
                address: {
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    zip: '',
                },
                hashedPassword,
                birthday: '',
                isHost: false,
                hostType: 'individual',
                updatedAt: new Date().toISOString(),
                ratings: {
                    ratingsTotaled: 0,
                    numRatings: 0,
                    overall: 0
                }
            };

            await setDoc(doc(db, 'Users', user.uid), userData);
            console.log('Email sign-up successful:', user);

            const emailResponse = await fetch('https://urban-oasis490.vercel.app/api/signup-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                }),
            });

            if (!emailResponse.ok) {
                console.error('Error sending welcome email:', await emailResponse.text());
                throw new Error('Failed to send welcome email');
            }

            return user;
        } catch (error) {
            console.error('Error signing up with email', error);
            throw new Error(error.message);

        }
    }
}

export default new SignUp();