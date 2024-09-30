import { auth } from '../../firebaseConfig';
import { reauthenticateWithCredential, updateEmail, EmailAuthProvider } from 'firebase/auth';

export const handleEmailChange = async (currentEmail, newEmail, password, setModalError, setSuccessMessage, closeModal) => {
    const user = auth.currentUser;
    if (user) {
        const credential = EmailAuthProvider.credential(currentEmail, password);
        try {
            // Re-authenticate the user
            await reauthenticateWithCredential(user, credential);

            // Ensure new email is different
            if (newEmail !== currentEmail) {
                await updateEmail(user, newEmail);
                setSuccessMessage('Email successfully updated!');
                setModalError(''); // Clear any error
                closeModal(); // Close modal after successful email update
            } else {
                setModalError('New email cannot be the same as the current email.');
            }
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setModalError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                setModalError('Invalid email address. Please enter a valid email.');
            } else {
                setModalError('Failed to update email. Please try again.');
            }
        }
    }
};
