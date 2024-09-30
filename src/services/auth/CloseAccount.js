import { auth } from '../../firebaseConfig';

export const handleAccountClosure = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Firebase does not directly provide a close account API, so you'll have to delete the account.
            await user.delete();
            alert("Account has been closed. We're sorry to see you go.");
        } catch (error) {
            console.error('Error closing account:', error);
            alert('Failed to close account. Please try again.');
        }
    }
};
