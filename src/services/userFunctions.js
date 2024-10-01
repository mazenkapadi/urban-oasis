// userFunctions.js
import { userData } from "./dataObjects/userData.js";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

export async function createUser(userData) {
    // Basic validation - you can add more comprehensive validation here
    if (!userData.userId || !userData.name || !userData.contact) {
        throw new Error('Missing required fields in userData');
    }

    try {
        await setDoc(doc(db, 'Users', userData.userId), userData);
        console.log('User created successfully!');
    } catch (error) {
        console.error('Error creating user: ', error);
        throw error; // Re-throw the error for handling in the component
    }
}

export async function updateUser(userId, userData) {
    // Basic validation - you can add more comprehensive validation here
    if (!userId || !userData) {
        throw new Error('Missing userId or userData');
    }

    try {
        await setDoc(doc(db, 'Users', userId), userData, {merge: true});
        console.log('User updated successfully!');
    } catch (error) {
        console.error('Error updating user: ', error);
        throw error;
    }
}

export async function getUser(userId) {
    if (!userId) {
        throw new Error('Missing userId');
    }

    try {
        const docRef = doc(db, 'Users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user: ', error);
        throw error;
    }
}