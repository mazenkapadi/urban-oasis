import { auth } from '../../firebaseConfig.js';
import { sendPasswordResetEmail } from 'firebase/auth';

class PasswordReset {
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Error resetting password', error);
        }
    }
}

export default new PasswordReset();