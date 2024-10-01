import {collection, doc, setDoc} from "firebase/firestore";
import {db, auth} from "../firebaseConfig.js";

class EventCreation {
    async writeEventData(eventData) {
        console.log('Attempting to write data...');
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("User not authenticated.");
                return;
            }
            const eventRef = doc(collection(db, "Events"));
            await setDoc(eventRef, eventData);
            eventData.refId = eventRef.id;
            console.log('Event created successfully! ID: ', eventRef.id);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };
}

export default new EventCreation();