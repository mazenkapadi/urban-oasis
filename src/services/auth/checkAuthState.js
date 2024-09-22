import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

function checkAuthState(){
    onAuthStateChanged(auth, (user) =>{
        if(user){
            console.log('User is signed in');
        } else {
            console.log("User is not signed in.");
        }
    });
}

checkAuthState();