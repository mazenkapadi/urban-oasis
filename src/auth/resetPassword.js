import { auth } from "../firebaseConfig.js";
import { sendPasswordResetEmail } from "firebase/auth";

const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error resetting password', error);
    }
};

export { resetPassword };