import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out', error);
        throw error;
    }
}

export { signOutUser };