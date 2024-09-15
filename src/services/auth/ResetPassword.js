import { auth } from '../../firebaseConfig.js';
import { sendPasswordResetEmail } from 'firebase/auth';

class PasswordReset {
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Error resetting password', error);
            throw error; // Re-throw the error to handle it in the calling code if needed
        }
    }
}

export default new PasswordReset();