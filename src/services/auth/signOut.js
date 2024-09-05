import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

class signOutUser{
    async signUserOut(){
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out', error);
            throw error;
        }
    }
}

export default new signOutUser;