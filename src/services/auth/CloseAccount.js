// import { auth } from '../../firebaseConfig';
//
// export const handleAccountClosure = async () => {
//     const user = auth.currentUser;
//     if (user) {
//         try {
//
//             await user.delete();
//             alert("Account has been closed. We're sorry to see you go.");
//         } catch (error) {
//             console.error('Error closing account:', error);
//             alert('Failed to close account. Please try again.');
//         }
//     }
// };


import { auth } from '../../firebaseConfig';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export const handleAccountClosure = async (email, password, onSuccess) => {
    const user = auth.currentUser;
    if (user) {
        try {
            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(user, credential);

            await user.delete();
            alert("Account has been closed. We're sorry to see you go.");
            onSuccess(); // Call the success callback to handle navigation
        } catch (error) {
            console.error('Error closing account:', error);
            if (error.code === 'auth/requires-recent-login') {
                alert('Please re-login and try again to close your account.');
            } else {
                alert('Failed to close account. Please try again.');
            }
        }
    }
};
