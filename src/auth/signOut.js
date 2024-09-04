import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';

const signUserOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out', error);
    }
}

export { signUserOut };