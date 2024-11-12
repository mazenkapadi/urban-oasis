import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Function to check if an event is bookmarked
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

// Function to toggle the bookmark status
export const toggleBookmark = async (userId, event) => {
    const eventId = event.objectID; // Use objectID instead of id
    const bookmarkId = `${userId}_${eventId}`;
    const bookmarkRef = doc(db, "Bookmarks", bookmarkId);

    try {
        const bookmarkSnap = await getDoc(bookmarkRef);
        if (bookmarkSnap.exists()) {
            // Delete the bookmark if it exists
            await deleteDoc(bookmarkRef);
            return false;
        } else {
            // Create the bookmark if it doesn't exist
            await setDoc(bookmarkRef, {
                bookmarkId,
                userId,
                eventId,
                eventTitle: event.basicInfo?.title || 'Untitled Event',
                eventDateTime: event.eventDetails?.eventDateTime || null,
                eventLocation: event.basicInfo?.location?.label || 'Location not specified',
                bookmarkedAt: serverTimestamp(),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return null; // Return null to indicate an error
    }
};
