import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getBookmarkStatus = async (userId, eventId) => {
    const bookmarkId = `${userId}_${eventId}`; // Unique ID based on user and event
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        return bookmarkSnap.exists(); // Return true if the bookmark exists, false otherwise
    } catch (error) {
        console.error("Error checking bookmark status:", error);
        return false;
    }
};


export const toggleBookmark = async (userId, event) => {
    // Adjust eventId extraction to handle different structures
    const eventId = event.objectID || event.eventId || event.id;
    if (!eventId) {
        console.error("Error: eventId is undefined");
        return null;
    }
    const bookmarkId = `${userId}_${eventId}`;
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        if (bookmarkSnap.exists()) {
            // Delete the bookmark if it exists
            await deleteDoc(bookmarkRef);
            return false;
        } else {
            // Adjust event property access
            const eventTitle = event.basicInfo?.title || event.eventTitle || 'Untitled Event';
            const eventDateTime = event.eventDetails?.eventDateTime || event.eventDateTime || null;
            const eventLocation = event.basicInfo?.location?.label || event.eventLocation || 'Location not specified';

            // Create the bookmark if it doesn't exist
            await setDoc(bookmarkRef, {
                bookmarkId,
                userId,
                eventId,
                eventTitle,
                eventDateTime,
                eventLocation,
                bookmarkedAt: serverTimestamp(),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return null;
    }
};
