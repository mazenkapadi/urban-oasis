import { auth } from '../../firebaseConfig.js';
import { sendPasswordResetEmail } from 'firebase/auth';

class PasswordReset {
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent successfully to:', email);
            return { success: true, message: 'Password reset email sent successfully. Please check your inbox.' };
        } catch (error) {
            console.error('Error resetting password:', error);
            throw new Error('Failed to send password reset email. Please try again later.');
        }
    }
}
export default new PasswordReset();